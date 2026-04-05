// ================== Low level (definitions)

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
import installMethods, { Methods } from "../installMethods";

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

    //TODO: verify returned type...
    return View;
}

// ==================

export function createWebComponent<ELEMS extends Elems>(
                                            View: ViewCstr<ELEMS>
                                        ) {
    return class WebComponent extends HTMLElement {
        constructor() {
            super();

            const view = new View(this);
            //TODO...
            if( "initializeBindings" in view)
                // @ts-ignore: TODO: default type...
                view.initializeBindings();
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

type WebCompArgs<
                ELEMS      extends Elems,
                UI_ACTIONS extends Methods<IView<ELEMS>>
            > = {
    name: string
} & ViewFactoryArgsRaw<ELEMS, UI_ACTIONS>;

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
                UI_ACTIONS extends Methods<IView<ELEMS>>
            >(
                args: WebCompArgs<ELEMS, UI_ACTIONS>
            ) {

    const View = createViewClass( parseViewArgs(args) );

    const WebComponent = createWebComponent(View);

    customElements.define(args.name, WebComponent);

    return WebComponent;
}