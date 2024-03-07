import { Knex } from 'knex';

import { AbstractSeedSourceCreator } from '@/Infrastructure/Database';
import { } from '.';

export class SeedSource extends AbstractSeedSourceCreator {
    public constructor() {
        super(new Map<string, Knex.Seed>([]));
    }
}
