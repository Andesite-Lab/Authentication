import { BasaltLogger } from '@basalt-lab/basalt-logger';

import { I18n, Language } from '@/Config';
import { IWorker } from '@/Worker/Interface';

export class WorkerManager {
    private readonly _workers: IWorker[] = [];

    public constructor() {
        this._workers = this.initializeWorkers();
    }

    private initializeWorkers(): IWorker[] {
        return [
        ];
    }

    public start(): void {
        this._workers.forEach((worker: IWorker): void => worker.start());
        BasaltLogger.log(I18n.translate('workers.start', Language.EN));

    }

    public stop(): void {
        this._workers.forEach((worker: IWorker): void => worker.stop());
        BasaltLogger.log(I18n.translate('workers.stop', Language.EN));
    }
}
