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
            },
            actionOptions: {
                upload: {},
                uploadStream: {},
                delete: {},
            },
            // CDN URL 替换配置
            action: {
                url: ({ env }) => env('CDN_BASE_URL', 'https://uploads.gditc.org'),
            },
        },
    }
});
