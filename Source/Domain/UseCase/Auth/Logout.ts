import { BasaltToken } from '@basalt-lab/basalt-auth';

import { ITokenPayloadDTO } from '@/Data/DTO';
import { Dragonfly } from '@/Infrastructure/Store';

export class Logout {
    public execute (token: string): void {
        const basaltToken: BasaltToken = new BasaltToken();
        const tokenUuid: string = basaltToken.getTokenUuid(token);
        const tokenPayload: ITokenPayloadDTO = basaltToken.getPayload(token);
        Dragonfly.instance.redis.hdel(`${tokenPayload.uuid}:token`, tokenUuid);
    }
}
