// Project: https://github.com/davetemplin/async-fx/
// Written by: Dave Templin <https://github.com/davetemplin/>


export async function sleep(milliseconds: number): Promise<void> {
    return new Promise<void>(resolve => 
        setTimeout(() => 
            resolve(), milliseconds));
}

import * as File from 'async-file';
import * as Parallel from 'async-parallel';
import * as WebRequest from 'web-request';

export {File, Parallel, WebRequest};