// Project: https://github.com/davetemplin/async-fx/
// Written by: Dave Templin <https://github.com/davetemplin/>

import {File, Parallel, WebRequest, sleep} from './index';

(async function () {
    var files = ['data1.log', 'data2.log', 'data3.log'];
    await Parallel.each(files, async function (file) {
        await File.writeTextFile(file, '\nPASSED!\n', null, File.OpenFlags.append);
    });
    process.exit();
})();