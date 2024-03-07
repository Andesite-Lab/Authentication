import { Knex } from 'knex';

export abstract class AbstractMigrationSourceCreator implements Knex.MigrationSource<unknown> {
    private _migrations: Map<string, Knex.Migration>;

    protected constructor(_migrations: Map<string, Knex.Migration>) {
        this._migrations = _migrations;
    }

    public getMigrations(): Promise<string[]> {
        return Promise.resolve(Array.from(this._migrations.keys()));
    }

    public getMigrationName(migration: string): string {
        return migration;
    }

    public getMigration(migration: string): Promise<Knex.Migration> {
        return new Promise((resolve, reject): void => {
            const migrationFunctions: Knex.Migration | undefined = this._migrations.get(migration);

            if (migrationFunctions)
                resolve({
                    up: migrationFunctions.up,
                    down: migrationFunctions.down
                });
            else
                reject(new Error(`Migration not found: ${migration}`));

        });
    }
}