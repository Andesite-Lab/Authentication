import { Knex } from 'knex';

export class CreateRoleTable {
    public static async up(knex: Knex): Promise<void> {
        await knex.schema.createTable('role', (table: Knex.CreateTableBuilder): void => {
            table.string('role', 16)
                .notNullable()
                .unique()
                .comment('The role name (he contain several permission thanks to role_permission table)');
            table.timestamp('createdAt')
                .notNullable()
                .defaultTo(knex.fn.now())
                .comment('The creation date of the role');
            table.timestamp('updatedAt')
                .nullable()
                .defaultTo(knex.fn.now())
                .comment('The last update date of the role');
            table.increments('id')
                .primary()
                .comment('The id of the role');
        });

        await knex.raw(`
            CREATE TRIGGER update_role_updated_at
            BEFORE UPDATE ON role
            FOR EACH ROW
            EXECUTE PROCEDURE update_updated_at_column();
        `);
    }

    public static async down(knex: Knex): Promise<void> {
        await knex.raw('DROP TRIGGER IF EXISTS update_role_updated_at ON role');
        await knex.schema.dropTableIfExists('role');
    }
}
