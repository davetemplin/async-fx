// Project: https://github.com/davetemplin/async-fx/
// Written by: Dave Templin <https://github.com/davetemplin/>

"use strict";

import {Http} from '../index';

(async function () {
    var zip = '92679';
    var url = 'http://query.yahooapis.com/v1/public/yql?q=select+item+from+weather.forecast+where+location%3D%22'+ zip + '%22&format=json';
    var data = await Http.getJson<any>(url);
    console.log(data.query.results.channel.item.forecast);
    process.exit();                            
})();