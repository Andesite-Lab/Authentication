import { Dragonfly } from '@/Infrastructure/Store';
import { BasaltToken } from '@basalt-lab/basalt-auth';

import { CredentialModel } from '@/Infrastructure/Repository/Model';
import { ITokenPayloadDTO } from '@/Data/DTO';
import { ICrendentialDTO } from '@/Data/DTO/Models';
import { MailerProducer, MailTypes } from '@/Infrastructure/RedPanda/Producer';

export class Delete {
    private readonly _credentialModel: CredentialModel = new CredentialModel();
    private readonly _mailerProducer: MailerProducer = new MailerProducer();

    public async execute (token: string): Promise<void> {
        const basaltToken: BasaltToken = new BasaltToken();
        const tokenUuid: string = basaltToken.getTokenUuid(token);
        const payloadToken: ITokenPayloadDTO = basaltToken.getPayload(token);
        Dragonfly.instance.redis.del(tokenUuid);
        const [credential]: Pick<ICrendentialDTO, 'username' | 'email'>[] = await this._credentialModel.delete([{
            uuid: payloadToken.uuid,
        }], {
            email: true,
            username: true,
        });
        await this._mailerProducer.execute({
            username: credential.username,
            email: credential.email,
        },MailTypes.DELETE_ACCOUNT);
    }
}
