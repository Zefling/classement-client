export const environment = {
    version: require('../../package.json').version,
    production: true,
    debugRouter: false,
    minLogLevel: 'warn',
    api: {
        active: true,
        path: 'https://api.classement.ikilote.net/',
    },
};
