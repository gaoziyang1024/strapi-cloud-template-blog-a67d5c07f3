module.exports = ({ env }) => ({
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
    },

    upload: {
        config: {
            provider: 'local',
            providerOptions: {
                sizeLimit: 100000000, // 100MB
                baseURL: env('CDN_URL', 'https://gditc.org') // CDN基础地址
            },
            actionOptions: {
                upload: {},
                uploadStream: {},
                delete: {},
            },
        },
    }
});
