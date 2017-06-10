var app = angular.module('constants', []);
app.constant('GLOBALS', {
        SITE_URL: "/SEEDPROJECTS/angularSeedProject-v-1.3.1/",
        ENV: "DEV" /*DEV, STAGING, PRODUCTION */
    });


 app.constant('SETTINGS', {
        DEV: {
            "apiUrl": "",
            "siteUrl":"src/"
        },
        STAGING: {
            "apiUrl": "",
           	"siteUrl":"build/"
        },
        PRODUCTION: {
            "apiUrl": "",
            "siteUrl":"build/"
        }
 });

