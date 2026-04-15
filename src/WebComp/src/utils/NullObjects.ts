export const NO_VALUE = Symbol();

export const NULL_OP  = () => {};
export const NULL_OBJ = Object.freeze({}); // for security.

export const FCT_FALSE = () => false as const;
export const FCT_TRUE  = () => true  as const;