import { Dragonfly } from '@/Infrastructure/Store';

export class Logout {
    public execute (tokenUuid: string): void {
        Dragonfly.instance.redis.del(tokenUuid);
    }
}
