import { Knex } from 'knex';
import { BasaltPassword } from '@basalt-lab/basalt-helper';

import { ICrendentialDTO, IRoleDTO } from '@/Data/DTO/Models';
import { RoleModel, CredentialModel, CredentialRoleModel } from '@/Infrastructure/Repository/Model';

const credentialDTO: Partial<ICrendentialDTO>[] = [
    {
        username: 'andesite',
        email: 'andesite-lab@proton.me',
        password: '&€s1tE-2O24!',
    }
];

export class InitAdminCredential implements Knex.Seed {
    public async seed(knex: Knex): Promise<void> {
        try {
            await knex.transaction(async (transaction): Promise<void> => {
                const roleModel: RoleModel = new RoleModel();
                const role: Pick<IRoleDTO, 'id'> = await roleModel.findOne([{ role: 'admin' }], { id: true }, {
                    transaction
                }) as Pick<IRoleDTO, 'id'>;

                const credentialModel: CredentialModel = new CredentialModel();
                const credentialRoleModel: CredentialRoleModel = new CredentialRoleModel();

                await Promise.all(credentialDTO.map(async (credential: Partial<ICrendentialDTO>): Promise<Partial<ICrendentialDTO>> => {
                    credential.password = await BasaltPassword.hashPassword(credential.password as string);
                    return credential;
                }));

                const credentials: Pick<ICrendentialDTO, 'uuid'>[] = await credentialModel.insert(credentialDTO, { uuid: true }, {
                    transaction
                });

                for (const credential of credentials)
                    await credentialRoleModel.insert([{ credentialUuid: credential?.uuid, roleId: role?.id }], { id: true }, {
                        transaction
                    });
            });
        } catch (_) { /* empty */ }
    }
}
