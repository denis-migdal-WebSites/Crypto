import WithHooks     from "../utils/WithHooks";
import { type Elems} from "./resolveElements";
import createViewFactory, { ViewFactoryArgs, ViewFactoryControllerProvider } from "./createViewFactory";
import { Data } from "../utils/Properties";

export const WC_ATTRNAME = "data-wc";

let id = 0;
function genId() {
    return id++;
}

const EMPTY_OBJ = {};

export default function defineWebComponent<
                        C extends WithHooks|null = null,
                        E extends Elems = {},
                        D extends Data  = {}
                >(
                    Controller: ViewFactoryControllerProvider<C, D>,
                    args      : ViewFactoryArgs<C, E>
                              & {name: Lowercase<`${string}-${string}`>}
                ) {

    const createView = createViewFactory( Controller, args );

    class WebComponent extends HTMLElement {
        readonly view;
        readonly controller: C;

        readonly _id = genId();

        constructor(data: Partial<D> = EMPTY_OBJ) {
            super();

            if( data === EMPTY_OBJ && this.hasAttribute(WC_ATTRNAME) )
                data = JSON.parse( this.getAttribute(WC_ATTRNAME)! );

            this.view       = createView(this, data);
            this.controller = this.view.controller;
        }
    }

    customElements.define(args.name, WebComponent);

    return WebComponent;
}