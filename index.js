const http = require('http');
const express = require('express');

const route = require('./routes/main');

let app = express();
let server = http.createServer(app);

app.use('/',route);


server.listen(8080, function(){
    console.log('Connected');
})