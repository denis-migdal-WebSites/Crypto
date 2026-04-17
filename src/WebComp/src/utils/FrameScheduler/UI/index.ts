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

    readonly refresh = () => {
        if( this.renderer === null)
            return;
        this.renderer.render();
    }

    readonly requestRefresh = () => {
        if( this.renderer === null)
            return;
        this.renderer.requestRender();
    }
}