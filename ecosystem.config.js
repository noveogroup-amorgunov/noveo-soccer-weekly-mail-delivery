module.exports = {
    /**
     * Application configuration section
     * http://pm2.keymetrics.io/docs/usage/application-declaration/
     */
    apps: [
        {
            name: 'noveo-soccer-weekly-delivery',
            script: 'index.js',
            env_development: { watch: true, NODE_ENV: 'development' },
            env_production: { NODE_ENV: 'production' }
        },
    ],
    /**
     * Deployment section
     * http://pm2.keymetrics.io/docs/usage/deployment/
     */
    deploy: {}
};
