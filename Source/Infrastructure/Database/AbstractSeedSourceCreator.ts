import { Knex } from 'knex';

export abstract class AbstractSeedSourceCreator implements Knex.SeedSource<unknown> {
    private _seeds: Map<string, Knex.Seed>;

    protected constructor(seeds: Map<string, Knex.Seed>) {
        this._seeds = seeds;
    }

    public getSeeds(): Promise<string[]> {
        return Promise.resolve(Array.from(this._seeds.keys()));
    }

    public getSeed(seed: string): Promise<Knex.Seed> {
        return new Promise((resolve, reject): void => {
            const seedFunction: Knex.Seed | undefined = this._seeds.get(seed);
            if (seedFunction)
                resolve(seedFunction);
            else
                reject(new Error(`Seed not found: ${seed}`));
        });
    }
}