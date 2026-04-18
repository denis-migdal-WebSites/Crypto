import Renderer from "../Renderer";

export class UI {

    readonly callbacks = new Array<() => void>();

    // Renderer is lazy-initialized.
    // Don't need renderer if no callbacks.
    renderer: Renderer|null = null;

    addToRefresh( callback: () => void ) {
        if(this.renderer === null) {
            this.renderer = new Renderer( this.render_callback );
            // initial rendering...
            this.renderer.requestRender();
        }
        this.callbacks.push(callback);
    }

    protected render_callback = () => {
        for(let i = 0; i < this.callbacks.length; ++i)
            this.callbacks[i]();
    }

    // bypass suspend
    readonly forceRefresh = () => {
        if( this.renderer === null)
            return;
        this.renderer.forceRender();
    }

    readonly requestRefresh = () => {
        if( this.renderer === null)
            return;

        if( this.isSuspended ) {
            this.hasPendingRefreshRequest = true;
            return;
        }

        this.renderer.requestRender();
    }

    isSuspended = false; //TODO: could use guard.
    hasPendingRefreshRequest = false;

    suspendRefreshRequests() {
        if( this.isSuspended || this.renderer === null) return;
        this.isSuspended = true;

        if( this.renderer.isScheduled ) {
            this.renderer.cancelScheduledRender();
            this.hasPendingRefreshRequest = true;
        }
    }

    resumeRefreshRequests() {
        if( ! this.isSuspended || this.renderer === null) return;
        this.isSuspended = false;

        if( this.hasPendingRefreshRequest ) {
            this.hasPendingRefreshRequest = false;
            this.requestRefresh();
        }
    }
}