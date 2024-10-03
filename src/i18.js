const { log } = require('console');
const i18next = require('i18next');
const middleware = require('i18next-express-middleware');
const Backend = require('i18next-fs-backend');
const path = require('path');

const initI18next = (app) => {
    i18next
        .use(Backend)
        .use(middleware.LanguageDetector)
        .init(
            {
                lng: 'es',
                backend: {
                    loadPath: path.join(
                        __dirname,
                        'locales',
                        '{{lng}}',
                        'translation.json'
                    ),
                },
                detection: {
                    order: [
                        'header',
                        'cookie',
                        'session',
                        'localStorage',
                        'navigator',
                    ],
                    caches: ['cookie'],
                },
                interpolation: {
                    escapeValue: false,
                },
                whitelist: ['en', 'es'],
            },
            (err, t) => {
                if (err) {
                    console.error('i18next initialization failed:', err);
                    return;
                }

                app.use(middleware.handle(i18next));
            }
        );
};

const setLanguage = (lang) => {
    i18next.changeLanguage(lang);
};

module.exports = { initI18next, setLanguage };
