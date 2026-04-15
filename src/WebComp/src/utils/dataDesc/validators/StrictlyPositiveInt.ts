export default function StrictlyPositiveInt(value: number) {
    
    return typeof value === "number"
        && ! Number.isNaN(value)
        &&   Number.isInteger(value)
        &&   Number.isSafeInteger(value)
        &&   value > 0;
}