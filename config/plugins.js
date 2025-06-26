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
            // CDN配置
            cdn: {
                enabled: env.bool('CDN_ENABLED', false),
                baseUrl: env('CDN_BASE_URL', ''),
                imagePath: env('CDN_IMAGE_PATH', '/images'),
                enableOptimization: env.bool('CDN_OPTIMIZATION', true),
            }
        },
    }
});
