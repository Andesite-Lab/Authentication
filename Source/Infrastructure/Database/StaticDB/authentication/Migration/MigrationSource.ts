import { Knex } from 'knex';

import { AbstractMigrationSourceCreator } from '@/Infrastructure/Database';
import { CreateCredentialRoleTable, CreateCredentialTable, CreateFunctionUpdatedAt, CreatePermissionTable, CreateRolePermissionTable, CreateRoleTable } from '.';

export class MigrationSource extends AbstractMigrationSourceCreator {
    public constructor() {
        super(new Map<string, Knex.Migration>([
            ['CreateFunctionUpdatedAt', CreateFunctionUpdatedAt],
            ['CreateCredentialTable', CreateCredentialTable],
            ['CreateRoleTable', CreateRoleTable],
            ['CreatePermissionTable', CreatePermissionTable],
            ['CreateRolePermissionTable', CreateRolePermissionTable],
            ['CreateCredentialRoleTable', CreateCredentialRoleTable],
        ]));
    }
}
