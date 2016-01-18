export function thunk<T>(target: Function, args: any[]|IArguments, context?: any, resolver?: {(result: any): T}): Promise<T> {    
    return new Promise<T>((resolve, reject) => {
        target.apply(context, Array.prototype.slice.call(args).concat([(err: Error, result: T) => {
            if (err)
                reject(err);
            else if (resolver)
                resolve(resolver(result));
            else
                resolve(result);
        }]));
    });
}

export default thunk;