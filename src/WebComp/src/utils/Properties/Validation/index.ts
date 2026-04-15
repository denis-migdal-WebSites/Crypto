import { PropertyBuilder } from "../Property";

export function Validated<CTX extends Record<string, any>, T>(
                                    property: PropertyBuilder<CTX, T>,
                                    ...validations: NoInfer<readonly ((x: T) => boolean)[]>
                                ) {
    if( __DEBUG__ ) {
        return (ctx: CTX) => {
            const prop = property(ctx);

            prop.validate = () => {

                const value = prop.get();

                for(let i = 0; i < validations.length; ++i)
                    if( ! validations[i](value) ) {
                        return {
                            validation: validations[i].name,
                            value,
                        }
                    }

                return true;
            }

            return prop;
        }
    }

    return property;
}