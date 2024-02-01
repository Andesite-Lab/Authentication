import { BasaltToken } from '@basalt-lab/basalt-auth';
import { BasaltPassword } from '@basalt-lab/basalt-helper';

import { ICrendentialDTO } from '@/Data/DTO/Models';
import { CredentialModel } from '@/Infrastructure/Repository/Model';
import { ITokenPayloadDTO } from '@/Data/DTO';
import { Dragonfly } from '@/Infrastructure/Store';

export class Update {
    private readonly _credentialModel: CredentialModel = new CredentialModel();

    public async execute (token: string, newCredential: Partial<ICrendentialDTO>): Promise<Pick<ICrendentialDTO, 'username' | 'email'>[]> {
        const basaltToken: BasaltToken = new BasaltToken();
        const payloadToken: ITokenPayloadDTO = basaltToken.getPayload(token);
        if (newCredential.password) {
            newCredential.password = await BasaltPassword.hashPassword(newCredential.password);
            Dragonfly.instance.redis.del(`${payloadToken.uuid}:token`);
        }
        return await this._credentialModel.update(newCredential, [{
            uuid: payloadToken.uuid,
        }], {
            username: true,
            email: true,
        });
    }
}
