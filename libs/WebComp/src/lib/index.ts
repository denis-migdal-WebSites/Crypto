export {HooksManager} from "../Hooks";

// ================== Low level (definitions)
import { HooksManager, setHandlers, isHandlerName, type Hooks, type GetHandlers} from "../Hooks";
export interface Controller<T extends Hooks> {
    readonly hooks: HooksManager<T>;
}

export interface IView<ELEMS extends Elems> {
    target  : HTMLElement,
    root    : DocumentFragment|HTMLElement,
    elements: ELEMS
}

export type ViewCstr<ELEMS extends Elems> = {
    new(target: HTMLElement): IView<ELEMS>
};

// ================== Middle level (configurable)

import ShadowTemplate, { ShadowTemplateArgs } from "../ShadowTemplate";
import style from "../ShadowTemplate/parsers/style";
import template from "../ShadowTemplate/parsers/template";

import extractElements, { Cstrs, Elems } from "../extractElements";
import installMethods, { AsMethods, Methods } from "../installMethods";

// ViewCtx<NoInfer<ELEMS>>

type ViewFactoryArgs<ELEMS extends Elems> = 
      ShadowTemplateArgs
    & { elements  ?: Cstrs<ELEMS> };

export function createViewClass<
                                ELEMS      extends Elems,
                            >(
            args: ViewFactoryArgs<ELEMS>
        ) {

    //TODO: when initialize...
    const template = new ShadowTemplate(args);

    const View = class implements IView<ELEMS> {

        readonly target  : HTMLElement;
        readonly root    : DocumentFragment;
        readonly elements: ELEMS;

        constructor(target: HTMLElement) {

            this.target = target;

            this.root = template.createShadowRoot(target);
            this.elements = args.elements !== undefined
                            ? extractElements(this.root, args.elements)
                            : {} as ELEMS;
        }
    }

    const methods = {} as Record<string, (...args: any) => any>;
    for( const key in args ) {

        if(    isHandlerName(key)
            || key === "createController"
            || key === "attachController"
            ) {
            // @ts-ignore
            methods[key] = args[key];
        }
    }
    
    installMethods(View, methods);

    //TODO: verify returned type...
    return View;
}

// ==================

//TODO: view type...
function instantiateController(view: any) {

    if( ! ("createController" in view) )
        return null;

    const controller = view.createController();
    setHandlers(controller, view);

    if( "attachController" in view)
        view.attachController(controller);

    return controller;
}

export function createWebComponent<
                        ELEMS extends Elems
                    >(
                        View      : ViewCstr<ELEMS>
                    ) {
    return class WebComponent extends HTMLElement {
        readonly view       = new View(this);
        readonly controller = instantiateController(this.view);
    }
}

// ================== (High level)

type AcceptString<T extends Record<string, any>, F extends keyof T> = {
    [K in keyof T]: K extends F ? T[K] | string : T[K];
};

type ViewFactoryArgsRaw<
                        ELEMS      extends Elems
                    >
    = AcceptString<ViewFactoryArgs<ELEMS>, "content"|"style">;

type GetHandlersFrom<CONTROLLER extends Controller<any>|null>
    = CONTROLLER extends null
                ? {}
                : GetHandlers<Exclude<CONTROLLER, null>>;

type WebCompArgs<
                ELEMS      extends Elems,
                CONTROLLER extends Controller<any>|null = null
            > = {
    name       : string,
} & ViewFactoryArgsRaw<ELEMS>
  & {
    createController?: (this: IView<ELEMS>) => CONTROLLER,
    attachController?: (this: IView<ELEMS>,
                        controller: Omit<NoInfer<CONTROLLER>, "hooks">) => void,
  }
  & AsMethods<IView<ELEMS>, GetHandlersFrom<NoInfer<CONTROLLER>>>
;

function parseViewArgs<
                ELEMS      extends Elems
            >(
                args: ViewFactoryArgsRaw<ELEMS>
            ) : ViewFactoryArgs<ELEMS> {

    args = {...args}; // will be modified.

    if( typeof args.content === "string") {
        const content = template(args.content); 
        args.content = () => content.cloneNode(true);
    }

    if( typeof args.style   === "string")
        args.style   = style   (args.style);

    return args as ViewFactoryArgs<ELEMS>;
}

export function defineWebComponent<
                ELEMS      extends Elems,
                CONTROLLER extends Controller<any>|null = null
            >(
                args: WebCompArgs<ELEMS, CONTROLLER>
            ) {

    const View = createViewClass( parseViewArgs(args) );

    const WebComponent = createWebComponent(View);

    customElements.define(args.name, WebComponent);

    return WebComponent;
}