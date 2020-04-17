import express from 'express';
import fs from 'fs';
import path from 'path';
import Hapi from 'hapi';
import http2 from 'http2';
import inert from 'inert';
import Underdog from 'underdog';
import imageArray from './images';

/*
*
* HAPI
*
* */

const options = {
    key: fs.readFileSync('./selfsigned.key'),
    cert: fs.readFileSync('./selfsigned.crt'),
};

const server = new Hapi.server({
    listener: http2.createSecureServer(options),
    host: 'localhost',
    port: 3443,
    tls: true
});

const provision = async () => {

    await server.register(inert);
    await server.register(Underdog);

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return h.file('./index.html');
        }
    });

    server.route({
        method: 'GET',
        path: '/script/{row}/{column}',
        handler: (req, h) => {
            return new Promise(resolve =>{
                fs.readFile('frontStript.js', 'utf8', (err, data) => {
                    resolve(h.response(`${data}(${req.params.row},${req.params.column},'${imageArray[req.params.row][req.params.column]}');`));
                });

            });
        }
    });

    await server.start(err => {
        if (err) console.error(err);
        console.log(`Started ${server.connections.length} connections`)
    });

};

provision()
    .then(() => console.log("Http 2 server started at the port: 3443"))
    .catch(error => console.log("An unexpected error happened: ", error))

/*
*
* EXPRESS
*
* */

const port = 3000;
const app = express();

const resolveIndexHtml = (req, res) => {
    res.sendFile(path.join(__dirname, './index.html'));
};


const resolveScripts = (req, res) => {
    fs.readFile('frontStript.js', (err, data) => {
        res.write(data);
        res.write(`(${req.params.row},${req.params.column},'${imageArray[req.params.row][req.params.column]}');`);
        res.end();
    });
};

app.get('/script/:row/:column', resolveScripts);
app.get('*', resolveIndexHtml);
app.listen(port, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Http 1 server started at the port:', port)
    }
});

