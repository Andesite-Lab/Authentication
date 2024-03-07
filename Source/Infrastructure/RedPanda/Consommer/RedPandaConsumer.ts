import { Consumer, Kafka, KafkaMessage } from 'kafkajs';

import { ErrorInfrastructure, ErrorInfrastructureKey } from '@/Common/Error';
import { kafkaConfig, packageJsonConfig } from '@/Config';

export class RedPandaConsumer {
    private static _instance: RedPandaConsumer;
    private readonly _redpanda: Kafka;
    private readonly _consumer: Consumer;
    private _isConnected: boolean = false;

    private constructor() {
        this._redpanda = new Kafka(kafkaConfig);
        this._consumer = this._redpanda.consumer({ groupId: packageJsonConfig.name });
    }

    public static get instance(): RedPandaConsumer {
        if (!RedPandaConsumer._instance)
            RedPandaConsumer._instance = new RedPandaConsumer();
        return RedPandaConsumer._instance;
    }

    public async connect(): Promise<void> {
        try {
            this._isConnected = true;
            await this._consumer.connect();
        } catch (error) {
            throw new ErrorInfrastructure({
                key: ErrorInfrastructureKey.RED_PANDA_CONSUMER_CONNECTION_ERROR,
                detail: error
            });
        }
    }

    public async disconnect(): Promise<void> {
        try {
            await this._consumer.disconnect();
            this._isConnected = false;
        } catch (error) {
            throw new ErrorInfrastructure({
                key: ErrorInfrastructureKey.RED_PANDA_CONSUMER_DISCONNECT_ERROR,
                detail: error
            });
        }
    }

    public async subscribe(topics: string[]): Promise<void> {
        try {
            if (!this._isConnected)
                throw new ErrorInfrastructure({
                    key: ErrorInfrastructureKey.RED_PANDA_CONSUMER_IS_NOT_CONNECTED
                });
            await this._consumer.subscribe({
                topics,
                fromBeginning: true
            });
        } catch (error) {
            if (!this._isConnected)
                throw new ErrorInfrastructure({
                    key: ErrorInfrastructureKey.RED_PANDA_CONSUMER_IS_NOT_CONNECTED
                });
            throw new ErrorInfrastructure({
                key: ErrorInfrastructureKey.RED_PANDA_CONSUMER_SUBSCRIBE_ERROR,
                detail: error
            });
        }
    }

    public async eachMessage(callback: (message: KafkaMessage) => void): Promise<void> {
        await this._consumer.run({
            eachMessage: async ({ message }): Promise<void> => {
                callback(message);
            }
        });
    }

    public async eachBatch(callback: (messages: KafkaMessage[]) => void): Promise<void> {
        await this._consumer.run({
            eachBatch: async ({ batch }): Promise<void> => {
                callback(batch.messages);
            }
        });
    }
}
