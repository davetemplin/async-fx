// Project: https://github.com/davetemplin/async-fx/
// Written by: Dave Templin <https://github.com/davetemplin/>

"use strict";

import * as fs from 'fs';
import {thunk} from './thunk';

export module File {
    
    export enum Encoding {
        ascii,
        base64,
        binary,
        hex,
        ucs2,
        utf16le,
        utf8
    }
    
    export enum OpenFlags {
        read, //r
        readWrite, //r+
        readSync, //rs
        readWriteSync, //rs+
        write, //w
        writeNoOverwrite, //wx
        create, //w+
        createNoOverwrite, //wx+
        append, //a
        appendNoOverwrite, //ax
        appendRead, //a+
        appendReadNoOverwrite //ax+
    }
    var openFlags: {[index:number]: string;} = {};
    openFlags[OpenFlags.read] = 'r';
    openFlags[OpenFlags.readWrite] = 'r+';
    openFlags[OpenFlags.readSync] = 'rs';
    openFlags[OpenFlags.readWriteSync] = 'rs+';
    openFlags[OpenFlags.write] = 'w';
    openFlags[OpenFlags.writeNoOverwrite] = 'wx';
    openFlags[OpenFlags.create] = 'w+';
    openFlags[OpenFlags.createNoOverwrite] = 'wx+';
    openFlags[OpenFlags.append] = 'a';
    openFlags[OpenFlags.appendNoOverwrite] = 'ax';
    openFlags[OpenFlags.appendRead] = 'a+';
    openFlags[OpenFlags.appendReadNoOverwrite] = 'ax+';
        
    export async function readFile(file: string|number, options?: Object|string): Promise<any> {
        return thunk<any>(fs.readFile, arguments);
    }
    
    export async function readTextFile(file: string|number, encoding?: Encoding|string, flags?: OpenFlags|string): Promise<string> {
        if (flags === undefined || flags === null)
            flags = OpenFlags.read;
        return thunk<string>(fs.readFile, [file, createOptions(encoding, flags)]);
    }
    
    export async function writeFile(file: string|number, data: string|any, options: Object|string): Promise<void> {
        return thunk<any>(fs.writeFile, arguments);
    }
    
    export async function writeTextFile(file: string|number, data: string, encoding?: Encoding|string, flags?: OpenFlags|string, mode?: string): Promise<void> {
        if (flags === undefined || flags === null)
            flags = OpenFlags.write;
        return thunk<any>(fs.writeFile, [file, data, createOptions(encoding, flags, mode)]);
    }
    
    function createOptions(encoding?: Encoding|string, flags?: OpenFlags|string, mode?: string): Object {
        var options: any = {};
        
        if (encoding === undefined || encoding === null)
            encoding = Encoding.utf8;
                        
        if (typeof encoding === 'number')
            options.encoding = Encoding[encoding];
        else if (typeof encoding === 'string')
            options.encoding = encoding;
            
        if (typeof flags === 'number')
            options.flags = openFlags[flags];
        else if (typeof flags === 'string')
            options.flags = flags;
            
        if (mode)
            options.mode = mode;
            
        return options;        
    }
}