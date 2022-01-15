export default interface IStartpageContext {
    modules: Array<Module>;
}

export interface Module {
    id: string;
    element: Function;
}