const http = require('http');
const querystring= require('querystring');
const fs = require('fs');
var archiver = require('archiver');
var child_process = require('child_process');

// create a file to stream archive data to.
var output = fs.createWriteStream(__dirname + '/example.zip');
const postData = querystring.stringify({
    'msg': 'Hello World! haha'
});

// 三：
let redirect_uri = encodeURIComponent('http://localhost:8081/auth');
child_process.exec(`start chrome https://github.com/login/oauth/authorize?client_id=Iv1.5dd238130b37f0db&redirect_uri=${redirect_uri}&scope=read%3Auser&state=abc123`);

const server = http.createServer((request, res) => {
    // console.log(request.url)
    console.log('real publish!!!')
    const token = request.url.match(/token=([^&]+)/)[1];
	
	let file = './package';
	let options = {
		host: 'localhost',
		port: 8081,
		path: '/?filename=package.zip',
		method: 'POST',
		headers: {
		    'token': token,
			'Content-Type': 'application/octet-stream ',
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
	archive.finalize();
	
	archive.pipe(req);
	archive.on('end', () => {
		req.end();
		console.log('publish success!!');
		server.close()
	})
	
    
});

server.listen(8080);

// 二： GitHub OAuth 验证

/*let options;
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
    let redirect_uri = encodeURIComponent('http://localhost:8081/auth')
    child_process.exec(`start chrome https://github.com/login/oauth/authorize?client_id=Iv1.5dd238130b37f0db&redirect_uri=${redirect_uri}&scope=read%3Auser&state=abc123`)
})
archive.finalize();*/


// 一：读取文件并写入本地 zip

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


// 一：读取文件并写入本地 jpg

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