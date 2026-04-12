import WithHooks     from "../utils/WithHooks";
import { type Elems} from "./extractElements";
import createViewFactory, { ViewFactoryArgs, ViewFactoryControllerProvider } from "./createViewFactory";
import { Data, HTMLName2JSName, JSName2HTMLName } from "./extractData";

// ================== (High level)

let id = 0;
function genId() {
    return id++;
}

export default function defineWebComponent<
                        C extends WithHooks|null,
                        E extends Elems = {},
                        D extends Data  = {}
                >(
                    Controller: ViewFactoryControllerProvider<C, D>,
                    args      : ViewFactoryArgs<C, E, D>
                              & {name: string}
                ) {

    const createView = createViewFactory( Controller, args );

    let to_listen: readonly string[] = [];
    if( args.data !== undefined && args.processDataChange !== undefined )
        to_listen = [...Object.keys(args.data!)].map(e => JSName2HTMLName(e));

    class WebComponent extends HTMLElement {
        readonly view;
        readonly controller: C;

        readonly _id = genId();

        private initialAttrsToConsume: number = 0;

        constructor(data: Partial<D> = {}) {
            super();

            if( to_listen.length !== 0 )
                for(let i = 0; i < to_listen.length; ++i)
                    if( this.hasAttribute(to_listen[i]) === true)
                        ++this.initialAttrsToConsume;

            this.view       = createView(this, data);
            this.controller = this.view.controller;
        }

        attributeChangedCallback(name: string, oldVal: string|null, newVal: string|null) {
            
            // because JS is stupid, really, really, really, stupid...
            if( this.initialAttrsToConsume !== 0) {
                --this.initialAttrsToConsume;
                return;
            }

            console.warn("X", this._id, this.dataset["wcSize"]);
            console.error("Callback?", this._id, name, oldVal, newVal);

            if( oldVal === newVal ) return; // no changes.

            const realname = HTMLName2JSName(name);
            const parsed = args.data![realname](newVal);

            // @ts-ignore
            this.view.ctx.data[realname] = parsed;

            this.view.processDataChange(this.view.ctx, this.view.controller);
        }
    }

    if( to_listen.length !== 0 )
        // @ts-ignore
        WebComponent.observedAttributes = to_listen;

    customElements.define(args.name, WebComponent);

    return WebComponent;
}