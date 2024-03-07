import { ICrendentialDTO } from '@/Data/DTO/Model/StaticDB/authentication';
import { AbstractModel } from '@/Infrastructure/Repository/Model';

export class CredentialModel extends AbstractModel<ICrendentialDTO>{
    public constructor() {
        super('credential', 'authentication');
    }
}
