import { KafkaConfig } from 'kafkajs';

import { EnvironmentConfiguration } from './Environnement';
import { packageJsonConfig } from './PackageJsonConfig';

export const kafkaConfig: KafkaConfig = {
    clientId: packageJsonConfig.name,
    retry: {
        retries: 3,
        initialRetryTime: 100,
    },
    requestTimeout: 5000,
    logLevel: 0,
    brokers: EnvironmentConfiguration.env.RED_PANDA_BROKERS
};
