var app = angular.module('admin.route',[
	'ngCookies',
	'defaultServices',
    'constants',
	'ui.router'
	]);

app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider','$httpProvider','GLOBALS','SETTINGS', function($stateProvider, $urlRouterProvider, $locationProvider,$httpProvider,GLOBALS,SETTINGS) {
    $stateProvider
    .state('login', {
        url: "/login",
        data: {
            pageTitle: 'Login'
        },
        views: {
            'main': {
                templateUrl: "" + SETTINGS[GLOBALS.ENV].siteUrl + "app/components/login/login.html",
                controller: "loginCtrl",
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: ModuleName,
                            insertBefore: '#load_plugins_before',
                            files: ["" + SETTINGS[GLOBALS.ENV].siteUrl + "app/components/login/loginCtrl.js"
                            ]
                        });
                    }]
                }
            }
        }

    })
     .state('register', {
        url: "/register",
        data: {
            pageTitle: 'Register'
        },
        views: {
            'main': {
                templateUrl: "" + SETTINGS[GLOBALS.ENV].siteUrl + "app/components/register/registerView.html",
                controller: "registerCtrl",
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: ModuleName,
                            insertBefore: '#load_plugins_before',
                            files: ["" + SETTINGS[GLOBALS.ENV].siteUrl + "app/components/register/registerCtrl.js"
                            ]
                        });
                    }]
                }
            }
        }

    })
    .state('main', {
        url: "",
        data: {
            pageTitle: 'Home Page'
        },
        views: {
            'main': {
                templateUrl: "" + SETTINGS[GLOBALS.ENV].siteUrl + "app/common/views/mainLayout.html",
                controller: "",
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: ModuleName,
                            insertBefore: '#load_plugins_before',
                            files: [

                            ]
                        });
                    }]
                }
            }
        }

    })
    .state('main.root', {
        url: "/",
        data: {
            pageTitle: 'Home Page'
        },
        views: {
            'home': {
                templateUrl: "" + SETTINGS[GLOBALS.ENV].siteUrl + "app/components/home/homeView.html",
                controller: "homeCtrl",
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: ModuleName,
                            insertBefore: '#load_plugins_before',
                            files: [
                            "" + SETTINGS[GLOBALS.ENV].siteUrl + "app/components/home/homeCtrl.js" 
                            ]
                        });
                    }]
                }
            }
        }

    })
    .state('main.home', {
        url: "/home",
        data: {
            pageTitle: 'Home Page'
        },
        views: {
            'home': {
                templateUrl: "" + SETTINGS[GLOBALS.ENV].siteUrl + "app/components/home/homeView.html",
                controller: "homeCtrl",
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: ModuleName,
                            insertBefore: '#load_plugins_before',
                            files: [
                            "" + SETTINGS[GLOBALS.ENV].siteUrl + "app/components/home/homeCtrl.js" 
                            ]
                        });
                    }]
                }
            }
        }

    })
    
}]);