import { type HooksManager, type Hooks } from "../Hooks";

export interface Controller<T extends Hooks> {
    readonly hooks: HooksManager<T>;
}