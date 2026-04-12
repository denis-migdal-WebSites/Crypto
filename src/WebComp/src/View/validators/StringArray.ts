export default function StringArray(value: readonly string[]) {
    if( ! Array.isArray(value) )
        return false;

    return value.every( e => typeof e === "string");
}