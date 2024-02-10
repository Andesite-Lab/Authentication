import { Dragonfly } from '@/Infrastructure/Store';
import { BasaltToken } from '@basalt-lab/basalt-auth';

import { CredentialModel } from '@/Infrastructure/Repository/Model';
import { ITokenPayloadDTO } from '@/Data/DTO';
import { ICrendentialDTO } from '@/Data/DTO/Models';
import { MailerProducer, MailTypes } from '@/Infrastructure/RedPanda/Producer';

export class Delete {
    private readonly _credentialModel: CredentialModel = new CredentialModel();
    private readonly _mailerProducer: MailerProducer = new MailerProducer();

    public async execute (token: string, language: string = 'en'): Promise<void> {
        const basaltToken: BasaltToken = new BasaltToken();
        const payloadToken: ITokenPayloadDTO = basaltToken.getPayload(token);
        Dragonfly.instance.redis.del(`${payloadToken.uuid}:token`);
        const [credential]: Pick<ICrendentialDTO, 'username' | 'email'>[] = await this._credentialModel.delete([{
            uuid: payloadToken.uuid,
        }], {
            email: true,
            username: true,
        });
        await this._mailerProducer.execute({
            username: credential.username,
            email: credential.email,
        },{
            to: credential.email,
            mailType: MailTypes.DELETE_ACCOUNT,
            language
        });
    }
}
