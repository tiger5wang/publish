const http = require('http');
const querystring= require('querystring');
const fs = require('fs');
var archiver = require('archiver');
var child_process = require('child_process')

// create a file to stream archive data to.
var output = fs.createWriteStream(__dirname + '/example.zip');


const postData = querystring.stringify({
    'msg': 'Hello World! haha'
});

let options;
let file = './package';
// fs.stat(file,  (error, stat) => {
    options = {
        host: 'localhost',
        port: 8081,
        path: '/?filename=package.zip',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            // 'Content-Length': 0  // 这个要去掉
        }
    };

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
});
req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

var archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
});

archive.directory(file, false);

// archive.pipe(fs.createWriteStream('./package.zip'))
// archive.on('end', () => {
//     console.log('end')
// })

archive.pipe(req);
archive.on('end', () => {
    req.end();
    child_process('exec open https://github.com/login/oauth/access_token')
})
archive.finalize();


//     const req = http.request(options, (res) => {
//         console.log(`STATUS: ${res.statusCode}`);
//         console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
//         // res.setEncoding('utf8');
//         // res.on('data', (chunk) => {
//         //     console.log(`BODY: ${chunk}`);
//         // });
//         // res.on('end', () => {
//         //     console.log('No more data in response.');
//         // });
//     });
//
//     req.on('error', (e) => {
//         console.error(`problem with request: ${e.message}`);
//     });
//
//     let readStream = fs.createReadStream('./package.zip');
//     readStream.pipe(req)
//
// // Write data to request body
//     readStream.on('end', () => {
//         req.write(postData);
//         req.end();
//     })
// })



// const req = http.request(options, (res) => {
//     console.log(`STATUS: ${res.statusCode}`);
//     console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
//     // res.setEncoding('utf8');
//     // res.on('data', (chunk) => {
//     //     console.log(`BODY: ${chunk}`);
//     // });
//     // res.on('end', () => {
//     //     console.log('No more data in response.');
//     // });
// });
//
// req.on('error', (e) => {
//     console.error(`problem with request: ${e.message}`);
// });
//
// let readStream = fs.createReadStream('./cat.jpg');
// readStream.pipe(req)
//
// // Write data to request body
// req.write(postData);
// req.end();