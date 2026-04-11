import WithHooks     from "../utils/WithHooks";
import { type Elems} from "./extractElements";
import createViewFactory, { ViewFactoryArgs, ViewFactoryControllerProvider } from "./createViewFactory";

// ================== (High level)

export default function defineWebComponent<
                        C extends WithHooks|null = null,
                        E extends Elems = {}
                >(
                    Controller: ViewFactoryControllerProvider<C>,
                    args      : ViewFactoryArgs<C, E> & {name: string}
                ) {

    const createView = createViewFactory( Controller, args );

    class WebComponent extends HTMLElement {
        readonly view       = createView(this);
        readonly controller = this.view.controller;
    }

    customElements.define(args.name, WebComponent);

    return WebComponent;
}