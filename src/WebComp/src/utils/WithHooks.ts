import { HookCaller, Hooks, HooksProvider } from "./Hooks";

/** Do NOT add protected/private properties in order to be able
    to use it as an interface. */
export default class WithHooks<T extends Hooks = Hooks> {

    readonly callHook: HookCaller<T>;

    constructor(args: {hooksProvider: HooksProvider<T>}) {
        this.callHook = args.hooksProvider;
    }
}

export type GetHooks<T extends WithHooks>
    = T extends WithHooks<infer U> ? U : never;
    //= T["callHook"] extends HookCaller<infer U> ? U : never;