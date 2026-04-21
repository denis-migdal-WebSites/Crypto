// not in-place.
export default function rotateArray<T>(array: readonly T[], nb: number) {
    const result = new Array<T>(array.length);

    for(let i = 0; i < array.length; ++i)
        result[(i+nb)%array.length] = array[i];

    return result;
}