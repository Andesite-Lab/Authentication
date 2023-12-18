export interface ICrendentialDTO {
    username: string;
    email: string;
    password: string;
    banned: boolean;
    uuid: string;
}

interface ICrendentialRoleDTO {
    credentialUuid: string;
    roleId: number;
    id: number;
}

import { BasaltPassword } from '@basalt-lab/basalt-helper';
import { Knex } from 'knex';
import { randomUUID } from 'crypto';

export async function seed(knex: Knex): Promise<void> {
    try {
        const credentials: Partial<ICrendentialDTO>[] = [
            {
                username: 'Ruby',
                email: 'necrelox@proton.me',
                password: await BasaltPassword.hashPassword('SwappySwap-$1>/dev/null'),
                uuid: randomUUID()
            },
        ];

        await knex.transaction(async (trx): Promise<void> => {
            await trx('credential').insert(credentials);

            const [role] = await trx('role').select('id').where('role', 'admin');

            await trx('credential_role')
                .insert(credentials.map((credential: Partial<ICrendentialDTO>): Partial<ICrendentialRoleDTO> => ({
                    roleId: role.id,
                    credentialUuid: credential.uuid
                })));

        });
    } catch (_) { /* empty */}
}
