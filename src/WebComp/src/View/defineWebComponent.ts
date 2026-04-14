import WithHooks     from "../utils/WithHooks";
import { type Elems} from "./resolveElements";
import createViewFactory, { ViewFactoryArgs, ViewFactoryControllerProvider } from "./createViewFactory";
import { WC_ATTRNAME } from "./validateData";
import { Data } from "../utils/Properties";

// ================== (High level)

let id = 0;
function genId() {
    return id++;
}

const EMPTY_OBJ = {};

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
    if( args.processDataChange !== undefined )
        to_listen = ["data-wc"];

    class WebComponent extends HTMLElement {
        readonly view;
        readonly controller: C;

        readonly _id = genId();

        private needToConsume: boolean = false;

        constructor(data: Partial<D> = EMPTY_OBJ) {
            super();

            this.needToConsume =   data === EMPTY_OBJ
                                && this.hasAttribute(WC_ATTRNAME);

            if( this.needToConsume ) {

                data = JSON.parse( this.getAttribute(WC_ATTRNAME)! );

                this.needToConsume = to_listen.length !== 0;
            }
            
            //TODO: validate...

            this.view       = createView(this, data);
            this.controller = this.view.controller;
        }

        static observedAttributes = to_listen;

        attributeChangedCallback(_name: string, oldVal: string|null, newVal: string|null) {

            // only data-wc listened.

            // because JS is stupid, really, really, really, stupid...
            if( this.needToConsume ) {
                this.needToConsume = false;
                return;
            }

            if( oldVal === newVal ) return; // no changes.

            let data = {};
            if( newVal !== undefined )
                data = JSON.stringify(newVal);

            this.view.setData( data );
        }
    }

    customElements.define(args.name, WebComponent);

    return WebComponent;
}