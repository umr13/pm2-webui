const config = require('../config')

const checkAuthentication = async (ctx, next) => {
    if(ctx.session.isAuthenticated){
        return ctx.redirect(config.BASE_PATH + '/apps')
    }
    await next()
}

const isAuthenticated = async (ctx, next) => {
    if(!ctx.session.isAuthenticated){
        return ctx.redirect(config.BASE_PATH + '/login')
    }
    await next()
}

module.exports = {
    isAuthenticated,
    checkAuthentication,
};