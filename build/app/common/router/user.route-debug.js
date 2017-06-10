var ModuleName = 'DEMO';
var app = angular.module('user.route',[
    'ngCookies',
    'defaultServices',
    'constants',
    'ui.router'
    ]);

app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider','$httpProvider','GLOBALS','SETTINGS', function($stateProvider, $urlRouterProvider, $locationProvider,$httpProvider,GLOBALS,SETTINGS) {
    $stateProvider
    .state('main.component1', {
        url: "/component1",
        data: {
            pageTitle: 'Component Two'
        },
        views: {
            'home': {
                templateUrl: "" + SETTINGS[GLOBALS.ENV].siteUrl + "app/components/component1/component1View.html",
                controller: "component1Ctrl",
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: ModuleName,
                            insertBefore: '#load_plugins_before',
                            files: [
                            "" + SETTINGS[GLOBALS.ENV].siteUrl + "app/components/component1/component1Ctrl.js",
                            "" + SETTINGS[GLOBALS.ENV].siteUrl + "app/components/component1/homeDirective.js"
                            ]
                        });
                    }]
                }
            }
        }

    })
    .state('main.component2', {
        url: "/component2",
        data: {
            pageTitle: 'Component Two'
        },
        views: {
            'home': {
                templateUrl: "" + SETTINGS[GLOBALS.ENV].siteUrl + "app/components/component2/component2View.html",
                controller: "component2Ctrl",
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: ModuleName,
                            insertBefore: '#load_plugins_before',
                            files: [
                            "" + SETTINGS[GLOBALS.ENV].siteUrl + "app/components/component2/component2Ctrl.js" ,
                            "" + SETTINGS[GLOBALS.ENV].siteUrl + "app/components/component2/component2Service.js",

                            ]
                        });
                    }],
                    user:['userApiService',function(userApiService){
                    return userApiService.GetAllCountry();
                    }],
                    user1:['userApiService',function(userApiService){
                    return userApiService.GetAllCountry();
                    }],
                    user2:['userApiService',function(userApiService){
                    return userApiService.GetAllCountry();
                    }]
                }
            }
        }

    })
   
}]);