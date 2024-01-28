import { AbstractModel } from '@/Infrastructure/Repository/Model';
import { ICrendentialDTO } from '@/Data/DTO/Models';

export class CredentialModel extends AbstractModel<ICrendentialDTO>{
    public constructor() {
        super('credential');
    }
}
