import { Knex } from 'knex';

import { AbstractSeedSourceCreator } from '@/Infrastructure/Database';
import { InitAdminCredential, RoleAndPermission } from '.';

export class SeedSource extends AbstractSeedSourceCreator {
    public constructor() {
        super(new Map<string, Knex.Seed>([
            ['RoleAndPermission', new RoleAndPermission()],
            ['InitAdminCredential', new InitAdminCredential()],
        ]));
    }
}
