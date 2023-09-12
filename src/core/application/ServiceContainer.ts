import { DESIGN_PARAM_TYPES } from "./constants";

export class ServiceContainer {
    private readonly instances = new Map();

    /**
     * Instantiates a class along with its dependencies recursively
     */
    public instantiateProvider = <T> (Cls: Newable<T>) : T => {
        if (this.instances.has(Cls)) return this.instances.get(Cls);
    
        // TODO: handle circular dependencies
        const dependencies = Reflect.getMetadata(DESIGN_PARAM_TYPES, Cls) ?? [];
        const params = dependencies.map(this.instantiateProvider);
    
        let instance;
        
        try {
            instance = new Cls(...params);
        } catch (err) {
            throw new Error("Circular Dependency Detected");
        } 
    
        this.instances.set(Cls, instance);
    
        return instance;
    }

    public has = (Cls: Newable<any>) => {
        return this.instances.has(Cls);
    }

    public get = <T> (Cls: Newable<T>) : T => {
        return this.instances.get(Cls);
    }
}