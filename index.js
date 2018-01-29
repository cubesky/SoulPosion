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
            return 'Welcome to Soul Posion'
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