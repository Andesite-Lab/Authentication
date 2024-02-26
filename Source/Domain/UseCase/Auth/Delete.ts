import { BasaltToken } from '@basalt-lab/basalt-auth';

import { ITokenPayloadDTO } from '@/Data/DTO';
import { ICrendentialDTO } from '@/Data/DTO/Models';
import { MailerProducer, MailTypes } from '@/Infrastructure/RedPanda/Producer';
import { CredentialModel } from '@/Infrastructure/Repository/Model';
import { Dragonfly } from '@/Infrastructure/Store';

export class Delete {
    public async execute (token: string, language: string = 'en'): Promise<void> {
        const credentialModel: CredentialModel = new CredentialModel();
        const basaltToken: BasaltToken = new BasaltToken();
        const payloadToken: ITokenPayloadDTO = basaltToken.getPayload(token);
        Dragonfly.instance.redis.del(`${payloadToken.uuid}:token`);
        const [credential]: Pick<ICrendentialDTO, 'username' | 'email'>[] = await credentialModel.delete([{
            uuid: payloadToken.uuid,
        }], {
            email: true,
            username: true,
        });
        await MailerProducer.execute({
            username: credential.username,
            email: credential.email,
        },{
            to: credential.email,
            mailType: MailTypes.DELETE_ACCOUNT,
            language
        });
    }
}
