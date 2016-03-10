# async-fx
> Simplifies web, file, and parallel tasks with TypeScript async/await

This package makes it easier to perform web requests, access files, call asynchronous functions in parallel using [TypeScript](http://www.typescriptlang.org/) and [**async/await**](https://blogs.msdn.microsoft.com/typescript/2015/11/03/what-about-asyncawait/). 

This package bundles the following: (each of which is also available individually if desired)
* [**web-request**](https://www.npmjs.com/package/web-request)
* [**async-file**](https://www.npmjs.com/package/async-file)
* [**async-parallel**](https://www.npmjs.com/package/async-parallel)

## Getting Started

Make sure you're running Node v4 and TypeScript 1.7 or higher...
```
$ node -v
v4.2.6
$ npm install -g typescript tsd
$ tsc -v
Version 1.7.5
```

Install the *async-fx* package...
```
$ npm install async-fx
```

Install required typings definitions for the Node.js API...
```
$ tsd install node
```

Write some code...
```js
import {File, Parallel, WebRequest} from 'async-fx';
(async function () {
    var urls = ['http://google.com/', 'http://bing.com/', 'http://yahoo.com/'];
    var list = await Parallel.map(urls, async function (url): Promise<string> {
        var response = await WebRequest.get(url);
        return response.content;
    });
    await Parallel.each(list, async function (data) {
        var name = /<title>(.*)<\/title>/.exec(data)[1] + '.html';
        await File.writeTextFile(name, data);
        console.log('file "' + name + '" written');
    });
    console.log('done');
})();
```
Save the above to a file (index.ts), build and run it!
```
$ tsc index.ts typings/node/node.d.ts --target es6 --module commonjs
$ node index.js
file "Google.html" written
file "Yahoo.html" written
file "Bing.html" written
done
```

## More Examples

Read a set of three text files, one at a time...
```js
var data1 = await File.readTextFile('data1.txt');
var data2 = await File.readTextFile('data2.txt');
var data3 = await File.readTextFile('data3.txt');
```

Get the current weather forecast from a JSON feed...
```js
var url = 'http://query.yahooapis.com/v1/public/yql?q=select+item+from+weather.forecast+where+location%3D%2292679%22&format=json';
var data = await WebRequest.json<any>(url);
console.log(data.query.results.channel.item.forecast);
```

Append a line into an arbitrary series of text files, processing each operation in parallel...
```js
var files = ['data1.log', 'data2.log', 'data3.log'];
await Parallel.each(files, async function (file) {
    await File.writeTextFile(file, '\nPASSED!\n', null, File.OpenFlags.append);
});
```

Get the top level page content from an arbitrary series of urls, running each request in parallel...
```js
var urls = ['http://google.com/', 'http://bing.com/', 'http://yahoo.com/'];
var result = await Parallel.map(urls, async function (url): Promise<string> {
    var response = await WebRequest.get(url);
    return response.content;
});
```

Get two pages sleeping for 2 seconds in between...
```js
var page1 = await WebRequest.get('http://www.yahoo.com/news');
await sleep(2000);
var page2 = await WebRequest.get('http://www.yahoo.com/weather');
```
