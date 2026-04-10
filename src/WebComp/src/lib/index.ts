//export {HooksManager}    from "../Hooks";
export {default as extractElements} from "../View/extractElements";
//import createViewClass, {type ViewFactoryArgs} from "../View/createViewClass";

// ================== Low level (definitions)
import { type Elems} from "../View/types";
import { WithHooks } from "../Hooks";
import createViewFactory, { ViewFactoryArgs, ViewFactoryControllerProvider } from "../View/createViewFactory";

// ================== (High level)

export function defineWebComponent<
                        C extends WithHooks<any>|null = null,
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