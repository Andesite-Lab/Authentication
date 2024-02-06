import { MainDatabase } from '@/Infrastructure/Database/Main/MainDatabase';
import { CredentialModel, CredentialRoleModel, RoleModel } from '@/Infrastructure/Repository/Model';
import { ICrendentialDTO, IRoleDTO } from '@/Data/DTO/Models';

export class CredentialCreationTransaction {

    public async execute(credentialDTO: Partial<ICrendentialDTO>): Promise<void> {
        const knex = MainDatabase.instance.database;
        const credentialModel: CredentialModel = new CredentialModel();
        const roleModel: RoleModel = new RoleModel();
        const credentialRoleModel: CredentialRoleModel = new CredentialRoleModel();

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
