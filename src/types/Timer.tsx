const delay = (delay: number) => {
    return new Promise(r => {
        setTimeout(r, delay);
    })
}

export class Timer {
    remainingMs: number;
    isRunning: boolean;
    lastTime: number;

    onComplete?: () => void;
    onTick?: () => void;

    constructor(
        totalMs: number,        
        onComplete?: () => void,
        onTick?: () => void,
        isRunning?: boolean,
    ) {
        this.remainingMs = totalMs;        

        this.lastTime = Date.now();

        this.onComplete = onComplete;
        this.onTick = onTick;
        this.isRunning = isRunning ? isRunning : false;
    }

    runTimer = async () => {
        this.isRunning = true; 

        while (this.isRunning && this.remainingMs > 0) {
            this.lastTime = Date.now();
            await delay(100);

            const interval = Date.now() - this.lastTime;
            this.remainingMs = this.remainingMs - interval;

            if (this.onTick)
                this.onTick();
        }

        if (this.remainingMs <= 0)
        {
            this.remainingMs = 0;

            if (this.onComplete)
                this.onComplete();
          
        }

        this.isRunning = false;
    }

    stopTimer = () => {
        this.isRunning = false;
    }
}