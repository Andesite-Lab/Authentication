import { Knex } from 'knex';

import { AbstractMigrationSourceCreator } from '@/Infrastructure/Database';
import {} from '.';

export class MigrationSource extends AbstractMigrationSourceCreator {
    public constructor() {
        super(new Map<string, Knex.Migration>([]));
    }
}
