import { BasaltPassword } from '@basalt-lab/basalt-helper';

import { IRegisterDTO } from '@/Data/DTO';
import { CredentialCreationTransaction } from '@/Infrastructure/Repository/Transaction';
import { MailerProducer } from '@/Infrastructure/RedPanda/Producer';

export class Register {
    private readonly _credentialCreationTransaction: CredentialCreationTransaction = new CredentialCreationTransaction();
    private readonly _mailerProducer: MailerProducer = new MailerProducer();

    public async execute (body: IRegisterDTO): Promise<void> {
        body.password = await BasaltPassword.hashPassword(body.password);
        await this._credentialCreationTransaction.execute(body);
        await this._mailerProducer.execute(body.username, body.email, 'welcome');
    }
}
