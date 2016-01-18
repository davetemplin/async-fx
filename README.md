# async-fx
A collection of useful asynchronous utilities for use with TypeScript async/await


This package makes it easier to write code for various tasks in Node.js using [**async-await**](https://en.wikipedia.org/wiki/Await) with [**TypeScript**](http://blogs.msdn.com/b/typescript/archive/2015/11/03/what-about-async-await.aspx). 

> **Warning:** This package requires targeting EcmaScript 6 (ES6) and Node v4, which is somewhat bleeding edge at the moment. Also this package is currently in an expirmental state and is not feature complete. Use at your own risk!

The main goal of this package is wrap the core [Node.js API](https://nodejs.org/api/http.html), replacing any callback functions with an equivalent async function.
In several cases, alternative definitions of various functions are provided to further enhance the development experience and take better advantage of TypeScript and async/await.

## Examples

### File.readTextFile
Read a set of three text files, one at a time...
```js
import {File} from 'aync-fx';
var data1 = await File.readTextFile('data1.txt');
var data2 = await File.readTextFile('data2.txt');
var data3 = await File.readTextFile('data3.txt');
```

### Http.getJson
Get the current weather forecast...
```js
import {Http} from 'async-fx';
var zip = '92679';
var url = 'http://query.yahooapis.com/v1/public/yql?q=select+item+from+weather.forecast+where+location%3D%22'+ zip + '%22&format=json';
var data = await Http.getJson<any>(url);
console.log(data.query.results.channel.item.forecast);
```

### Parallel.each
Append a line into an arbitrary series of text files, processing each operation in parallel...
```js
import {File, Parallel} from 'aync-fx';
var files = ['data1.log', 'data2.log', 'data3.log'];
Parallel.each(files, async function (file) {
    await File.writeTextFile(file, '\nPASSED!\n', null, File.OpenFlags.append);
});
```

### Parallel.map
Get the top level page content from an arbitrary series of urls, running each request in parallel...
```js
import {Http, Parallel} from 'aync-fx';
var urls = ['http://google.com/', 'http://bing.com/', 'http://yahoo.com/'];
var result = Parallel.map(urls, async function (url): Promise<stirng> {
    var response = await Http.createRequest(url).getResponse();
    return response.content;
});
```

## Getting Started

Make sure you're running Node v4...
```
$ node -v
v4.2.4
```
Install everything we need...
```
$ npm install async-fx
$ npm install -g typescript
```
Write some code...
```js
import {Http} from '../index';

(async function () {
    var zip = '92679';
    var url = 'http://query.yahooapis.com/v1/public/yql?q=select+item+from+weather.forecast+where+location%3D%22'+ zip + '%22&format=json';
    var data = await Http.getJson<any>(url);
    console.log(data.query.results.channel.item.forecast);
})();
```
Save the above to a file (index.ts), build and run it!
```
$ tsc index.ts --target es6 --module commonjs
$ node index.js
[ { code: '27', date: '17 Jan 2016', day: 'Sun', high: '69', low: '45', text: 'Mostly Cloudy' },
  { code: '26', date: '18 Jan 2016', day: 'Mon', high: '66', low: '46', text: 'Cloudy' },
  { code: '39', date: '19 Jan 2016', day: 'Tue', high: '68', low: '47', text: 'PM Showers' },
  { code: '30', date: '20 Jan 2016', day: 'Wed', high: '70', low: '45', text: 'AM Clouds/PM Sun' },
  { code: '30', date: '21 Jan 2016', day: 'Thu', high: '77', low: '45', text: 'Partly Cloudy' } ]
```
