interface Job {
  id: string;
  type: string;
  data: unknown;
  attempts: number;
  maxAttempts: number;
}

class InMemoryQueue {
  private jobs: Job[] = [];
  private processing = false;
  private handlers: Map<string, (data: unknown) => Promise<void>> = new Map();

  async add(type: string, data: unknown, maxAttempts = 3): Promise<void> {
    const job: Job = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      data,
      attempts: 0,
      maxAttempts,
    };
    this.jobs.push(job);
    this.process();
  }

  register(type: string, handler: (data: unknown) => Promise<void>): void {
    this.handlers.set(type, handler);
  }

  private async process(): Promise<void> {
    if (this.processing || this.jobs.length === 0) {
      return;
    }

    this.processing = true;

    while (this.jobs.length > 0) {
      const job = this.jobs.shift();
      if (!job) {
        break;
      }

      const handler = this.handlers.get(job.type);
      if (!handler) {
        continue;
      }

      try {
        job.attempts++;
        await handler(job.data);
      } catch (error) {
        if (job.attempts < job.maxAttempts) {
          this.jobs.push(job);
        }
      }
    }

    this.processing = false;
  }
}

export const queue = new InMemoryQueue();


