import { JobOptions, Queue } from "bull";

export abstract class Producer<IData> {
    protected queue: Queue;
    protected job_name: string;
    protected defaultJobOpts: JobOptions = {
        removeOnComplete: true
    };

    /**
     * Creates producer for a named job on given queue 
     */
    constructor(queue: Queue, job_name: string, defaultJobOptions?: JobOptions){
        this.queue = queue;
        this.job_name = job_name;
        if(defaultJobOptions) this.defaultJobOpts = defaultJobOptions;
    }

    /**
     * Produce a job on queue
     */
    async produce(data: IData, options?: JobOptions){
        return await this.queue.add(this.job_name, data, {...this.defaultJobOpts, ...options});
    }
}