import { Job, Queue } from "bull";

export abstract class Consumer<IData> {
    protected queue: Queue;
    protected job_name: string;
    protected concurrently_process: number;

    /**
     * Creates consumer for a named job on given queue 
     */
    constructor(queue: Queue, job_name: string, concurrently: number = 1){
        this.queue = queue;
        this.job_name = job_name;
        this.concurrently_process = concurrently;
        
        this.onCompleteListener();
        this.onErrorListener();
        this.consume();
    }

    /**
     * Runs when a consumer picks up a job from this queue
     */
    protected abstract consumer(data: IData): Promise<any>;

    /**
    * Custom consumer specific to job
    */
    protected async consume(){
        return this.queue.process(this.job_name, this.concurrently_process, async (job, done) => {
            try{
                done(null, await this.consumer(job.data));
            }catch(err){
                done(new Error("Failed"));
            }
        });
    }

    /**
    * On complete listener callback
    */
    protected async onComplete(job: Job, result: IData){
        try{
            console.log(`${job.name} is successful with result: ${result}. Job id: ${job.id}. Ref Id: ${job.data.id}`);
            return;
        }catch(err){
            console.log(err);
        }
    }

    /**
    * On error listener callback
    */
    protected async onError(error: Error){
        console.log(error.message);
    }

    /**
    * listens to on complete event
    */
    protected onCompleteListener(){
        this.queue.on("completed", async (job, result) => {
            await this.onComplete(job, result);
        });
    }

    /**
    * listens to on error event
    */
    protected onErrorListener(){
        this.queue.on("error", async (error) => {
            await this.onError(error);
        });
    }
}