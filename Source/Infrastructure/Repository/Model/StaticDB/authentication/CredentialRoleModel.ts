import { ICredentialRoleDTO } from '@/Data/DTO/Models';
import { AbstractModel } from '@/Infrastructure/Repository/Model';

export class CredentialRoleModel extends AbstractModel<ICredentialRoleDTO> {
    public constructor() {
        super('credential_role', 'authentication');
    }
}
