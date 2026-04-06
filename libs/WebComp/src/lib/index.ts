export {HooksManager} from "../Hooks";

// ================== Low level (definitions)
import { HooksManager, setHandlers, type Hooks, type GetHandlers} from "../Hooks";
export interface Controller<T extends Hooks> {
    readonly hooks: HooksManager<T>;
}
type ControllerCstr<T extends Hooks> = new() => Controller<T>;

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

type ViewFactoryArgs<ELEMS extends Elems, UI_ACTIONS extends Methods<IView<ELEMS>>> = 
      ShadowTemplateArgs
    & { elements  ?: Cstrs<ELEMS> }
    & { uiActions ?: UI_ACTIONS };

export function createViewClass<
                                ELEMS      extends Elems,
                                UI_ACTIONS extends Methods<IView<ELEMS>>
                            >(
            args: ViewFactoryArgs<ELEMS, UI_ACTIONS>
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

    if( args.uiActions !== undefined)
        installMethods(View, args.uiActions)

    const hooks = {} as Record<string, (...args: any) => any>;
    for( const key in args )
        if( key[0] === "o"
            && key[1] === "n"
            && key[2] >= 'A' && key[2] <= 'Z' )
            // @ts-ignore
            hooks[key] = args[key];
    
    console.warn(hooks);
    installMethods(View, hooks);

    //TODO: verify returned type...
    return View;
}

// ==================

//TODO: view type...
function instantiateController<
                    CONTROLLER extends ControllerCstr<any>|null = null
                >(Controller: CONTROLLER, view: any) {

    if( Controller === null )
        return null;

    const controller = new Controller();
    setHandlers(controller, view);
    //TODO: init bindings here...

    return controller;
}

export function createWebComponent<
                        ELEMS extends Elems,
                        CONTROLLER extends ControllerCstr<any>|null = null
                    >(
                        View      : ViewCstr<ELEMS>,
                        Controller: CONTROLLER
                    ) {
    return class WebComponent extends HTMLElement {

        readonly view       = new View(this);
        readonly controller = instantiateController(Controller, this.view);

        constructor() {
            super();

            //TODO... => move to instantiateController (?)
            if( "initializeBindings" in this.view)
                // @ts-ignore: TODO: default type...
                this.view.initializeBindings();
        }
    }
}

// ================== (High level)

type AcceptString<T extends Record<string, any>, F extends keyof T> = {
    [K in keyof T]: K extends F ? T[K] | string : T[K];
};

type ViewFactoryArgsRaw<
                        ELEMS      extends Elems,
                        UI_ACTIONS extends Methods<IView<ELEMS>>
                    >
    = AcceptString<ViewFactoryArgs<ELEMS, UI_ACTIONS>, "content"|"style">;

type GetHandlersFromCstr<CONTROLLER extends ControllerCstr<any>|null>
    = CONTROLLER extends null
                ? {}
                : GetHandlers<InstanceType<Exclude<CONTROLLER, null>>>;

type WebCompArgs<
                ELEMS      extends Elems,
                UI_ACTIONS extends Methods<IView<ELEMS>>,
                CONTROLLER extends ControllerCstr<any>|null = null
            > = {
    name       : string,
    controller?: CONTROLLER
} & ViewFactoryArgsRaw<ELEMS, UI_ACTIONS>
  & AsMethods<IView<ELEMS>, GetHandlersFromCstr<NoInfer<CONTROLLER>>>
;

function parseViewArgs<
                ELEMS      extends Elems,
                UI_ACTIONS extends Methods<IView<ELEMS>>
            >(
                args: ViewFactoryArgsRaw<ELEMS, UI_ACTIONS>
            ) : ViewFactoryArgs<ELEMS, UI_ACTIONS> {

    args = {...args}; // will be modified.

    if( typeof args.content === "string") {
        const content = template(args.content); 
        args.content = () => content.cloneNode(true);
    }

    if( typeof args.style   === "string")
        args.style   = style   (args.style);

    return args as ViewFactoryArgs<ELEMS, UI_ACTIONS>;
}

export function defineWebComponent<
                ELEMS      extends Elems,
                UI_ACTIONS extends Methods<IView<ELEMS>>,
                CONTROLLER extends ControllerCstr<any>|null = null
            >(
                args: WebCompArgs<ELEMS, UI_ACTIONS, CONTROLLER>
            ) {

    const View = createViewClass( parseViewArgs(args) );

    let Controller = args.controller;
    if( Controller === undefined )
        Controller = null as CONTROLLER;

    const WebComponent = createWebComponent(View, Controller);

    customElements.define(args.name, WebComponent);

    return WebComponent;
}