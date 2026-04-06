type Hook    = (...args: any[]) => any;
export type Hooks   = Record<string, Hook>;

const NO_HANDLER = Symbol();

export class HooksManager<T extends Hooks> {

    protected hooks: Partial<T> = {};

    trigger<K extends keyof T>(name: K, ...args: Parameters<T[K]>): ReturnType<T[K]>|typeof NO_HANDLER {
        const hook = this.hooks[name];
        if( hook === undefined )
            return NO_HANDLER;

        return hook(...args);
    }   

    setHandlers(bindedHandlers: Partial<T>) {
        this.hooks = bindedHandlers;
    }
}

type WithHooks = {hooks: HooksManager<any>};
type GetHooks<T extends WithHooks> = T["hooks"] extends HooksManager<infer H> ? H : never;
type Hooks2Handlers<T extends {}, H extends Hooks> = {
    [K in string&keyof H as `on${Capitalize<K>}`]: (source: T, ...args: Parameters<H[K]>) => ReturnType<H[K]>
};

export type GetHandlers<T extends WithHooks> = Hooks2Handlers<T, GetHooks<T>>;

export function isHandlerName(name: string): name is `on${Capitalize<string>}` {
    return name[0] === "o" && name[1] === "n" && name[2] >= "A" && name[2] <= "Z";
}

export function setHandlers<T extends WithHooks>(
                            target: T,
                            handlers: Partial<GetHandlers<NoInfer<T>>>
                        ) {

    const bindedHandlers = {} as Partial<GetHooks<T>>;

    let bindedName   : string;
    let handler      : (t: unknown, ...args: unknown[]) => unknown;
    let bindedHandler: (...args: unknown[]) => unknown;

    for(const name in handlers) {
        if( ! isHandlerName(name) )
            continue;
        
        bindedName    = name[2].toLocaleLowerCase() + name.slice(3);
        handler       = handlers[name]! as any;
        bindedHandler = (...args: any[]) => handler(target, ...args);

        // @ts-ignore
        bindedHandlers[bindedName] = bindedHandler;
    }

    target.hooks.setHandlers(bindedHandlers);
}