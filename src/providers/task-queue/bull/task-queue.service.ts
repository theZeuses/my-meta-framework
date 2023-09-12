import { Queue as QueueType, QueueOptions } from "bull";
import * as Queue from "bull";
import { bullConfig } from "./bull.config";

export class TaskQueueService {
    //register the queue here
    private readonly queueConfigs = {
        "EMAIL_VERIFICATION_EMAIL": bullConfig
    } as const;

    private queues = new Map<keyof typeof this.queueConfigs, QueueType>()

    constructor() {
        Object.entries(this.queueConfigs).map(([name, config]: [keyof typeof this.queueConfigs, QueueOptions]) => {
            this.queues.set(name, new Queue(name, config))
        })
    }

    getQueue(name: keyof typeof this.queueConfigs) {
        const queue = this.queues.get(name);
        if (!queue) throw new Error(`'${name}' queue not found. Have you forgot to register it?`)
        return queue;
    }
}