import { Knex } from 'knex';

export class CreateFunctionUpdatedAt {
    public static async up(knex: Knex): Promise<void> {
        await knex.raw(`
            CREATE OR REPLACE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
               NEW."updatedAt" = now(); 
               RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);
    }

    public static async down(knex: Knex): Promise<void> {
        await knex.raw('DROP FUNCTION IF EXISTS update_updated_at_column');
    }
}
