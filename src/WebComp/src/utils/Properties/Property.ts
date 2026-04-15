export interface Property<T> {
    get(): T;
    set(value: T|undefined): boolean;
    markStale(): void;
    validate?: () => true|{ validation: string, value: unknown };
}

export type PropertyBuilder<CTX extends Record<string, any>, T>
        = (ctx: Readonly<CTX>) => Property<T>