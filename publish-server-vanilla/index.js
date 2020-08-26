const http = require('http');
// const fs = require('fs');
// const unzip = require('unzip');
// const unzipper = require('unzipper')


// Create an HTTP tunneling proxy
const server = http.createServer((req, res) => {

    if (req.url.match(/^\/auth/)) {
        return auth(req, res)
    }

    // let matched = req.url.match(/filename=([^&]+)/);
    // let filename = matched && matched[1];
    // if (!filename) {
    //     return;
    // }
    // let writeStream = fs.createWriteStream('../server/public/' + filename);
    // req.pipe(writeStream);  // 等效于下面注释
    // req.on('data', trunk => {
    //     writeStream.write(trunk)
    // });
    // req.on('end', trunk => {
    //     writeStream.end(trunk)
    // })

    // let writeStream = unzipper.Extract({path: '../server/public'});
    // req.pipe(writeStream);

    req.on('end', () => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('okay');
    })

});

function auth(req, res) {
    let code = req.url.match(/code=([^&]+)/)[1];
    console.log(code)
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('okay');
}

server.listen(8081);