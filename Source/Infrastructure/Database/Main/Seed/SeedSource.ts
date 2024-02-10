import { Knex } from 'knex';

import { InitAdminCredential, RoleAndPermission } from '@/Infrastructure/Database/Main/Seed';

export class SeedSource implements Knex.SeedSource<unknown> {
    private seeds: Map<string, Knex.Seed> = new Map<string, Knex.Seed>(
        [
            ['RoleAndPermission', new RoleAndPermission()],
            ['InitAdminCredential', new InitAdminCredential()],
        ]
    );

    public getSeeds(): Promise<string[]> {
        return Promise.resolve(Array.from(this.seeds.keys()));
    }

    public getSeed(seed: string): Promise<Knex.Seed> {
        return new Promise((resolve, reject): void => {
            const seedFunction: Knex.Seed | undefined = this.seeds.get(seed);
            if (seedFunction)
                resolve(seedFunction);
            else
                reject(new Error(`Seed not found: ${seed}`));
        });
    }
}
