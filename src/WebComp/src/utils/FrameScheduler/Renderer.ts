import scheduler from "./FrameScheduler";

//TODO: more generic (?).
export default class Renderer {

    protected readonly callback   : () => void;
    isScheduled = false;

    protected readonly renderTask = () => {
        if( this.isScheduled === false ) return; // already ran.
        this.forceRender()
    };

    constructor(callback: () => void) {
        this.callback = callback;
    }

    requestRender() {
        if( this.isScheduled ) return; //TODO: can use guards.
        this.isScheduled = true;

        scheduler.scheduleRender( this.renderTask );
    }

    forceRender() {
        this.cancelScheduledRender();
        this.callback();
    }

    cancelScheduledRender() {
        this.isScheduled = false;
    }
}