// Project: https://github.com/davetemplin/async-fx/
// Written by: Dave Templin <https://github.com/davetemplin/>

"use strict";

/*
import * as fs from 'fs';
import * as http from 'http';
import * as request from 'request';
*/
declare var fs: any;
declare var http: any;
var request = require('request');

export async function timeout(milliseconds: number): Promise<void> {
    return new Promise<void>(resolve => 
        setTimeout(() => 
            resolve(), milliseconds));
}

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

export module Http {

    export class HttpRequest {
        private uri: string;
        
        constructor(uri: string) {
            this.uri = uri;
        }
                
        async getResponse(): Promise<HttpResponse> {
            return thunk<any>(request, [{uri: this.uri}], null, response => 
                new HttpResponse(response, response.body));
        }
    }

    export class HttpResponse {
        private message: any;
        private body: string;
        
        constructor(message: any, body: string) {
            this.message = message;
            this.body = body;
        }
        
        get content(): string {
            return this.body;
        }
        
        get lastModifiedDate(): Date {
            return new Date(this.message.headers['last-modified']);
        }
        
        get headers(): Map<string, string|number> {
            return new Map<string, string|number>(this.message.headers);
        }
    }
        
    export function createRequest(uri: string): HttpRequest {
        return new HttpRequest(uri);
    }
    
    export async function getJson<T>(uri: string): Promise<T> {
        var response = await createRequest(uri).getResponse();
        return <T>JSON.parse(response.content);
    } 
}

export module Parallel {
    export async function each<T1, T2>(list: T1[], action: {(value: T1): Promise<T2>}): Promise<void> {
        if (list.length > 0) {
            var promises: Promise<T2>[] = [];
            for (var item of list)
                promises.push(action(item));
            await Promise.all(promises);
        }
    }
    
    export async function invoke(list: {(): Promise<void>}[]): Promise<void> {
        if (list.length > 0) {
            var promises: Promise<void>[] = [];
            for (var action of list)
                promises.push(action());
            await Promise.all(promises);
        }
    }
    
    export async function map<T1, T2>(list: T1[], action: {(value: T1): Promise<T2>}): Promise<T2[]> {
        var result: T2[] = [];
        if (list.length > 0) {
            var tasks: Task<T2>[] = [];
            var promises: Promise<void>[] = [];        
            for (var i = 0; i < list.length; i++) {
                var task = {
                    index: i,
                    promise: action(list[i]),
                    result: <T2>null
                };
                var promise = (async function (target: Task<T2>): Promise<void> {
                    target.result = await target.promise;
                })(task);
                tasks.push(task);
                promises.push(promise);
            }                    
            await Promise.all(promises);
            tasks = tasks.sort((a,b) => a.index - b.index);
            for (var task of tasks)
                result.push(task.result);
                
        }
        return result;
               
        interface Task<T> {
            index: number;
            promise: Promise<T>;
            result: T;
        }                    
    }
}

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