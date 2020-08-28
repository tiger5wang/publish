const http = require('http');
const https = require('https');
const fs = require('fs');
const unzip = require('unzip');


// Create an HTTP tunneling proxy
const server = http.createServer((req, res) => {

    if (req.url.match(/^\/auth/)) {
        return auth(req, res)
    }
	
	if (!req.url.match(/^\/?/)) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('not found');
		return
	}
	
	const options = {
		hostname: 'api.github.com',
		port: 443,
		path: `/user`,
		method: 'GET',
        headers: {
			Authorization: `token ${req.headers.token}`,
            "User-Agent": "publish-server"
        }
	};
	
	const request = https.request(options, (response) => {
		// console.log('statusCode:', res.statusCode);
		// console.log('headers:', res.headers);
		let body = "";
		response.on('data', (d) => {   // 获取的 user 信息
            body += d.toString()
		});
		
		response.on('end', () => {
		    let user = JSON.parse(body);
		    console.log(user)
            
            // 此处进行权限检查
			
			let writeStream = unzip.Extract({path: '../server/public'});
			req.pipe(writeStream);
			
            // 接收数据
			req.on('end', () => {
				res.writeHead(200, { 'Content-Type': 'text/plain' });
				res.end('okay');
			})
        })
	});
	
	request.on('error', (e) => {
		console.error(e);
	});
	request.end();
    
    // let matched = req.url.match(/filename=([^&]+)/);
    // let filename = matched && matched[1];
    // if (!filename) {
    //     return;
    // }
    // let writeStream = fs.createWriteStream('../server/public/' + filename);
    // req.pipe(writeStream);  // 等效于下面 6 行注释
    // req.on('data', trunk => {
    //     writeStream.write(trunk)
    // });
    // req.on('end', trunk => {
    //     writeStream.end(trunk)
    // })

    // let writeStream = unzipper.Extract({path: '../server/public'});
    // req.pipe(writeStream);

    // req.on('end', () => {
    //     res.writeHead(200, { 'Content-Type': 'text/plain' });
    //     res.end('okay');
    // })

});

function auth(req, res) {
    let code = req.url.match(/code=([^&]+)/)[1];   // 匹配 code
	let state = 'abc123';
	let client_secret = '2145fce43a48e148c6893cff6a225e84f405c229';
	let client_id = 'Iv1.5dd238130b37f0db';
	let redirect_uri = encodeURIComponent('http://localhost:8081/auth');
	
	let params = `code=${code}&state=${state}&client_secret=${client_secret}&client_id=${client_id}&redirect_uri=${redirect_uri}`;
	let url = `https://github.com/login/oauth/access_token?${params}`;
	
	const options = {
		hostname: 'github.com',
		port: 443,
		path: `/login/oauth/access_token?${params}`,
		method: 'POST'
	};
	
	const request = https.request(options, (response) => {
		// console.log('statusCode:', res.statusCode);
		// console.log('headers:', res.headers);
		
		response.on('data', (d) => {
			// console.log('dddd', d.toString())
            let result = d.toString().match(/access_token=([^&]+)/);   // 匹配 access_token
            if(result) {
				let token = result[1];
	
				res.writeHead(200, {
					'access_token': token,
					'Content-Type': 'text/html'
				});
				res.end(`<a href="http://localhost:8080/publish?token=${token}">publish</a>`);
            } else {
				res.writeHead(200, {
					'Content-Type': 'text/plain'
				});
				res.end('error');
            }
			
		});
	});
	
	request.on('error', (e) => {
		console.error(e);
	});
	request.end();
	
}

server.listen(8081);