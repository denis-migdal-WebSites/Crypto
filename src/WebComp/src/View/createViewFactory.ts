import createInstance, { Constructible } from "../utils/createInstance";
import { Hooks, HooksProvider }          from "../utils/Hooks";
import WithHooks, { GetHooks }           from "../utils/WithHooks";
import extractData, { Data, DataDesc } from "./extractData";

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

/**
 * - configureController: called before attachController + when data changes.
 * - attachController: bind view -> controller.
 */
export type ViewFactoryArgs<
            C extends WithHooks|null = null,
            E extends Elems = {},
            D extends Data  = {}
    > = 
        {
            elements?: ElemsDesc<E>,
            data    ?: DataDesc<D>,
        }
        & NoInfer<
            (C extends null
            // {} is too permissive in TS...
                    ? Record<`on${Capitalize<string>}`, never>
                    : GetHandlers<ViewCtx<E, D>, NonNullable<C>>)
            & ShadowTemplateArgs
            & {
                attachController?: ViewCallback<ViewCtx<E, D>, [controller: Omit<C, "callHook">], void>,
                configureController?: ViewCallback<ViewCtx<E, D>, [controller: Omit<C, "callHook">], void>,
            }
    >

//TODO: move to utils
const NULL_OP = () => {};

const NULL_OBJ = {};
function NULL_OP_OBJ<T>(): T {
    return NULL_OBJ as T;
}

// Controller needs to be its own parameter, cf:
// - https://github.com/microsoft/TypeScript/issues/63378
// - https://github.com/microsoft/TypeScript/issues/63377
export default function createViewFactory<
                        C extends WithHooks|null = null,
                        E extends Elems = {},
                        D extends Data  = {}
                >(
                    Controller: ViewFactoryControllerProvider<C>,
                    args      : ViewFactoryArgs<C, E, D>
                ) {

    const template = new ShadowTemplate(args);

    const attachController = "attachController" in args
                                ? args.attachController
                                : NULL_OP;
    
    const configureController = "configureController" in args
                                ? args.configureController
                                : NULL_OP;
    
    const extractElems = "elements" in args
            ? (target: Root) => extractElements(target, args.elements!)
            : NULL_OP_OBJ<E>;

    const extractD = "data" in args
            ? (target: HTMLElement, overrideData: Partial<D>) => extractData(target, args.data!, overrideData)
            : NULL_OP_OBJ<D>;
    
    return (target: HTMLElement, overrideData: Partial<D> = {}) => {

        const root     = template.createShadowRoot(target);
        const elements = extractElems(root);
        const data     = extractD(target, overrideData);

        const ctx = {
            target,
            root,
            elements,
            data,
        };

        let controller = null as C;
        if( Controller !== null ) {

            const ctrlCtx = {
                hooksProvider: createViewHooksProvider(ctx, args)
            }

            controller = createInstance(Controller, ctrlCtx) as NonNullable<C>;
        }

        // execute it even if no controllers.
        configureController(ctx, controller);
        attachController(ctx, controller);


        return {
            target,
            controller,
            data
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