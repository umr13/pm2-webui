#!/usr/bin/env node

const config = require('./config')
const { setEnvDataSync } = require('./utils/env.util')
const { generateRandomString } = require('./utils/random.util')
const path = require('path');
const serve = require('koa-static');
const render = require('koa-ejs');
const koaBody = require('koa-body');
const session = require('koa-session');
const Koa = require('koa');

// Init Application

if(!config.APP_USERNAME || !config.APP_PASSWORD){
    console.log("You must first setup admin user. Run command -> npm run setup-admin-user")
    process.exit(2)
}

if(!config.APP_SESSION_SECRET){
    const randomString = generateRandomString()
    setEnvDataSync(config.APP_DIR, { APP_SESSION_SECRET: randomString})
    config.APP_SESSION_SECRET = randomString
}

// Create App Instance
const app = new Koa();

// App Settings
app.proxy = true;
app.keys = [config.APP_SESSION_SECRET];

// Middlewares
app.use(session(app));

app.use(koaBody());

// Expose the reverse-proxy base path to all templates as `base`
app.use(async (ctx, next) => {
    ctx.state.base = config.BASE_PATH;
    await next();
});

// Serve static assets, accounting for the base path when behind a sub-path proxy
const staticServe = serve(path.join(__dirname, 'public'));
app.use(async (ctx, next) => {
    const base = config.BASE_PATH;
    if (!base) {
        return staticServe(ctx, next);
    }
    if (ctx.path === base || ctx.path.startsWith(base + '/')) {
        const original = ctx.path;
        ctx.path = ctx.path.slice(base.length) || '/';
        try {
            await staticServe(ctx, async () => {
                ctx.path = original; // restore before passing to the router
                await next();
            });
        } finally {
            ctx.path = original; // restore if a file was served directly
        }
        return;
    }
    return next();
});

const router = require("./routes");
app.use(router.routes());

render(app, {
    root: path.join(__dirname, 'views'),
    layout: 'base',
    viewExt: 'html',
    cache: false,
    debug: false
});

app.listen(config.PORT, config.HOST, ()=>{
    console.log(`Application started at http://${config.HOST}:${config.PORT}`)
})