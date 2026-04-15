import createPropertiesFactory from "./createPropertiesFactory";
import { onPropertiesExternalChange } from "./PropertiesListeners";
import { clonePropertiesProxy } from "./PropertiesProxy";
import Computed from "./PropertyTypes/Computed";
import Fixed from "./PropertyTypes/Fixed";
import Value from "./PropertyTypes/Value";
import { Validated } from "./Validation";
import { isString } from "./Validation/types";


const createProperties = createPropertiesFactory({
    foo: Fixed(3),
    faa: Validated(Value("o"), isString ),
    fcc: Computed( (ctx: Readonly<{faa: string, foo: number}>) => ctx.faa )
});

const data = createProperties();

const d2 = clonePropertiesProxy(data);

onPropertiesExternalChange(d2, () => {
    console.log("changed");
});

data.faa = "32";
d2.faa = "44";

console.warn( data.faa );