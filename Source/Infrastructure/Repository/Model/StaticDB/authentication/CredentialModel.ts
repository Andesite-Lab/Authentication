import { ICrendentialDTO } from '@/Data/DTO/Models';
import { AbstractModel } from '@/Infrastructure/Repository/Model';

export class CredentialModel extends AbstractModel<ICrendentialDTO>{
    public constructor() {
        super('credential', 'authentication');
    }
}
