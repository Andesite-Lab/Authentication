import { BasaltToken } from '@basalt-lab/basalt-auth';
import { BasaltPassword } from '@basalt-lab/basalt-helper';

import { ITokenPayloadDTO } from '@/Data/DTO';
import { ICrendentialDTO } from '@/Data/DTO/Model/StaticDB/authentication';
import { CredentialModel } from '@/Infrastructure/Repository/Model';
import { Dragonfly } from '@/Infrastructure/Store';

export class Update {
    public async execute (token: string, newCredential: Partial<ICrendentialDTO>): Promise<Pick<ICrendentialDTO, 'username' | 'email'>[]> {
        const credentialModel: CredentialModel = new CredentialModel();
        const basaltToken: BasaltToken = new BasaltToken();
        const payloadToken: ITokenPayloadDTO = basaltToken.getPayload(token);
        if (newCredential.password) {
            newCredential.password = await BasaltPassword.hashPassword(newCredential.password);
            Dragonfly.instance.redis.del(`${payloadToken.uuid}:token`);
        }
        return await credentialModel.update(newCredential, [{
            uuid: payloadToken.uuid,
        }], {
            username: true,
            email: true,
        });
    }
}
