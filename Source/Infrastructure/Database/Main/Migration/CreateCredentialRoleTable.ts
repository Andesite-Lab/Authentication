import { Knex } from 'knex';

export class CreateCredentialRoleTable {
    public static async up(knex: Knex): Promise<void> {
        await knex.schema.createTable('credential_role', (table: Knex.CreateTableBuilder): void => {
            table.uuid('credentialUuid')
                .notNullable()
                .references('uuid')
                .inTable('credential')
                .onDelete('CASCADE')
                .comment('The uuid of the credential');
            table.integer('roleId')
                .notNullable().references('id')
                .inTable('role')
                .onDelete('CASCADE')
                .comment('The id of the role');
            table.increments('id')
                .primary()
                .comment('The id of user role');
        });
    }

    public static async down(knex: Knex): Promise<void> {
        await knex.schema.dropTableIfExists('credential_role');
    }
}
