module.exports = () => ({
    i18n: {
        enabled: true,
        config: {
            defaultLocale: 'zh-Hans',
            locales: ['zh-Hans', 'en']
        }
    },

    'users-permissions': {
        enabled: true,
        config: {
            jwt: {
                expiresIn: '7d',
            },
        },
    }
});
