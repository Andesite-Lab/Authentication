import { hashPassword } from '@basalt-lab/basalt-helper';

import { IRegisterDTO } from '@/Data/DTO';
import { MailerProducer, MailTypes } from '@/Infrastructure/RedPanda/Producer';
import { CredentialCreationTransaction } from '@/Infrastructure/Repository/Transaction';

export class Register {
    public async execute (body: IRegisterDTO, language: string = 'en'): Promise<void> {
        body.password = await hashPassword(body.password);
        const credentialCreationTransaction: CredentialCreationTransaction = new CredentialCreationTransaction();
        await credentialCreationTransaction.execute(body);
        await MailerProducer.execute({
            username: body.username,
            email: body.email,
        },{
            to: body.email,
            mailType: MailTypes.WELCOME,
            language
        });
    }
}
