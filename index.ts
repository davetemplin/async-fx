// Project: https://github.com/davetemplin/async-fx/
// Written by: Dave Templin <https://github.com/davetemplin/>

"use strict";

export async function timeout(milliseconds: number): Promise<void> {
    return new Promise<void>(resolve => 
        setTimeout(() => 
            resolve(), milliseconds));
}

export * from './src/File';
export * from './src/Http';
export * from './src/Parallel';
