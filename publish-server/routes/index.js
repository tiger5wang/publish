var express = require('express');
var router = express.Router();
const fs = require('fs')

/* GET home page. */
router.post('/', function(req, res, next) {
    console.log(req)
    fs.writeFileSync('../server/public/' + req.query.filename, req.body.msg)
    res.send('');
    res.end();
  // res.render('index', { title: 'Express' });
});

module.exports = router;
