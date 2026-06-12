require('dotenv').config()

// Normalize a reverse-proxy sub-path: '' (root), or '/pm2' (leading slash, no trailing slash)
function normalizeBasePath(value) {
    if (!value) return ''
    let path = value.trim()
    if (!path.startsWith('/')) path = '/' + path
    path = path.replace(/\/+$/, '')
    return path === '/' ? '' : path
}

const config = {
    HOST: process.env.HOST || '127.0.0.1',
    PORT: process.env.PORT || 4343,
    BASE_PATH: normalizeBasePath(process.env.BASE_PATH),
    APP_DIR: process.cwd(),
    APP_SESSION_SECRET: process.env.APP_SESSION_SECRET || null,
    APP_USERNAME: process.env.APP_USERNAME || null,
    APP_PASSWORD: process.env.APP_PASSWORD || null,
    SHOW_GIT_INFO: process.env.SHOW_GIT_INFO || false,
    SHOW_ENV_FILE: process.env.SHOW_ENV_FILE || false,
    DEFAULTS: {
        LINES_PER_REQUEST: 50,
        BCRYPT_HASH_ROUNDS: 10,
    }
}

module.exports = config;