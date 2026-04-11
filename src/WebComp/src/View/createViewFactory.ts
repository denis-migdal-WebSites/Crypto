import createInstance, { Constructible } from "../utils/createInstance";
import { Hooks, HooksProvider }          from "../utils/Hooks";
import WithHooks, { GetHooks }           from "../utils/WithHooks";

import extractElements, { Elems, ElemsDesc }    from "./extractElements";
import { createViewHooksProvider, GetHandlers } from "./handlers";
import ShadowTemplate, { ShadowTemplateArgs }   from "./ShadowTemplate";
import { Root, ViewCallback, ViewCtx }          from "./ViewContext";

type ControllerProviderCtx<T extends Hooks> = {
        hooksProvider: HooksProvider<T>
    };

type ControllerProvider<T extends WithHooks>
    = Constructible<T, [ControllerProviderCtx<GetHooks<T>>]>;

// fct
export type ViewFactoryControllerProvider<C extends WithHooks|null = null>
                    = C extends null
                                    ? null
                                    : ControllerProvider<NonNullable<C>>

export type ViewFactoryArgs<
            C extends WithHooks|null = null,
            E extends Elems = {}
    > = 
        {
            elements?: ElemsDesc<E>,
        }
        & NoInfer<
            (C extends null
            // {} is too permissive in TS...
                    ? Record<`on${Capitalize<string>}`, never>
                    : GetHandlers<ViewCtx<E>, NonNullable<C>>)
            & ShadowTemplateArgs
            & {
                attachController?: ViewCallback<ViewCtx<E>, [controller: Omit<C, "callHook">], void>
            }
    >

//TODO: move to utils
const NULL_OP = () => {};

// Controller needs to be its own parameter, cf:
// - https://github.com/microsoft/TypeScript/issues/63378
// - https://github.com/microsoft/TypeScript/issues/63377
export default function createViewFactory<
                        C extends WithHooks|null = null,
                        E extends Elems = {}
                >(
                    Controller: ViewFactoryControllerProvider<C>,
                    args      : ViewFactoryArgs<C, E>
                ) {

    const template = new ShadowTemplate(args);

    const attachController = "attachController" in args
                                ? args.attachController
                                : NULL_OP;
    
    const extractElems = "elements" in args
                            ? (target: Root) => extractElements(target, args.elements!)
                            : () => { return {} as E }

    return (target: HTMLElement) => {

        const root     = template.createShadowRoot(target);
        const elements = extractElems(root);

        const ctx = {
            target,
            root,
            elements,
        };

        let controller = null as C;
        if( Controller !== null ) {

            const ctrlCtx = {
                hooksProvider: createViewHooksProvider(ctx, args)
            }

            controller = createInstance(Controller, ctrlCtx) as NonNullable<C>;

            attachController(ctx, controller);
        }


        return {
            target,
            controller
        } 
    }
}


/**

import { HookCaller } from "../Hooks2";

type AH = {
    "foo"?: (this: null, i: number) => void
};

class A {

    readonly callHook: HookCaller<AH>;

    // NO_HOOKS quite hard to create (?).
    constructor(args: {hooksProvider: HooksProvider<A>}) {
        this.callHook = args.hooksProvider(this);

        const rest = this.callHook("foo", 24);
        void rest; // test
    }
}

// for test
function injectElement() {
    const element = document.createElement("test-test");

    document.body.append(element);

    return element;
}

{
    const createView = createViewFactory(
            A,
            //(args): A => new A(args),
            {
                content : "<div data-wc-id='ok'>Hell no!</div>",
                style   : "div { background-color: orange }",
                elements: {
                    ok: HTMLDivElement
                },
                attachController(_ctx, _ctler) {
                    _ctx.elements.ok;
                    console.warn("Controller attached...");
                },
                onFoo(ctx, i) {
                    console.warn("foo :)", ctx, i);
                }
        })

    const view = createView( injectElement() );

    view.controller.callHook("foo", 34);
}
{
    const createView = createViewFactory(
            null,
            {
            }
        )

    const view = createView( injectElement() );

    view.controller;
}

/**/