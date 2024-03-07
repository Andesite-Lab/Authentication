import { Knex } from 'knex';

export class CreatePermissionTable {
    public static async up(knex: Knex): Promise<void> {
        await knex.schema.createTable('permission', (table: Knex.CreateTableBuilder): void => {
            table.string('permission', 32)
                .notNullable()
                .unique()
                .comment('The permission allow to access to a specific resources');
            table.timestamp('createdAt')
                .notNullable()
                .defaultTo(knex.fn.now())
                .comment('The creation date of the permission') ;
            table.timestamp('updatedAt')
                .notNullable()
                .defaultTo(knex.fn.now())
                .comment('The update date of the permission');
            table.increments('id')
                .primary()
                .comment('The id of the permission');
        });
        await knex.raw(`
            CREATE TRIGGER update_permission_updated_at
            BEFORE UPDATE ON permission
            FOR EACH ROW
            EXECUTE PROCEDURE update_updated_at_column();
        `);
    }

    public static async down(knex: Knex): Promise<void> {
        await knex.raw('DROP TRIGGER IF EXISTS update_permission_updated_at ON permission');
        await knex.schema.dropTableIfExists('permission');
    }
}
