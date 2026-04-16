type FrameTask = () => void;

export class FrameScheduler {

    // TODO: scheduleUpdate()

    protected isScheduled = false; // could use guard...
    
    protected readonly renderTasks: FrameTask[] = [];

    protected rAF_callback = () => {

        //TODO: updateTasks
        // (=> use function run(array) ?).

        // renderTasks could be added during execution.
        for(let i = 0; i < this.renderTasks.length; ++i)
            this.renderTasks[i]();

        if( __DEBUG__ ) {
            const set = new Set( this.renderTasks );
            if( set.size !== this.renderTasks.length )
                throw new Error(`Re-entry`);
        }

        this.renderTasks.length = 0;
        this.isScheduled = false;
    }

    protected schedule() {
        if( this.isScheduled ) return;
        this.isScheduled = true;

        requestAnimationFrame( this.rAF_callback );
    }

    scheduleRender( task: FrameTask ) {
        this.renderTasks.push(task);

        this.schedule();
    }
}

export default new FrameScheduler();