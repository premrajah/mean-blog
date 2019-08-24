const http = require('http');

const server = http.createServer( (req, res) => {
    res.end('my First response');
});

server.listen(process.env.PORT || 3000);
