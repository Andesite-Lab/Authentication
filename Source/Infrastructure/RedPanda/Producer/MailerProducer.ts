import { Topics } from '@/Infrastructure/RedPanda';
import { RedPandaProducer } from '@/Infrastructure/RedPanda/Producer';

export enum MailTypes {
    WELCOME = 'welcome',
    RESET_PASSWORD = 'reset-password',
    DELETE_ACCOUNT = 'delete-account',
}

export interface IOptionsMailerProducer {
    to: string;
    cc?: string;
    mailType: MailTypes;
    language: string;
    scheduledEmailDate?: string;
}


export class MailerProducer {
    public static async execute(
        object: unknown,
        options: IOptionsMailerProducer
    ): Promise<void> {
        options.scheduledEmailDate = options.scheduledEmailDate || new Date().toISOString();
        await RedPandaProducer.instance.send({
            topic: Topics.MAILER_MICROSERVICE,
            messages: [
                {
                    value: JSON.stringify({
                        object,
                        options,
                    }),
                },
            ],
        });
    }
}
