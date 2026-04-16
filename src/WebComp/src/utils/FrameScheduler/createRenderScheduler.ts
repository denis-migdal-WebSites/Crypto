import scheduler from "./FrameScheduler";

export default function createRenderScheduler(callback: () => void) {

    let isScheduled = false;

    const renderTask = () => {
        isScheduled = false;
        callback();
    }

    return () => {
        if( isScheduled ) return; //TODO: can use guards.
        isScheduled = true;

        scheduler.scheduleRender( renderTask );
    }
}