import { ILoggerStrategy, LogLevels } from '@basalt-lab/basalt-logger';

import { LoggerProducer } from '@/Infrastructure/RedPanda/Producer';

export class RedPandaLoggerStrategy implements ILoggerStrategy {
    public log(level: LogLevels, date: Date, object: unknown): void {
        LoggerProducer.execute(level, date.toISOString(), object)
            .catch((error: Error): void => {
                throw error;
            });
    }
}
