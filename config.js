const config = {
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    publicRoute: process.env.PUBLIC_ROUTE || 'app',
}

module.exports = config;