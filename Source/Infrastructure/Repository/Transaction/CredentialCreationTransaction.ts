import { ICrendentialDTO, IRoleDTO } from '@/Data/DTO/Models';
import { DatabaseManager } from '@/Infrastructure/Database';
import { CredentialModel, CredentialRoleModel, RoleModel } from '@/Infrastructure/Repository/Model';

export class CredentialCreationTransaction {
    public async execute(credentialDTO: Partial<ICrendentialDTO>): Promise<void> {
        const credentialModel: CredentialModel = new CredentialModel();
        const roleModel: RoleModel = new RoleModel();
        const credentialRoleModel: CredentialRoleModel = new CredentialRoleModel();
        const knex = DatabaseManager.instance.getDatabaseInstance('authentication');
        await knex?.transaction(async (transaction): Promise<void> => {
            const [credential]: Pick<ICrendentialDTO, 'uuid'>[] = await credentialModel.insert([credentialDTO], { uuid: true }, {
                transaction
            });

            const role: Pick<IRoleDTO, 'id'> = await roleModel.findOne([{ role: 'user' }], { id: true }, {
                transaction
            }) as Pick<IRoleDTO, 'id'>;

            await credentialRoleModel.insert([{ credentialUuid: credential?.uuid, roleId: role?.id }], { id: true }, {
                transaction
            });
        });
    }
}
