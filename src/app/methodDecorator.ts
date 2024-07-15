
/**requires experimentalDecorators to be set to false */
export function logging(target:any,context: any){
    console.log(`@log: ${target}`)
    const methodName = String(context.name);
    //above 2 lines execute on app load only
    return function(this: any, ...args: any[]){
        //executes everytime the decorator executes.
    console.log("running the @log decorator")
    console.log(`${methodName} started at ${new Date().getTime()}`);
    try{
    return target.apply(this, args);
    }
    finally{
        //this will execute irrespective of success and failure
    console.log(`${methodName} finished at ${new Date().getTime()}`);
    }
    }
}

/**requires experimentalDecorators to be set to true */
export function logExp(target:any,propertyKey: string,desc:PropertyDescriptor){
    const originalMethod=desc.value;
    console.log(target);
    console.log(propertyKey);
    console.log(desc);
    desc.value=function(...args:any[]){
        console.log(`Method going to execute at ${new Date().getTime()}`);
        const result = originalMethod.apply(this, args);
        console.log(`Method executed at ${new Date().getTime()}`);
    }
    return desc;
}


export function retry(target:any,context:any){
    let maxRetries:number=3;
    console.log(`@retry: ${target}`) //executes on application load
    const resultMethod=function(this:any,...args:any[]){
        //executes everytime decorator executes
        for(let i=1;i<=maxRetries;i++) {
            console.log(`Running @retry : ${i}`)
            try{
            return target.apply(this,args);
            }
            catch(err){
                console.log(`Retry errored out.Will @retry ${maxRetries-i} more times`);
            }
    }

    throw new Error("All retries exhausted")
}
    return resultMethod;
}


//decorator factory to accept parameters

export function retryWithParams(retryCount:number){
    return function(target:any,context:any){
        console.log(`@retry: ${target}`); //executes on application load only. Not everytime, the decorator executes
        const resultMethod=function(this:any,...args:any[]){
            //executes everytime the decorator executes.
            for(let i=1;i<=retryCount;i++) {
                console.log(`Running @retry : ${i}`)
                try{
                return target.apply(this,args);
                }
                catch(err){
                    console.log(`Retry errored out.Will @retry ${retryCount-i} more times`);
                }

        }
    
        throw new Error("All retries exhausted")
    }
        return resultMethod; 
    }
}


//decorator composition to compose log and retry decorators into a single decorator

export function logAndRetry(target:any,context:any){
    /*
We are doing exactly what is done for fetchUsers() but we are combining the @logging and
@retry decorators into a single decorator and using it.
    */
    const WithLog= logging(target,context); 
    const WithRetry=retry(WithLog,context);  // return function of @logging passed as target to @retry
    return WithRetry;
}


export function logAndRetryWithParams(target:any,context:any){
   /*
We are doing exactly what is done for fetchComments() but we are combining the @logging and
@retry decorators into a single decorator and using it.
    */  
   const withRetryParams=retryWithParams(2);
   const withRetry=withRetryParams(target,context);
   const withLog=logging(withRetry,context);
   return withLog;
}



