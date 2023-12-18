import { AbstractModel } from './AbstractModel';
import { ICredentialRoleDTO } from '@/Data/DTO/Models';

export class CredentialRoleModel extends AbstractModel<ICredentialRoleDTO> {
    constructor() {
        super('credential_role');
    }
}
