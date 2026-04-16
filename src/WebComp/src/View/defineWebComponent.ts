import { type Elems} from "./resolveElements";
import createViewFactory, { ViewFactoryArgs, ViewFactoryControllerProvider } from "./createViewFactory";
import { createPropertiesStub } from "../utils/Properties/PropertiesProxy";

type Data = Record<string, any>;

export const WC_ATTRNAME = "data-wc";

let id = 0;
function genId() {
    return id++;
}

const EMPTY_OBJ = {};

export default function defineWebComponent<
                        C extends object|null = null,
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

        get properties(): D {
            if( this.controller === null )
                return null as any;

            // @ts-ignore
            return this.controller.properties;
        }

        refreshUi(controller?: C) {
            return this.view.refresh(controller);
        }

        requestUiRefresh() {
            return this.view.requestRefresh();
        }
    }

    customElements.define(args.name, WebComponent);

    return WebComponent;
}

// used for tests...
export function refreshUiWithOverrides<T extends InstanceType<ReturnType<typeof defineWebComponent<any, any, D>>>, D extends Record<string, any>>(
                                            target: T,
                                            overrides: NoInfer<Partial<D>>
                                        ) {
    // @ts-ignore
    target.refreshUi({properties: createPropertiesStub(target.properties, overrides)});
}