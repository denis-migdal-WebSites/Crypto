export function isPositiveInteger(value: unknown): value is number {
    return isInteger(value) && value >= 0
}

export function isInteger(value: unknown): value is number {
    return Number.isSafeInteger(value);
}


export function isNumber(value: unknown): value is number {
    if( typeof value !== "number")
        return false;

    return ! Number.isNaN(value);
}