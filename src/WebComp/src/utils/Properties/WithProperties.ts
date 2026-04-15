import { NULL_OBJ } from "../NullObjects";
import createPropertiesFactory from "./createPropertiesFactory";
import { ProxyProperties } from "./PropertiesProxy";
import { Descriptors } from "./PropertiesStore";

/** Do NOT add protected/private properties in order to be able
    to use it as an interface. */
export default function WithProperties<T extends Record<string, any>>(
                                                descriptors: Descriptors<T>
                                            ) {

    return class WithProperties {

        static PropertiesFactory = createPropertiesFactory(descriptors);

        readonly properties: ProxyProperties<T, any>;

        constructor(initialValues: Partial<T> = NULL_OBJ) {
            this.properties = (this.constructor as any).PropertiesFactory(initialValues);
        }
    }
}