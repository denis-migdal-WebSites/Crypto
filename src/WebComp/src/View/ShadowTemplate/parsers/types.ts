export type Stringable = string|number|boolean;

export type Template<T> = [TemplateStringsArray, ...Stringable[]]|[T];

export function isTemplateString(
                                    raw: [unknown, ...unknown[]]
                                ): raw is [TemplateStringsArray, ...Stringable[]] {
    return Array.isArray(raw[0]);
}