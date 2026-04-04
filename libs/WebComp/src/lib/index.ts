// ================== Low level (definitions)

export interface IView<RENDER_ARGS extends any[] = []> {

    //render(...args: RENDER_ARGS): void;
}

export type ViewCstr<RENDER_ARGS extends any[] = []> = {
    new(target: HTMLElement): IView<RENDER_ARGS>
};

// ================== Middle level (configurable)

import ShadowTemplate, { ShadowTemplateArgs } from "../ShadowTemplate";
import style from "../ShadowTemplate/parsers/style";
import template from "../ShadowTemplate/parsers/template";

import extractElements, { Cstrs, Elems } from "../extractElements";

/*
    onUiSetup?: (ctx: SetupCtx<Instances<NoInfer<ElemCstrs>>>) => void
*/

type ViewCtx<ELEMS extends Elems> = {
    target  : HTMLElement,
    root    : DocumentFragment|HTMLElement,
    elements: ELEMS
}

type ViewFactoryArgs<ELEMS extends Elems> = 
      ShadowTemplateArgs
    & { elements ?: Cstrs<ELEMS> }
    & { onSetupUI?: (ctx: ViewCtx<NoInfer<ELEMS>>) => void };

export function createViewClass<ELEMS extends Elems>(
            args: ViewFactoryArgs<ELEMS>
        ) {

    //TODO: when initialize...
    const template = new ShadowTemplate(args);

    return class View implements IView {
        constructor(target: HTMLElement) {

            const root = template.createShadowRoot(target);
            let elements = {} as ELEMS;
            if( args.elements !== undefined)
                elements = extractElements(root, args.elements);
            
            const ctx = {
                target,
                root,
                elements,
                //TODO... additional props...
            }

            if( args.onSetupUI !== undefined)
                args.onSetupUI(ctx);
        }
    }
}

// ==================

export function createWebComponent(View: ViewCstr) {
    return class WebComponent extends HTMLElement {
        constructor() {
            super();

            new View(this);
        }
    }
}

// ================== (High level)

type AcceptString<T extends Record<string, any>, F extends keyof T> = {
    [K in keyof T]: K extends F ? T[K] | string : T[K];
};

type ViewFactoryArgsRaw<ELEMS extends Elems>
    = AcceptString<ViewFactoryArgs<ELEMS>, "content"|"style">;

type WebCompArgs<ELEMS extends Elems> = {
    name: string
} & ViewFactoryArgsRaw<ELEMS>;

function parseViewArgs<ELEMS extends Elems>(
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

export function defineWebComponent<ELEMS extends Elems>(
                args: WebCompArgs<ELEMS>
            ) {

    const View = createViewClass( parseViewArgs(args) );

    const WebComponent = createWebComponent(View);

    customElements.define(args.name, WebComponent);

    return WebComponent;
}