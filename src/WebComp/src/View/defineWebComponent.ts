import WithHooks     from "../utils/WithHooks";
import { type Elems} from "./extractElements";
import createViewFactory, { ViewFactoryArgs, ViewFactoryControllerProvider } from "./createViewFactory";
import { Data } from "./extractData";

// ================== (High level)

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

    class WebComponent extends HTMLElement {
        readonly view;
        readonly controller: C;

        constructor(data: Partial<D> = {}) {
            super();

            this.view       = createView(this, data);
            this.controller = this.view.controller;
        }
    }

    customElements.define(args.name, WebComponent);

    return WebComponent;
}