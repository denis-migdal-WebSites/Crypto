export {default as extractElements} from "../View/extractElements";
export {default as WithHooks      } from "../utils/WithHooks";

// ================== Low level (definitions)
import { type Elems} from "../View/extractElements";
import WithHooks from "../utils/WithHooks";
import createViewFactory, { ViewFactoryArgs, ViewFactoryControllerProvider } from "../View/createViewFactory";

// ================== (High level)

export function defineWebComponent<
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