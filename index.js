const Hapi = require('hapi');
const Boom = require('boom');
const config = require('config');

const launchServer = async function() {
    
    const dbOpts = {
        url: config.get('dbUrl'),
        settings: {
            poolSize: 10
        },
        decorate: true
    };
    
    const server = Hapi.server({ host: config.get('listenHost'), port: config.get('listenPort'), routes: { cors: true, jsonp: 'callback' } });
    
    await server.register({
        plugin: require('hapi-mongodb'),
        options: dbOpts
    });

    server.ext('onPreResponse', function(request, reply) {
        if (request.url.pathname === '/write') {
            request.response.header('Content-Type', 'application/javascript');
        } else if (request.url.pathname === '/json') {
            request.response.header('Allow-Control-Allow-Origin', '*');
        } else if (request.url.pathname === '/text') {
            request.response.header('Allow-Control-Allow-Origin', '*');
        }
        return reply.continue  
    });

    server.route( {
        method: 'GET',
        path: '/',
        handler: async function(request,reply) {
            return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>心灵毒鸡汤 API</title>
</head>
<body>
<h1>心灵毒鸡汤</h1>
<hr>
<h2>文本 API <small>https://soulposion.utilapi.bid/text</small></h2>
<p>文本 API 只返回毒鸡汤本身，不返回其他数据。</p>
<hr>
<h2>脚本 API <small>https://soulposion.utilapi.bid/write</small></h2>
<p>脚本 API 返回一段 Javascript ，本质是 document.write </p>
<hr>
<h2>JSON API <small>https://soulposion.utilapi.bid/json</small></h2>
<p>JSON API 返回完整的结构，支持 JSONP 调用，JSONP 调用方式为在地址后加上 ?callback= </p>
</body>
</html>
            `
        }
    });

   server.route( {
        method: 'GET',
        path: '/text',
        config: {
            cors: true
        },
        handler: async function(request,reply) {
            const db = request.mongo.db;
            try {
                const result = await db.collection('soulposion').aggregate([{ $sample: { size: 1 } }]).toArray()
                return result[0].content;
            } catch (err) {
                throw Boom.internal('Internal MongoDB error', err);
            }
        }
    });

    server.route( {
        method: 'GET',
        path: '/write',
        handler: async function(request,reply) {
            const db = request.mongo.db;
            try {
                const result = await db.collection('soulposion').aggregate([{ $sample: { size: 1 } }]).toArray()
                return 'document.write(\'' + result[0].content + '\')';
            } catch (err) {
                throw Boom.internal('Internal MongoDB error', err);
            }
        }
    });

    server.route( {
        method: 'GET',
        path: '/json',
        config: {
            cors: true
        },
        handler: async function(request,reply) {
            const db = request.mongo.db;
            try {
                var result = (await db.collection('soulposion').aggregate([{ $sample: { size: 1 } }]).toArray())[0]
                delete result._id
                return result;
            } catch (err) {
                throw Boom.internal('Internal MongoDB error', err);
            }
        }
    });

    await server.start();
    console.log(`Server started at ${server.info.uri}`);
};

launchServer().catch((err) => {
    console.error(err);
    process.exit(1);
});