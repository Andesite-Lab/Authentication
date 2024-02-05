import { BasaltPassword } from '@basalt-lab/basalt-helper';
import { BasaltToken, IBasaltTokenSignResult } from '@basalt-lab/basalt-auth';

import { CredentialModel, RolePermissionModel } from '@/Infrastructure/Repository/Model';
import { ErrorUseCase, ErrorUseCaseKey } from '@/Common/Error';
import { BasaltAuthorization } from '@/Common';
import { Dragonfly } from '@/Infrastructure/Store';
import { packageJsonConfiguration } from '@/Config';
import { ILoginDTO } from '@/Data/DTO';
import { ICredentialRoleFkRoleAndRolePermissionAndPermissionDTO } from '@/Data/DTO/Models/Fk';
import { ICrendentialDTO } from '@/Data/DTO/Models';

export class Login {
    private readonly _credentialModel: CredentialModel = new CredentialModel();
    private readonly _rolePermissionModel: RolePermissionModel = new RolePermissionModel();
    private readonly _expiration: number = 1000 * 60 * 60 * 24; // 1d

    public async execute (body: Partial<ILoginDTO>): Promise<string> {
        const credentialToSearch: Partial<ICrendentialDTO> = body.username ? { username: body.username } : { email: body.email };

        const credentialDTO: Pick<ICrendentialDTO, 'uuid' | 'password' | 'username'> =
            await this._credentialModel.findOne([credentialToSearch], {
                uuid: true,
                password: true,
                username: true,
            }) as Pick<ICrendentialDTO, 'uuid' | 'password' | 'username'>;

        if (!await BasaltPassword.verifyPassword(body.password as string, credentialDTO.password))
            throw new ErrorUseCase({
                key: ErrorUseCaseKey.PASSWORD_NOT_VALID,
            });

        const raw: Pick<ICredentialRoleFkRoleAndRolePermissionAndPermissionDTO, 'role' | 'permission'>[] =
            await this._rolePermissionModel.findAllJoinRoleAndPermissionByCredential(credentialDTO.uuid, {
                role: true,
                permission: true
            });
        const rolePermission: Record<string, string[]> = BasaltAuthorization.instance.groupPermissionByRole(raw);
        const basaltToken: BasaltToken = new BasaltToken();
        const signResult: IBasaltTokenSignResult = basaltToken.sign(this._expiration, {
            uuid: credentialDTO.uuid,
            username: credentialDTO.username,
            rolePermission,
        }, `${packageJsonConfiguration.name}-${packageJsonConfiguration.version}`, 'andesite');

        Dragonfly.instance.redis.hset(`${credentialDTO.uuid}:token`, signResult.uuid, signResult.publicKey);
        Dragonfly.instance.redis.expire(`${credentialDTO.uuid}:token`, this._expiration / 1000);
        return signResult.token;
    }
}
