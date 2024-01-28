import { RedPandaProducer } from '@/Infrastructure/RedPanda/Producer';
import { Topics } from '@/Infrastructure/RedPanda';

export enum MailTypes {
    WELCOME = 'welcome',
    RESET_PASSWORD = 'reset-password',
    DELETE_ACCOUNT = 'delete-account',
}

export class MailerProducer {
    public async execute(
        object: unknown,
        mailType: MailTypes,
        scheduledEmailDate: string | undefined = undefined,
    ): Promise<void> {
        await RedPandaProducer.instance.send({
            topic: Topics.MAILER_MICROSERVICE,
            messages: [
                {
                    value: JSON.stringify({
                        object,
                        mailType,
                        scheduledEmailDate,
                    }),
                },
            ],
        });
    }
}
