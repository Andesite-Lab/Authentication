import { BasaltToken, BasaltTokenExpiry, IBasaltTokenSignResult } from '@basalt-lab/basalt-auth';
import { verifyPassword } from '@basalt-lab/basalt-helper';

import { BasaltAuthorization } from '@/Common/Tools';
import { ErrorUseCase, ErrorUseCaseKey } from '@/Common/Error';
import { packageJsonConfig } from '@/Config';
import { ILoginDTO } from '@/Data/DTO';
import { ICrendentialDTO, IRoleDTO, IPermissionDTO } from '@/Data/DTO/Model/StaticDB/authentication';
import { CredentialModel, RolePermissionModel } from '@/Infrastructure/Repository/Model';
import { Dragonfly } from '@/Infrastructure/Store';

export class Login {
    private getCredential(body: Partial<ILoginDTO>): Promise<Pick<ICrendentialDTO, 'uuid' | 'password' | 'username' | 'email'>> {
        const credentialToSearch: Partial<ICrendentialDTO> = body.username ? { username: body.username } : { email: body.email as string };

        const credentialModel: CredentialModel = new CredentialModel();
        return credentialModel.findOne([credentialToSearch], {
            uuid: true,
            password: true,
            username: true,
            email: true
        }) as Promise<Pick<ICrendentialDTO, 'uuid' | 'password' | 'username' | 'email'>>;
    }

    private getRolePermission(credentialUUID: string): Promise<Pick<(IRoleDTO & IPermissionDTO), 'role' | 'permission'>[]> {
        const rolePermissionModel: RolePermissionModel = new RolePermissionModel();
        return rolePermissionModel.findAllJoinRoleAndPermissionByCredential(credentialUUID, {
            role: true,
            permission: true
        });
    }

    private checkPassword(password: string, hash: string): Promise<boolean> {
        return verifyPassword(password, hash);
    }

    public async execute (body: Partial<ILoginDTO>): Promise<string> {
        const credentialDTO: Pick<ICrendentialDTO, 'uuid' | 'password' | 'username' | 'email'> = await this.getCredential(body);
        
        if (!await this.checkPassword(body.password as string, credentialDTO.password))
            throw new ErrorUseCase({
                key: ErrorUseCaseKey.PASSWORD_NOT_VALID,
            });
        
        const raw: Pick<(IRoleDTO & IPermissionDTO), 'role' | 'permission'>[] = await this.getRolePermission(credentialDTO.uuid);
        const rolePermission: Record<string, string[]> = BasaltAuthorization.instance.groupPermissionByRole(raw);

        const basaltToken: BasaltToken = new BasaltToken();
        const signResult: IBasaltTokenSignResult = basaltToken.sign({
            uuid: credentialDTO.uuid,
            username: credentialDTO.username,
            email: credentialDTO.email,
            rolePermission,
        }, BasaltTokenExpiry.ONE_DAY, `${packageJsonConfig.name}-${packageJsonConfig.version}`, 'andesite');

        Dragonfly.instance.redis.hset(`${credentialDTO.uuid}:token`, signResult.uuid, signResult.publicKey);
        Dragonfly.instance.redis.expire(`${credentialDTO.uuid}:token`, BasaltTokenExpiry.ONE_DAY / 1000);
        return signResult.token;
    }
}
