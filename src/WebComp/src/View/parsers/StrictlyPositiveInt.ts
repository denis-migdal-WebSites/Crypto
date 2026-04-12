export default function StrictlyPositiveInt(defVal: number) {

    return (raw: string|null) => {
        
        if( raw === null)
            return defVal;

        const parsed = Number(raw);

        if( __DEBUG__ ) {

            if(      Number.isNaN(parsed)
                || ! Number.isInteger(parsed)
                || ! Number.isSafeInteger(parsed)
                || parsed <= 0 ) {

                throw new Error(`${raw} isn't a StrictlyPositiveInt`);
            }

        }

        return parsed;
    }
}