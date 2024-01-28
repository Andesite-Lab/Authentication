import { IDataConsumer } from '@/Consommer/Interface';

export class ConsumerManager {
    private readonly _consumers: IDataConsumer[] = [];

    public constructor() {
        this._consumers = this.initializeConsumer();
    }

    private initializeConsumer(): IDataConsumer[] {
        return [];
    }

    public start(): void {
        this._consumers.forEach((consumer: IDataConsumer): void => consumer.start());
    }

    public stop(): void {
        this._consumers.forEach((consumer: IDataConsumer): void => consumer.stop());
    }
}
