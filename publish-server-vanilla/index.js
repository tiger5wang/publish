const http = require('http');
const fs = require('fs')

// Create an HTTP tunneling proxy
const server = http.createServer((req, res) => {
    let matched = req.url.match(/filename=([^&]+)/);
    let filename = matched && matched[1];
    if (!filename) {
        return;
    }
    let writeStream = fs.createWriteStream('../server/public/' + filename);
    req.pipe(writeStream);  // 等效于下面注释
    // req.on('data', trunk => {
    //     writeStream.write(trunk)
    // });
    // req.on('end', trunk => {
    //     writeStream.end(trunk)
    // })

    req.on('end', () => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('okay');
    })

});

server.listen(8081)