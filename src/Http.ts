// Project: https://github.com/davetemplin/async-fx/
// Written by: Dave Templin <https://github.com/davetemplin/>

"use strict";

import * as http from 'http';
import * as request from 'request';
import {thunk} from './thunk';

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
        private message: http.IncomingMessage;
        private body: string;
        
        constructor(message: http.IncomingMessage, body: string) {
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