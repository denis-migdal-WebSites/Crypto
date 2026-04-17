import Renderer from "../Renderer";

export class UI {

    readonly callbacks = new Array<() => void>();
    readonly renderer: Renderer;

    constructor() {
        this.renderer = new Renderer( this.render_callback );

        // initial rendering...
        this.renderer.requestRender();
    }

    addToRefresh( callback: () => void ) {
        this.callbacks.push(callback);
    }

    protected render_callback = () => {
        for(let i = 0; i < this.callbacks.length; ++i)
            this.callbacks[i]();
    }

    readonly refresh = () => {
        this.renderer.render();
    }

    readonly requestRefresh = () => {
        this.renderer.requestRender();
    }
}