//Decorator Autobind
export function autoBind(
    target: any, 
    methodName: string, 
    descriptor: PropertyDescriptor
){
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        get(){
            const boundFn = originalMethod.bind(this);
            return boundFn;
        }
    }
    return adjDescriptor;
}