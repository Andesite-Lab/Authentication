import { BasaltToken, BasaltTokenExpiry, IBasaltTokenSignResult } from '@basalt-lab/basalt-auth';
import { BasaltPassword } from '@basalt-lab/basalt-helper';

import { BasaltAuthorization } from '@/Common';
import { ErrorUseCase, ErrorUseCaseKey } from '@/Common/Error';
import { packageJsonConfiguration } from '@/Config';
import { ILoginDTO } from '@/Data/DTO';
import { ICrendentialDTO } from '@/Data/DTO/Models';
import { ICredentialRoleFkRoleAndRolePermissionAndPermissionDTO } from '@/Data/DTO/Models/Fk';
import { CredentialModel, RolePermissionModel } from '@/Infrastructure/Repository/Model';
import { Dragonfly } from '@/Infrastructure/Store';

export class Login {
    public async execute (body: Partial<ILoginDTO>): Promise<string> {
        const credentialToSearch: Partial<ICrendentialDTO> = body.username ? { username: body.username } : { email: body.email };
        const credentialModel: CredentialModel = new CredentialModel();
        const rolePermissionModel: RolePermissionModel = new RolePermissionModel();

        const credentialDTO: Pick<ICrendentialDTO, 'uuid' | 'password' | 'username'> =
            await credentialModel.findOne([credentialToSearch], {
                uuid: true,
                password: true,
                username: true,
            }) as Pick<ICrendentialDTO, 'uuid' | 'password' | 'username'>;

        if (!await BasaltPassword.verifyPassword(body.password as string, credentialDTO.password))
            throw new ErrorUseCase({
                key: ErrorUseCaseKey.PASSWORD_NOT_VALID,
            });

        const raw: Pick<ICredentialRoleFkRoleAndRolePermissionAndPermissionDTO, 'role' | 'permission'>[] =
            await rolePermissionModel.findAllJoinRoleAndPermissionByCredential(credentialDTO.uuid, {
                role: true,
                permission: true
            });
        const rolePermission: Record<string, string[]> = BasaltAuthorization.instance.groupPermissionByRole(raw);
        const basaltToken: BasaltToken = new BasaltToken();
        const signResult: IBasaltTokenSignResult = basaltToken.sign({
            uuid: credentialDTO.uuid,
            username: credentialDTO.username,
            rolePermission,
        }, BasaltTokenExpiry.ONE_DAY, `${packageJsonConfiguration.name}-${packageJsonConfiguration.version}`, 'andesite');

        Dragonfly.instance.redis.hset(`${credentialDTO.uuid}:token`, signResult.uuid, signResult.publicKey);
        Dragonfly.instance.redis.expire(`${credentialDTO.uuid}:token`, BasaltTokenExpiry.ONE_DAY / 1000);
        return signResult.token;
    }
}
