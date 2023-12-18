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
    }

    public static async down(knex: Knex): Promise<void> {
        await knex.schema.dropTableIfExists('permission');
    }
}
