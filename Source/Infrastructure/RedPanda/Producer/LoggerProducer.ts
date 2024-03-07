import { packageJsonConfig } from '@/Config';
import { Topics } from '@/Infrastructure/RedPanda';
import { RedPandaProducer } from '@/Infrastructure/RedPanda/Producer';

export class LoggerProducer {
    public static async execute(level: string, date: string, object: unknown): Promise<void> {
        await RedPandaProducer.instance.send({
            topic: Topics.LOGGER_MICROSERVICE,
            messages: [
                {
                    value: JSON.stringify({
                        microservice: packageJsonConfig.name,
                        level,
                        date,
                        object,
                    }),
                },
            ],
        });
    }
}
