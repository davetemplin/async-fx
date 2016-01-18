// Project: https://github.com/davetemplin/async-fx/
// Written by: Dave Templin <https://github.com/davetemplin/>

"use strict";

import * as afx from '../index';
import * as path from 'path';
import {assert} from 'chai';

describe('all', function () {    
    
    describe('Parallel', function () {
        
        it('each', async function () {
            var list: number[] = [10, 20, 30];
            var result = 0;
            await afx.Parallel.each(list, async function (value): Promise<void> {
                await afx.timeout(value);
                result += value;
            });
            assert(result === 60);            
        });
        
        it ('invoke', async function () {
            var result: number = 0;
            await afx.Parallel.invoke([
                async function (): Promise<void> {
                    await afx.timeout(10);
                    result += 10;
                },
                async function (): Promise<void> {
                    await afx.timeout(20);
                    result += 20;
                },
                async function (): Promise<void> {
                    await afx.timeout(30);
                    result += 30;
                }
            ]);
            assert(result === 60);
        });
        
        it('map', async function () {
            var list = [50, 20, 10, 40];
            var result = await afx.Parallel.map(list, async function (value): Promise<number> {
                await afx.timeout(value);
                return value / 10;
            });
            assert(result.join(',') === '5,2,1,4');
        });
    });
    
    describe('File', function () {
        it('readFile', async function () {
            var file = path.resolve(__dirname, 'test1.txt');
            var data = await afx.File.readTextFile(file);
            assert(data === 'Lorem ipsum dolor sit amet');
        });
    });
    
    describe('Http', function () {
        it('createRequest', async function () {
            var response = await afx.Http.createRequest('http://www.google.com/').getResponse();
            assert(response.content.indexOf('Google') >= 0);
        });
        
        it('getJson ', async function () {
            var zip = '92679';
            var url = 'http://query.yahooapis.com/v1/public/yql?q=select+item+from+weather.forecast+where+location%3D%22'+ zip + '%22&format=json';
            var data = await afx.Http.getJson<any>(url);
            assert(data.query);
            process.exit();                            
        });        
    });
});