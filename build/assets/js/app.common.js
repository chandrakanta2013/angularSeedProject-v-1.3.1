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


var app = angular.module('defaultServices', []);

app.factory('encodeURL', function() {
    return {
        encode: function(array) {
            var r = '';
            for (var i in array) {
                r += encodeURIComponent(i) + '=' + encodeURIComponent(array[i]) + '&';
            }
            r = r.slice(0, -1);
            return r;
        },
        serialize: function(obj, prefix) {
            var str = [];
            for (var p in obj) {
                if (obj.hasOwnProperty(p)) {
                    if (_.isArray(obj[p])) {
                        _.each(obj[p], function(arrayData) {
                            if (_.isObject(arrayData)) {
                                str.push(encodeURIComponent(p) + "%3D" + encodeURIComponent(JSON.stringify(arrayData)));
                            } else {
                                str.push(encodeURIComponent(p) + "%3D" + encodeURIComponent(arrayData));
                            }
                        });
                    } else if (_.isObject(obj[p])) {
                        str.push(encodeURIComponent(p) + "%3D" + encodeURIComponent(JSON.stringify(obj[p])));
                    } else if (_.isNull(obj[p]) || _.isUndefined(obj[p])) {

                    } else {
                        str.push(encodeURIComponent(p) + "%3D" + encodeURIComponent(obj[p]));
                    }
                }
            }
            return str.join("%26");
        }
    };
});

app.factory('browserService', ["$window", function($window) {
    var uaMatch = function(ua) {
        ua = ua.toLowerCase();

        var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
            /(webkit)[ \/]([\w.]+)/.exec(ua) ||
            /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
            /(msie) ([\w.]+)/.exec(ua) ||
            ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];

        return {
            browser: match[1] || "",
            version: match[2] || "0"
        };
    };
    var matched = uaMatch($window.navigator.userAgent);
    var browser = {};

    if (matched.browser) {
        browser[matched.browser] = true;
        browser.version = matched.version;
    }

    // Chrome is Webkit, but Webkit is also Safari.
    if (browser.chrome) {
        browser.webkit = true;
    } else if (browser.webkit) {
        browser.safari = true;
    }

    return browser;
}]);

app.factory('resourceinterceptor', ["$q", "browserService", "encodeURL", function($q, browserService, encodeURL) {
    return {
        // optional method
        'request': function(config) {
            // do something on success
            //console.log(config)
            if (config.url.search('php54.indianic.com/healthcareiq/api') != -1) {
                if (browserService.msie && browserService.version === '9.0' || browserService.version === '8.0' && config.method == "GET") {
                    var querystring = encodeURL.serialize(config.params);
                    var encodedurl = '_quantum_proxy.php?q=' + encodeURIComponent(config.url);
                    if (querystring !== "") {
                        encodedurl += "%3F" + querystring;
                    }
                    config.params = {};
                    config.url = encodedurl;
                } else if (browserService.msie && browserService.version === '9.0' || browserService.version === '8.0' && config.method != "POST") {
                    var encodedurl = '_quantum_proxy.php?q=' + encodeURIComponent(config.url);
                    config.url = encodedurl;
                } else if (browserService.msie && browserService.version === '9.0' || browserService.version === '8.0' && config.method != "PUT") {
                    var encodedurl = '_quantum_proxy.php?q=' + encodeURIComponent(config.url);
                    config.url = encodedurl;
                }
            }
            return config;
        },
        // optional method
        'requestError': function(rejection) {
            // do something on error

            return $q.reject(rejection);
        },
        // optional method
        'response': function(response) {
            // do something on success
            return response;
        },
        // optional method
        'responseError': function(rejection) {
            // do something on error
            return $q.reject(rejection);
        }
    };
}]);

app.factory('resourceUrl', ["browserService", function(browserService) {
    return {

        proxify: function(url) {
            //                    return (browserService.msie && browserService.version === '9.0' || browserService.version === '8.0' )
            return (true) ? '_quantum_proxy.php?q=' + encodeURIComponent(url) : url;
        }
    };
}]);

app.factory('MetaInformation', [function() {
    var metaDescription = '';
    var metaKeyword = '';
    var metaTitle = '';
    return {
        metaDescription: function() {
            return metaDescription;
        },
        metaKeyword: function() {
            return metaKeyword;
        },
        metaTitle: function() {
            return metaTitle;
        },
        reset: function() {
            metaDescription = '';
            metaKeyword = '';
            metaTitle = '';
        },
        setMetaTitle: function(newMetaTitle) {
            metaTitle = newMetaTitle;
        },
        setMetaDescription: function(newMetaDescription) {
            metaDescription = newMetaDescription;
        },
        setMetaKeyword: function(newKeyword) {
            metaKeyword = newKeyword;

        }
    };
}]);

app.service('resourceService', ['$cookies', '$cookieStore', '$http', '$state', 'resourceUrl', 'browserService', function($cookies, $cookieStore, $http, $state, resourceUrl, browserService) {
    var resourceService = {};
    resourceService.GetAllCountry = function() {

        
        return $http({
            url: 'http://php54.indianic.com/vegas_venues/webservice/get_night_club_listing?&search_nightclub=&page_index=1',
            method: 'POST',
            data: $.param({

            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    };
    return resourceService;
}]);

// app.factory('XmlToJson', [function() {
//     var x2js = new X2JS();
//     return {
//         toJSON: function(xml) {
//             return x2js.xml_str2json(xml);
//         }
//     };
// }]);

app.service(
    "trafficCop",
    function setupService() {
        var total = {
            all: 0,
            get: 0,
            post: 0,
            delete: 0,
            put: 0,
            head: 0
        };

        var pending = {
            all: 0,
            get: 0,
            post: 0,
            delete: 0,
            put: 0,
            head: 0
        };

        return {
            pending: pending,
            total: total,
            endRequest: endRequest,
            startRequest: startRequest,
        };

        function endRequest(httpMethod) {
            httpMethod = normalizedHttpMethod(httpMethod);
            pending.all--;
            pending[httpMethod]--;

            if (pending[httpMethod] < 0) {
                redistributePendingCounts(httpMethod);
            }
            console.log('pending: '+ pending.all)


        }

        function startRequest(httpMethod) {

            httpMethod = normalizedHttpMethod(httpMethod);
            total.all++;
            total[httpMethod]++;
            pending.all++;
            pending[httpMethod]++;

        }

        function normalizedHttpMethod(httpMethod) {
            httpMethod = (httpMethod || "").toLowerCase();
            switch (httpMethod) {
                case "get":
                case "post":
                case "delete":
                case "put":
                case "head":
                    return (httpMethod);
                    
            }
            return ("get");
        }

        function redistributePendingCounts(negativeMethod) {
            var overflow = Math.abs(pending[negativeMethod]);
            pending[negativeMethod] = 0;

            var methods = ["get", "post", "delete", "put", "head"];

            for (var i = 0; i < methods.length; i++) {
                var method = methods[i];
                if (overflow && pending[method]) {
                    pending[method] -= overflow;
                    if (pending[method] < 0) {
                        overflow = Math.abs(pending[method]);
                        pending[method] = 0;
                    } else {
                        overflow = 0;
                    }
                }
            }
        }
    }
);

app.service('interceptHttp', ['$q', 'trafficCop', function($q, trafficCop) {
    var extractMethod = function(response) {
        try {
            return (response.config.method);
        } catch (error) {
            return ("get");
        }
    };
    return {
        request: function(config) {
            trafficCop.startRequest(config.method);
            return (config);
        },
        requestError: function(rejection) {
            trafficCop.startRequest("get");
            return ($q.reject(rejection));
        },
        response: function(response) {
            trafficCop.endRequest(extractMethod(response));
            return (response);
        },
        responseError: function(response) {
            trafficCop.endRequest(extractMethod(response));
            return ($q.reject(response));
        }
    };
}]);

app.service('sceTrustHtml', ['$sce', function($sce) {
    return {
        checkText: function(data) {
            return $sce.trustAsHtml(data);
        }
    };
}]);

app.factory('onlineStatus', ['$sce', '$window', function($sce, $window) {

    return {
        checkStatus: function() {
            return $window.navigator.onLine;
        }
    };
}]);

app.factory('mainCategory', ["$http", "GLOBALS", "authService", "$q", function($http, GLOBALS, authService, $q) {
    var factory = {};
    var deferred = $q.defer();

    factory.getMainCategory = function() {
        $http({
                url: GLOBALS.API_URL1 + 'get_main_category?',
                method: 'GET',
                cache: false,
                params: '',
                headers: {}
            })
            .then(function(success) {
                deferred.resolve(success.data.data);
            }, function(error) {});
        return deferred.promise;
    };

    return factory;
}]);

app.factory('errorMsgFactory', ["$http", "GLOBALS", "authService", "$q", function($http, GLOBALS, authService, $q) {
    var factory = {};
    var deferred = $q.defer();

    factory.getErrorMessage = function(error, fieldname) {
        var message;

        if (angular.isDefined(error)) {
            if (error.required) {

                if (fieldname == "phonenumber") {
                    message = "Enter phone number";
                } else if (fieldname == "guys") {
                    message = "Enter total guys number";
                } else if (fieldname == "girls") {
                    message = "Enter total girls number";
                } else if (fieldname == "guest") {
                    message = "Enter total guest number";
                } else if (fieldname == "date") {
                    message = "Choose reservation date";
                } else if (fieldname == "email") {
                    message = "Enter Email";
                } else if (fieldname == "fname") {
                    message = "Enter First Name";
                } else if (fieldname == "lname") {
                    message = "Enter Last Name";
                } else if (fieldname == "password") {
                    message = "Enter Password";
                } else if (fieldname == "confirmpassword") {
                    message = "Enter Confirm Password";
                } else if (fieldname == "oldpassword") {
                    message = "Enter Old Password";
                } else if (fieldname == "newpassword") {
                    message = "Enter New Password";
                } else if (fieldname == "occassion") {
                    message = "Enter Occassion";
                } else if (fieldname == "pickup") {
                    message = "Select Pickup Location";
                } else if (fieldname == "pickuptime") {
                    message = "Select Pickup Time";
                } else if (fieldname == "dropoff") {
                    message = "Select DropOff Location";
                } else if (fieldname == "address") {
                    message = "Enter Address";
                } else if (fieldname == "state") {
                    message = "Select State";
                } else if (fieldname == "country") {
                    message = "Select Country";
                } else if (fieldname == "cardNo") {
                    message = "Enter Credit Card No";
                } else if (fieldname == "expiryDate") {
                    message = "Enter Expiry Date";
                } else if (fieldname == "cvv") {
                    message = "Enter CVV";
                } else if (fieldname == "zip") {
                    message = "Enter Zip Code";
                } else if (fieldname == "month") {
                    message = "Select Expiry Month";
                } else if (fieldname == "year") {
                    message = "Select Expiry Year";
                } else if (fieldname == "city") {
                    message = "Enter City";
                }
            } else if (error.pattern) {
                if (fieldname == "phonenumber") {
                    message = "Invalid phone number";
                } else if (fieldname == "age") {
                    message = "Please enter proper Age";
                } else if (fieldname == "email") {
                    message = "Invalid email address";
                }

            } else if (error.maxlength) {
                if (fieldname == "phonenumber") {
                    message = "Invalid phone number";
                } else if (fieldname == "cvv") {
                    message = "Invalid CVV number";
                } else if (fieldname == "cardNo") {
                    message = "Invalid Credit Card number";
                } else {
                    message = "Please enter a valid number";
                }

            } else if (error.minlength) {
                if (fieldname == "phonenumber") {
                    message = "Enter minimum 10 digits";
                } else if (fieldname == "cvv") {
                    message = "Enter minimum 3 digit";
                } else if (fieldname == "cardNo") {
                    message = "Enter minimum 16 digit";
                } else if (fieldname == "password" || fieldname == "oldpassword" || fieldname == "newpassword") {
                    message = "Password should be minimum of 4 length";
                }


            } else if (error.email) {
                message = "Invalid email address";
            } else if (error.number) {
                message = "Only Digits are Allowed";
            }
        }
        return message;
    };
    return factory;
}]);
var app = angular.module('authenticationServices', []);
app.service('authService', ['$cookies', '$cookieStore', '$http', '$state', function($cookies, $cookieStore, $http, $state) {
    var authService = {};
    authService.isAuthenticated = function() {
        //console.log(authService.authToken)
        var authToken = $cookieStore.get('AuthToken');
        authService.authToken = authToken ? authToken : '';
        return authService.authToken;
    };
    authService.setAuthToken = function(token) {
        $cookieStore.put('AuthToken', "ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    };
    authService.clearAuthentication = function() {
        $cookieStore.remove('AuthToken');
    };
    authService.clearAuthenticationBack = function(err) {
        if (err == 401) {
            $cookieStore.remove('AuthToken');
            //$state.go('login');
            //window.location = settings.url + '/login';
        }
    };
    return authService;
}]);
var app = angular.module('commonDirectives', []);
app.directive('pageTitle', ['$rootScope', '$timeout', function($rootScope, $timeout){

//coommon directive
	return {
    link: function(scope, element) {
      var listener = function(event, toState, toParams, fromState, fromParams) {
        // Default title - load on Dashboard 1
        var title = 'Project Name';
        // Create your own title pattern
        if (toState.data.pageTitle) {title = toState.data.pageTitle;}
        $timeout(function() {
          element.text(title);
        });
      };
      $rootScope.$on('$stateChangeStart', listener);
    }
  };
}]);

var app = angular.module('MainController',['ngCookies','defaultServices']);

app.controller('MainController', ['$scope', '$rootScope','$cookies','$cookieStore','$state','authService','resourceService','$http', function($scope, $rootScope,$cookies,$cookieStore,$state,authService,resourceService,$http) {
	$scope.signout = function() {
		authService.clearAuthentication();
		$state.go('login');
	};


	$http({
		method: 'GET',
		url: ''
	}).then(function successCallback(response) {
		//console.log(response)
		
	    // when the response is available
	}, function errorCallback(response) {
	    // called asynchronously if an error occurs
	    // or server returns response with an error status.
	});


}]);
var app = angular.module('route',[
		'admin.route',
		'user.route'
	]);

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
var app = angular.module('user.api.services',[]);
app.service('userApiService', ['$cookies', '$cookieStore', '$http', '$state', function($cookies, $cookieStore, $http, $state) {
    var userApiService = {};
    userApiService.GetAllCountry = function() {        
        return $http({
            url: 'http://php54.indianic.com/vegas_venues/webservice/get_night_club_listing?&search_nightclub=&page_index=1',
            method: 'POST',
            data: $.param({

            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    };
    return userApiService;
}]);
var ModuleName = 'DEMO';
var App = angular.module(ModuleName, [
    "ui.router",
    "route",
    "ngCookies",
    "oc.lazyLoad",
    "ngSanitize",
    "LocalStorageModule",
    "ui.bootstrap",
    "ngMaterial",
    "ngAnimate",
    "constants",
    "commonDirectives",
    "defaultServices",
    "MainController" ,
    "authenticationServices",
    "user.api.services"
    ]);

App.run(['$rootScope', '$state', '$stateParams', '$cookieStore', '$cookies', 'authService',
    function($rootScope, $state, $stateParams, $cookieStore, $cookies, authService) {
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            if (toState.name.indexOf('main') > -1 && authService.isAuthenticated() == '') {
                event.preventDefault();
                $state.go('login');
                return;
            } else if (toState.name == 'main' && authService.isAuthenticated() != '') {
                event.preventDefault();
                $state.go('main.home');
                return;
            } else if (toState.name.indexOf('login') > -1 && authService.isAuthenticated() != '') {
                event.preventDefault();
                $state.go('main.home');
                return;
            }
        });
    }
    ]);


App.config(['$controllerProvider', function($controllerProvider) {
    // this option might be handy for migrating old apps, but please don't use it
    // in new ones!
    $controllerProvider.allowGlobals();
}]);


App.config(['$stateProvider', '$urlRouterProvider', '$locationProvider','$httpProvider','GLOBALS','SETTINGS', function($stateProvider, $urlRouterProvider, $locationProvider,$httpProvider,GLOBALS,SETTINGS) {

    console.log('path: '+SETTINGS[GLOBALS.ENV].siteUrl)
    $urlRouterProvider.otherwise( function($injector, $location) {
        var $state = $injector.get('$state');
        var Storage = $injector.get('authService');
        if (Storage.isAuthenticated()) {
            $state.go('main.home');
        }
        else {
            $state.go('login');
        }
    });
    if (history.pushState) {
        $locationProvider.hashPrefix('!');
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: true
        });
    } else {        
        $locationProvider.hashPrefix('!');
        $locationProvider.html5Mode({
            enabled: false,
            requireBase: false
        });
    }
    $httpProvider.interceptors.push('interceptHttp');
}]);



/* Init global settings and run the app */
App.run(["$rootScope", "$state","trafficCop", function($rootScope, $state, trafficCop) {
    $rootScope.$state = $state; // state to be accessed from view 
    $rootScope.trafficCop = trafficCop; 
    
    
   
}]);

angular.element(document).ready(function() {
  angular.bootstrap(document, [ModuleName]);
});

function setMetaData($scope, $rootScope, MetaInformation, seo) {
    if (typeof seo != "undefined") {
        if (typeof seo.seo_title != "undefined") {
            MetaInformation.setMetaTitle(seo.seo_title);
        }
        if (typeof seo.seo_description != "undefined") {
            MetaInformation.setMetaDescription(seo.seo_description)
        }
        if (typeof seo.seo_keywords != "undefined") {
            MetaInformation.setMetaKeyword(seo.seo_keywords)
        }
        $rootScope.metaData = MetaInformation;
    }
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbmZpZ3MuanMiLCJkZWZhdWx0U2VydmljZXMuanMiLCJhdXRoZW50aWNhdGlvblNlcnZpY2VzLmpzIiwiY29tbW9uRGlyZWN0aXZlcy5qcyIsIk1haW5Db250cm9sbGVyLmpzIiwicm91dGUuanMiLCJ1c2VyLnJvdXRlLmpzIiwiYWRtaW4ucm91dGUuanMiLCJ1c2VyLmFwaS5zZXJ2aWNlcy5qcyIsImFwcC5qcyJdLCJuYW1lcyI6WyJzZXRNZXRhRGF0YSIsIiRzY29wZSIsIiRyb290U2NvcGUiLCJNZXRhSW5mb3JtYXRpb24iLCJzZW8iLCJzZW9fdGl0bGUiLCJzZXRNZXRhVGl0bGUiLCJzZW9fZGVzY3JpcHRpb24iLCJzZXRNZXRhRGVzY3JpcHRpb24iLCJzZW9fa2V5d29yZHMiLCJzZXRNZXRhS2V5d29yZCIsIm1ldGFEYXRhIiwiYXBwIiwiYW5ndWxhciIsIm1vZHVsZSIsImNvbnN0YW50IiwiU0lURV9VUkwiLCJFTlYiLCJERVYiLCJhcGlVcmwiLCJzaXRlVXJsIiwiU1RBR0lORyIsIlBST0RVQ1RJT04iLCJmYWN0b3J5IiwiZW5jb2RlIiwiYXJyYXkiLCJyIiwiaSIsImVuY29kZVVSSUNvbXBvbmVudCIsInNsaWNlIiwic2VyaWFsaXplIiwib2JqIiwicHJlZml4Iiwic3RyIiwicCIsImhhc093blByb3BlcnR5IiwiXyIsImlzQXJyYXkiLCJlYWNoIiwiYXJyYXlEYXRhIiwiaXNPYmplY3QiLCJwdXNoIiwiSlNPTiIsInN0cmluZ2lmeSIsImlzTnVsbCIsImlzVW5kZWZpbmVkIiwiam9pbiIsIiR3aW5kb3ciLCJ1YU1hdGNoIiwidWEiLCJ0b0xvd2VyQ2FzZSIsIm1hdGNoIiwiZXhlYyIsImluZGV4T2YiLCJicm93c2VyIiwidmVyc2lvbiIsIm1hdGNoZWQiLCJuYXZpZ2F0b3IiLCJ1c2VyQWdlbnQiLCJjaHJvbWUiLCJ3ZWJraXQiLCJzYWZhcmkiLCIkcSIsImJyb3dzZXJTZXJ2aWNlIiwiZW5jb2RlVVJMIiwicmVxdWVzdCIsImNvbmZpZyIsInVybCIsInNlYXJjaCIsIm1zaWUiLCJtZXRob2QiLCJxdWVyeXN0cmluZyIsInBhcmFtcyIsImVuY29kZWR1cmwiLCJyZXF1ZXN0RXJyb3IiLCJyZWplY3Rpb24iLCJyZWplY3QiLCJyZXNwb25zZSIsInJlc3BvbnNlRXJyb3IiLCJwcm94aWZ5IiwibWV0YURlc2NyaXB0aW9uIiwibWV0YUtleXdvcmQiLCJtZXRhVGl0bGUiLCJyZXNldCIsIm5ld01ldGFUaXRsZSIsIm5ld01ldGFEZXNjcmlwdGlvbiIsIm5ld0tleXdvcmQiLCJzZXJ2aWNlIiwiJGNvb2tpZXMiLCIkY29va2llU3RvcmUiLCIkaHR0cCIsIiRzdGF0ZSIsInJlc291cmNlVXJsIiwicmVzb3VyY2VTZXJ2aWNlIiwiR2V0QWxsQ291bnRyeSIsImRhdGEiLCIkIiwicGFyYW0iLCJoZWFkZXJzIiwiQ29udGVudC1UeXBlIiwiZW5kUmVxdWVzdCIsImh0dHBNZXRob2QiLCJub3JtYWxpemVkSHR0cE1ldGhvZCIsInBlbmRpbmciLCJhbGwiLCJyZWRpc3RyaWJ1dGVQZW5kaW5nQ291bnRzIiwiY29uc29sZSIsImxvZyIsInN0YXJ0UmVxdWVzdCIsInRvdGFsIiwibmVnYXRpdmVNZXRob2QiLCJvdmVyZmxvdyIsIk1hdGgiLCJhYnMiLCJtZXRob2RzIiwibGVuZ3RoIiwiZ2V0IiwicG9zdCIsImRlbGV0ZSIsInB1dCIsImhlYWQiLCJ0cmFmZmljQ29wIiwiZXh0cmFjdE1ldGhvZCIsImVycm9yIiwiJHNjZSIsImNoZWNrVGV4dCIsInRydXN0QXNIdG1sIiwiY2hlY2tTdGF0dXMiLCJvbkxpbmUiLCJHTE9CQUxTIiwiYXV0aFNlcnZpY2UiLCJkZWZlcnJlZCIsImRlZmVyIiwiZ2V0TWFpbkNhdGVnb3J5IiwiQVBJX1VSTDEiLCJjYWNoZSIsInRoZW4iLCJzdWNjZXNzIiwicmVzb2x2ZSIsInByb21pc2UiLCJnZXRFcnJvck1lc3NhZ2UiLCJmaWVsZG5hbWUiLCJtZXNzYWdlIiwiaXNEZWZpbmVkIiwicmVxdWlyZWQiLCJwYXR0ZXJuIiwibWF4bGVuZ3RoIiwibWlubGVuZ3RoIiwiZW1haWwiLCJudW1iZXIiLCJpc0F1dGhlbnRpY2F0ZWQiLCJhdXRoVG9rZW4iLCJzZXRBdXRoVG9rZW4iLCJ0b2tlbiIsImNsZWFyQXV0aGVudGljYXRpb24iLCJyZW1vdmUiLCJjbGVhckF1dGhlbnRpY2F0aW9uQmFjayIsImVyciIsImRpcmVjdGl2ZSIsIiR0aW1lb3V0IiwibGluayIsInNjb3BlIiwiZWxlbWVudCIsImxpc3RlbmVyIiwiZXZlbnQiLCJ0b1N0YXRlIiwidG9QYXJhbXMiLCJmcm9tU3RhdGUiLCJmcm9tUGFyYW1zIiwidGl0bGUiLCJwYWdlVGl0bGUiLCJ0ZXh0IiwiJG9uIiwiY29udHJvbGxlciIsInNpZ25vdXQiLCJnbyIsIk1vZHVsZU5hbWUiLCIkc3RhdGVQcm92aWRlciIsIiR1cmxSb3V0ZXJQcm92aWRlciIsIiRsb2NhdGlvblByb3ZpZGVyIiwiJGh0dHBQcm92aWRlciIsIlNFVFRJTkdTIiwic3RhdGUiLCJ2aWV3cyIsImhvbWUiLCJ0ZW1wbGF0ZVVybCIsImRlcHMiLCIkb2NMYXp5TG9hZCIsImxvYWQiLCJuYW1lIiwiaW5zZXJ0QmVmb3JlIiwiZmlsZXMiLCJ1c2VyIiwidXNlckFwaVNlcnZpY2UiLCJ1c2VyMSIsInVzZXIyIiwibWFpbiIsIkFwcCIsInJ1biIsIiRzdGF0ZVBhcmFtcyIsInByZXZlbnREZWZhdWx0IiwiJGNvbnRyb2xsZXJQcm92aWRlciIsImFsbG93R2xvYmFscyIsIm90aGVyd2lzZSIsIiRpbmplY3RvciIsIiRsb2NhdGlvbiIsIlN0b3JhZ2UiLCJoaXN0b3J5IiwicHVzaFN0YXRlIiwiaGFzaFByZWZpeCIsImh0bWw1TW9kZSIsImVuYWJsZWQiLCJyZXF1aXJlQmFzZSIsImludGVyY2VwdG9ycyIsImRvY3VtZW50IiwicmVhZHkiLCJib290c3RyYXAiXSwibWFwcGluZ3MiOiJBQTJGQSxRQUFBQSxhQUFBQyxFQUFBQyxFQUFBQyxFQUFBQyxHQUNBLG1CQUFBQSxLQUNBLG1CQUFBQSxHQUFBQyxXQUNBRixFQUFB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M0QsRUFBQW9CLG1CQUNBYyxFQUFBb0MscUJBQ0E3RyxHQUFBb0YsR0FBQSxjQUVBVixFQUFBd0IsS0FBQXhJLFFBQUEsVUFBQSxHQUFBLElBQUE2RSxFQUFBb0IsbUJBQ0FjLEVBQUFvQyxxQkFDQTdHLEdBQUFvRixHQUFBLGNBRkEsWUFVQXNCLElBQUFuSSxRQUFBLHNCQUFBLFNBQUF1SSxHQUdBQSxFQUFBQyxrQkFJQUwsSUFBQW5JLFFBQUEsaUJBQUEscUJBQUEsb0JBQUEsZ0JBQUEsVUFBQSxXQUFBLFNBQUErRyxFQUFBQyxFQUFBQyxFQUFBQyxFQUFBbkQsRUFBQW9ELEdBRUEzRSxRQUFBQyxJQUFBLFNBQUEwRSxFQUFBcEQsRUFBQWhILEtBQUFHLFNBQ0E4SixFQUFBeUIsVUFBQSxTQUFBQyxFQUFBQyxHQUNBLEdBQUFsSCxHQUFBaUgsRUFBQXhGLElBQUEsVUFDQTBGLEVBQUFGLEVBQUF4RixJQUFBLGNBQ0EwRixHQUFBeEQsa0JBQ0EzRCxFQUFBb0YsR0FBQSxhQUdBcEYsRUFBQW9GLEdBQUEsV0FHQWdDLFFBQUFDLFdBQ0E3QixFQUFBOEIsV0FBQSxLQUNBOUIsRUFBQStCLFdBQ0FDLFNBQUEsRUFDQUMsYUFBQSxNQUdBakMsRUFBQThCLFdBQUEsS0FDQTlCLEVBQUErQixXQUNBQyxTQUFBLEVBQ0FDLGFBQUEsS0FHQWhDLEVBQUFpQyxhQUFBNUssS0FBQSxvQkFNQTRKLElBQUFDLEtBQUEsYUFBQSxTQUFBLGFBQUEsU0FBQXBNLEVBQUF5RixFQUFBOEIsR0FDQXZILEVBQUF5RixPQUFBQSxFQUNBekYsRUFBQXVILFdBQUFBLEtBTUE1RyxRQUFBcUosUUFBQW9ELFVBQUFDLE1BQUEsV0FDQTFNLFFBQUEyTSxVQUFBRixVQUFBdEMiLCJmaWxlIjoiYXBwLmNvbW1vbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnY29uc3RhbnRzJywgW10pO1xuYXBwLmNvbnN0YW50KCdHTE9CQUxTJywge1xuICAgICAgICBTSVRFX1VSTDogXCIvU0VFRFBST0pFQ1RTL2FuZ3VsYXJTZWVkUHJvamVjdC12LTEuMy4xL1wiLFxuICAgICAgICBFTlY6IFwiREVWXCIgLypERVYsIFNUQUdJTkcsIFBST0RVQ1RJT04gKi9cbiAgICB9KTtcblxuXG4gYXBwLmNvbnN0YW50KCdTRVRUSU5HUycsIHtcbiAgICAgICAgREVWOiB7XG4gICAgICAgICAgICBcImFwaVVybFwiOiBcIlwiLFxuICAgICAgICAgICAgXCJzaXRlVXJsXCI6XCJzcmMvXCJcbiAgICAgICAgfSxcbiAgICAgICAgU1RBR0lORzoge1xuICAgICAgICAgICAgXCJhcGlVcmxcIjogXCJcIixcbiAgICAgICAgICAgXHRcInNpdGVVcmxcIjpcImJ1aWxkL1wiXG4gICAgICAgIH0sXG4gICAgICAgIFBST0RVQ1RJT046IHtcbiAgICAgICAgICAgIFwiYXBpVXJsXCI6IFwiXCIsXG4gICAgICAgICAgICBcInNpdGVVcmxcIjpcImJ1aWxkL1wiXG4gICAgICAgIH1cbiB9KTtcblxuIiwidmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdkZWZhdWx0U2VydmljZXMnLCBbXSk7XG5cbmFwcC5mYWN0b3J5KCdlbmNvZGVVUkwnLCBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBlbmNvZGU6IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgICAgICAgICB2YXIgciA9ICcnO1xuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBhcnJheSkge1xuICAgICAgICAgICAgICAgIHIgKz0gZW5jb2RlVVJJQ29tcG9uZW50KGkpICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KGFycmF5W2ldKSArICcmJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHIgPSByLnNsaWNlKDAsIC0xKTtcbiAgICAgICAgICAgIHJldHVybiByO1xuICAgICAgICB9LFxuICAgICAgICBzZXJpYWxpemU6IGZ1bmN0aW9uKG9iaiwgcHJlZml4KSB7XG4gICAgICAgICAgICB2YXIgc3RyID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIG9iaikge1xuICAgICAgICAgICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkocCkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKF8uaXNBcnJheShvYmpbcF0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfLmVhY2gob2JqW3BdLCBmdW5jdGlvbihhcnJheURhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoXy5pc09iamVjdChhcnJheURhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ci5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChwKSArIFwiJTNEXCIgKyBlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoYXJyYXlEYXRhKSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ci5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChwKSArIFwiJTNEXCIgKyBlbmNvZGVVUklDb21wb25lbnQoYXJyYXlEYXRhKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXy5pc09iamVjdChvYmpbcF0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHIucHVzaChlbmNvZGVVUklDb21wb25lbnQocCkgKyBcIiUzRFwiICsgZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KG9ialtwXSkpKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChfLmlzTnVsbChvYmpbcF0pIHx8IF8uaXNVbmRlZmluZWQob2JqW3BdKSkge1xuXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHIucHVzaChlbmNvZGVVUklDb21wb25lbnQocCkgKyBcIiUzRFwiICsgZW5jb2RlVVJJQ29tcG9uZW50KG9ialtwXSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHN0ci5qb2luKFwiJTI2XCIpO1xuICAgICAgICB9XG4gICAgfTtcbn0pO1xuXG5hcHAuZmFjdG9yeSgnYnJvd3NlclNlcnZpY2UnLCBbXCIkd2luZG93XCIsIGZ1bmN0aW9uKCR3aW5kb3cpIHtcbiAgICB2YXIgdWFNYXRjaCA9IGZ1bmN0aW9uKHVhKSB7XG4gICAgICAgIHVhID0gdWEudG9Mb3dlckNhc2UoKTtcblxuICAgICAgICB2YXIgbWF0Y2ggPSAvKGNocm9tZSlbIFxcL10oW1xcdy5dKykvLmV4ZWModWEpIHx8XG4gICAgICAgICAgICAvKHdlYmtpdClbIFxcL10oW1xcdy5dKykvLmV4ZWModWEpIHx8XG4gICAgICAgICAgICAvKG9wZXJhKSg/Oi4qdmVyc2lvbnwpWyBcXC9dKFtcXHcuXSspLy5leGVjKHVhKSB8fFxuICAgICAgICAgICAgLyhtc2llKSAoW1xcdy5dKykvLmV4ZWModWEpIHx8XG4gICAgICAgICAgICB1YS5pbmRleE9mKFwiY29tcGF0aWJsZVwiKSA8IDAgJiYgLyhtb3ppbGxhKSg/Oi4qPyBydjooW1xcdy5dKyl8KS8uZXhlYyh1YSkgfHwgW107XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGJyb3dzZXI6IG1hdGNoWzFdIHx8IFwiXCIsXG4gICAgICAgICAgICB2ZXJzaW9uOiBtYXRjaFsyXSB8fCBcIjBcIlxuICAgICAgICB9O1xuICAgIH07XG4gICAgdmFyIG1hdGNoZWQgPSB1YU1hdGNoKCR3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCk7XG4gICAgdmFyIGJyb3dzZXIgPSB7fTtcblxuICAgIGlmIChtYXRjaGVkLmJyb3dzZXIpIHtcbiAgICAgICAgYnJvd3NlclttYXRjaGVkLmJyb3dzZXJdID0gdHJ1ZTtcbiAgICAgICAgYnJvd3Nlci52ZXJzaW9uID0gbWF0Y2hlZC52ZXJzaW9uO1xuICAgIH1cblxuICAgIC8vIENocm9tZSBpcyBXZWJraXQsIGJ1dCBXZWJraXQgaXMgYWxzbyBTYWZhcmkuXG4gICAgaWYgKGJyb3dzZXIuY2hyb21lKSB7XG4gICAgICAgIGJyb3dzZXIud2Via2l0ID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKGJyb3dzZXIud2Via2l0KSB7XG4gICAgICAgIGJyb3dzZXIuc2FmYXJpID0gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gYnJvd3Nlcjtcbn1dKTtcblxuYXBwLmZhY3RvcnkoJ3Jlc291cmNlaW50ZXJjZXB0b3InLCBbXCIkcVwiLCBcImJyb3dzZXJTZXJ2aWNlXCIsIFwiZW5jb2RlVVJMXCIsIGZ1bmN0aW9uKCRxLCBicm93c2VyU2VydmljZSwgZW5jb2RlVVJMKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgLy8gb3B0aW9uYWwgbWV0aG9kXG4gICAgICAgICdyZXF1ZXN0JzogZnVuY3Rpb24oY29uZmlnKSB7XG4gICAgICAgICAgICAvLyBkbyBzb21ldGhpbmcgb24gc3VjY2Vzc1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhjb25maWcpXG4gICAgICAgICAgICBpZiAoY29uZmlnLnVybC5zZWFyY2goJ3BocDU0LmluZGlhbmljLmNvbS9oZWFsdGhjYXJlaXEvYXBpJykgIT0gLTEpIHtcbiAgICAgICAgICAgICAgICBpZiAoYnJvd3NlclNlcnZpY2UubXNpZSAmJiBicm93c2VyU2VydmljZS52ZXJzaW9uID09PSAnOS4wJyB8fCBicm93c2VyU2VydmljZS52ZXJzaW9uID09PSAnOC4wJyAmJiBjb25maWcubWV0aG9kID09IFwiR0VUXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHF1ZXJ5c3RyaW5nID0gZW5jb2RlVVJMLnNlcmlhbGl6ZShjb25maWcucGFyYW1zKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVuY29kZWR1cmwgPSAnX3F1YW50dW1fcHJveHkucGhwP3E9JyArIGVuY29kZVVSSUNvbXBvbmVudChjb25maWcudXJsKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHF1ZXJ5c3RyaW5nICE9PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbmNvZGVkdXJsICs9IFwiJTNGXCIgKyBxdWVyeXN0cmluZztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb25maWcucGFyYW1zID0ge307XG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZy51cmwgPSBlbmNvZGVkdXJsO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYnJvd3NlclNlcnZpY2UubXNpZSAmJiBicm93c2VyU2VydmljZS52ZXJzaW9uID09PSAnOS4wJyB8fCBicm93c2VyU2VydmljZS52ZXJzaW9uID09PSAnOC4wJyAmJiBjb25maWcubWV0aG9kICE9IFwiUE9TVFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlbmNvZGVkdXJsID0gJ19xdWFudHVtX3Byb3h5LnBocD9xPScgKyBlbmNvZGVVUklDb21wb25lbnQoY29uZmlnLnVybCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZy51cmwgPSBlbmNvZGVkdXJsO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYnJvd3NlclNlcnZpY2UubXNpZSAmJiBicm93c2VyU2VydmljZS52ZXJzaW9uID09PSAnOS4wJyB8fCBicm93c2VyU2VydmljZS52ZXJzaW9uID09PSAnOC4wJyAmJiBjb25maWcubWV0aG9kICE9IFwiUFVUXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVuY29kZWR1cmwgPSAnX3F1YW50dW1fcHJveHkucGhwP3E9JyArIGVuY29kZVVSSUNvbXBvbmVudChjb25maWcudXJsKTtcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnLnVybCA9IGVuY29kZWR1cmw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGNvbmZpZztcbiAgICAgICAgfSxcbiAgICAgICAgLy8gb3B0aW9uYWwgbWV0aG9kXG4gICAgICAgICdyZXF1ZXN0RXJyb3InOiBmdW5jdGlvbihyZWplY3Rpb24pIHtcbiAgICAgICAgICAgIC8vIGRvIHNvbWV0aGluZyBvbiBlcnJvclxuXG4gICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KHJlamVjdGlvbik7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIG9wdGlvbmFsIG1ldGhvZFxuICAgICAgICAncmVzcG9uc2UnOiBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgLy8gZG8gc29tZXRoaW5nIG9uIHN1Y2Nlc3NcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gb3B0aW9uYWwgbWV0aG9kXG4gICAgICAgICdyZXNwb25zZUVycm9yJzogZnVuY3Rpb24ocmVqZWN0aW9uKSB7XG4gICAgICAgICAgICAvLyBkbyBzb21ldGhpbmcgb24gZXJyb3JcbiAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QocmVqZWN0aW9uKTtcbiAgICAgICAgfVxuICAgIH07XG59XSk7XG5cbmFwcC5mYWN0b3J5KCdyZXNvdXJjZVVybCcsIFtcImJyb3dzZXJTZXJ2aWNlXCIsIGZ1bmN0aW9uKGJyb3dzZXJTZXJ2aWNlKSB7XG4gICAgcmV0dXJuIHtcblxuICAgICAgICBwcm94aWZ5OiBmdW5jdGlvbih1cmwpIHtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICByZXR1cm4gKGJyb3dzZXJTZXJ2aWNlLm1zaWUgJiYgYnJvd3NlclNlcnZpY2UudmVyc2lvbiA9PT0gJzkuMCcgfHwgYnJvd3NlclNlcnZpY2UudmVyc2lvbiA9PT0gJzguMCcgKVxuICAgICAgICAgICAgcmV0dXJuICh0cnVlKSA/ICdfcXVhbnR1bV9wcm94eS5waHA/cT0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHVybCkgOiB1cmw7XG4gICAgICAgIH1cbiAgICB9O1xufV0pO1xuXG5hcHAuZmFjdG9yeSgnTWV0YUluZm9ybWF0aW9uJywgW2Z1bmN0aW9uKCkge1xuICAgIHZhciBtZXRhRGVzY3JpcHRpb24gPSAnJztcbiAgICB2YXIgbWV0YUtleXdvcmQgPSAnJztcbiAgICB2YXIgbWV0YVRpdGxlID0gJyc7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgbWV0YURlc2NyaXB0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBtZXRhRGVzY3JpcHRpb247XG4gICAgICAgIH0sXG4gICAgICAgIG1ldGFLZXl3b3JkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBtZXRhS2V5d29yZDtcbiAgICAgICAgfSxcbiAgICAgICAgbWV0YVRpdGxlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBtZXRhVGl0bGU7XG4gICAgICAgIH0sXG4gICAgICAgIHJlc2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIG1ldGFEZXNjcmlwdGlvbiA9ICcnO1xuICAgICAgICAgICAgbWV0YUtleXdvcmQgPSAnJztcbiAgICAgICAgICAgIG1ldGFUaXRsZSA9ICcnO1xuICAgICAgICB9LFxuICAgICAgICBzZXRNZXRhVGl0bGU6IGZ1bmN0aW9uKG5ld01ldGFUaXRsZSkge1xuICAgICAgICAgICAgbWV0YVRpdGxlID0gbmV3TWV0YVRpdGxlO1xuICAgICAgICB9LFxuICAgICAgICBzZXRNZXRhRGVzY3JpcHRpb246IGZ1bmN0aW9uKG5ld01ldGFEZXNjcmlwdGlvbikge1xuICAgICAgICAgICAgbWV0YURlc2NyaXB0aW9uID0gbmV3TWV0YURlc2NyaXB0aW9uO1xuICAgICAgICB9LFxuICAgICAgICBzZXRNZXRhS2V5d29yZDogZnVuY3Rpb24obmV3S2V5d29yZCkge1xuICAgICAgICAgICAgbWV0YUtleXdvcmQgPSBuZXdLZXl3b3JkO1xuXG4gICAgICAgIH1cbiAgICB9O1xufV0pO1xuXG5hcHAuc2VydmljZSgncmVzb3VyY2VTZXJ2aWNlJywgWyckY29va2llcycsICckY29va2llU3RvcmUnLCAnJGh0dHAnLCAnJHN0YXRlJywgJ3Jlc291cmNlVXJsJywgJ2Jyb3dzZXJTZXJ2aWNlJywgZnVuY3Rpb24oJGNvb2tpZXMsICRjb29raWVTdG9yZSwgJGh0dHAsICRzdGF0ZSwgcmVzb3VyY2VVcmwsIGJyb3dzZXJTZXJ2aWNlKSB7XG4gICAgdmFyIHJlc291cmNlU2VydmljZSA9IHt9O1xuICAgIHJlc291cmNlU2VydmljZS5HZXRBbGxDb3VudHJ5ID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgXG4gICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgICB1cmw6ICdodHRwOi8vcGhwNTQuaW5kaWFuaWMuY29tL3ZlZ2FzX3ZlbnVlcy93ZWJzZXJ2aWNlL2dldF9uaWdodF9jbHViX2xpc3Rpbmc/JnNlYXJjaF9uaWdodGNsdWI9JnBhZ2VfaW5kZXg9MScsXG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgIGRhdGE6ICQucGFyYW0oe1xuXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICByZXR1cm4gcmVzb3VyY2VTZXJ2aWNlO1xufV0pO1xuXG4vLyBhcHAuZmFjdG9yeSgnWG1sVG9Kc29uJywgW2Z1bmN0aW9uKCkge1xuLy8gICAgIHZhciB4MmpzID0gbmV3IFgySlMoKTtcbi8vICAgICByZXR1cm4ge1xuLy8gICAgICAgICB0b0pTT046IGZ1bmN0aW9uKHhtbCkge1xuLy8gICAgICAgICAgICAgcmV0dXJuIHgyanMueG1sX3N0cjJqc29uKHhtbCk7XG4vLyAgICAgICAgIH1cbi8vICAgICB9O1xuLy8gfV0pO1xuXG5hcHAuc2VydmljZShcbiAgICBcInRyYWZmaWNDb3BcIixcbiAgICBmdW5jdGlvbiBzZXR1cFNlcnZpY2UoKSB7XG4gICAgICAgIHZhciB0b3RhbCA9IHtcbiAgICAgICAgICAgIGFsbDogMCxcbiAgICAgICAgICAgIGdldDogMCxcbiAgICAgICAgICAgIHBvc3Q6IDAsXG4gICAgICAgICAgICBkZWxldGU6IDAsXG4gICAgICAgICAgICBwdXQ6IDAsXG4gICAgICAgICAgICBoZWFkOiAwXG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIHBlbmRpbmcgPSB7XG4gICAgICAgICAgICBhbGw6IDAsXG4gICAgICAgICAgICBnZXQ6IDAsXG4gICAgICAgICAgICBwb3N0OiAwLFxuICAgICAgICAgICAgZGVsZXRlOiAwLFxuICAgICAgICAgICAgcHV0OiAwLFxuICAgICAgICAgICAgaGVhZDogMFxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBwZW5kaW5nOiBwZW5kaW5nLFxuICAgICAgICAgICAgdG90YWw6IHRvdGFsLFxuICAgICAgICAgICAgZW5kUmVxdWVzdDogZW5kUmVxdWVzdCxcbiAgICAgICAgICAgIHN0YXJ0UmVxdWVzdDogc3RhcnRSZXF1ZXN0LFxuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIGVuZFJlcXVlc3QoaHR0cE1ldGhvZCkge1xuICAgICAgICAgICAgaHR0cE1ldGhvZCA9IG5vcm1hbGl6ZWRIdHRwTWV0aG9kKGh0dHBNZXRob2QpO1xuICAgICAgICAgICAgcGVuZGluZy5hbGwtLTtcbiAgICAgICAgICAgIHBlbmRpbmdbaHR0cE1ldGhvZF0tLTtcblxuICAgICAgICAgICAgaWYgKHBlbmRpbmdbaHR0cE1ldGhvZF0gPCAwKSB7XG4gICAgICAgICAgICAgICAgcmVkaXN0cmlidXRlUGVuZGluZ0NvdW50cyhodHRwTWV0aG9kKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdwZW5kaW5nOiAnKyBwZW5kaW5nLmFsbClcblxuXG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzdGFydFJlcXVlc3QoaHR0cE1ldGhvZCkge1xuXG4gICAgICAgICAgICBodHRwTWV0aG9kID0gbm9ybWFsaXplZEh0dHBNZXRob2QoaHR0cE1ldGhvZCk7XG4gICAgICAgICAgICB0b3RhbC5hbGwrKztcbiAgICAgICAgICAgIHRvdGFsW2h0dHBNZXRob2RdKys7XG4gICAgICAgICAgICBwZW5kaW5nLmFsbCsrO1xuICAgICAgICAgICAgcGVuZGluZ1todHRwTWV0aG9kXSsrO1xuXG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBub3JtYWxpemVkSHR0cE1ldGhvZChodHRwTWV0aG9kKSB7XG4gICAgICAgICAgICBodHRwTWV0aG9kID0gKGh0dHBNZXRob2QgfHwgXCJcIikudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIHN3aXRjaCAoaHR0cE1ldGhvZCkge1xuICAgICAgICAgICAgICAgIGNhc2UgXCJnZXRcIjpcbiAgICAgICAgICAgICAgICBjYXNlIFwicG9zdFwiOlxuICAgICAgICAgICAgICAgIGNhc2UgXCJkZWxldGVcIjpcbiAgICAgICAgICAgICAgICBjYXNlIFwicHV0XCI6XG4gICAgICAgICAgICAgICAgY2FzZSBcImhlYWRcIjpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChodHRwTWV0aG9kKTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gKFwiZ2V0XCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcmVkaXN0cmlidXRlUGVuZGluZ0NvdW50cyhuZWdhdGl2ZU1ldGhvZCkge1xuICAgICAgICAgICAgdmFyIG92ZXJmbG93ID0gTWF0aC5hYnMocGVuZGluZ1tuZWdhdGl2ZU1ldGhvZF0pO1xuICAgICAgICAgICAgcGVuZGluZ1tuZWdhdGl2ZU1ldGhvZF0gPSAwO1xuXG4gICAgICAgICAgICB2YXIgbWV0aG9kcyA9IFtcImdldFwiLCBcInBvc3RcIiwgXCJkZWxldGVcIiwgXCJwdXRcIiwgXCJoZWFkXCJdO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1ldGhvZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgbWV0aG9kID0gbWV0aG9kc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAob3ZlcmZsb3cgJiYgcGVuZGluZ1ttZXRob2RdKSB7XG4gICAgICAgICAgICAgICAgICAgIHBlbmRpbmdbbWV0aG9kXSAtPSBvdmVyZmxvdztcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBlbmRpbmdbbWV0aG9kXSA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG92ZXJmbG93ID0gTWF0aC5hYnMocGVuZGluZ1ttZXRob2RdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBlbmRpbmdbbWV0aG9kXSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvdmVyZmxvdyA9IDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4pO1xuXG5hcHAuc2VydmljZSgnaW50ZXJjZXB0SHR0cCcsIFsnJHEnLCAndHJhZmZpY0NvcCcsIGZ1bmN0aW9uKCRxLCB0cmFmZmljQ29wKSB7XG4gICAgdmFyIGV4dHJhY3RNZXRob2QgPSBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIChyZXNwb25zZS5jb25maWcubWV0aG9kKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiAoXCJnZXRcIik7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlcXVlc3Q6IGZ1bmN0aW9uKGNvbmZpZykge1xuICAgICAgICAgICAgdHJhZmZpY0NvcC5zdGFydFJlcXVlc3QoY29uZmlnLm1ldGhvZCk7XG4gICAgICAgICAgICByZXR1cm4gKGNvbmZpZyk7XG4gICAgICAgIH0sXG4gICAgICAgIHJlcXVlc3RFcnJvcjogZnVuY3Rpb24ocmVqZWN0aW9uKSB7XG4gICAgICAgICAgICB0cmFmZmljQ29wLnN0YXJ0UmVxdWVzdChcImdldFwiKTtcbiAgICAgICAgICAgIHJldHVybiAoJHEucmVqZWN0KHJlamVjdGlvbikpO1xuICAgICAgICB9LFxuICAgICAgICByZXNwb25zZTogZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHRyYWZmaWNDb3AuZW5kUmVxdWVzdChleHRyYWN0TWV0aG9kKHJlc3BvbnNlKSk7XG4gICAgICAgICAgICByZXR1cm4gKHJlc3BvbnNlKTtcbiAgICAgICAgfSxcbiAgICAgICAgcmVzcG9uc2VFcnJvcjogZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHRyYWZmaWNDb3AuZW5kUmVxdWVzdChleHRyYWN0TWV0aG9kKHJlc3BvbnNlKSk7XG4gICAgICAgICAgICByZXR1cm4gKCRxLnJlamVjdChyZXNwb25zZSkpO1xuICAgICAgICB9XG4gICAgfTtcbn1dKTtcblxuYXBwLnNlcnZpY2UoJ3NjZVRydXN0SHRtbCcsIFsnJHNjZScsIGZ1bmN0aW9uKCRzY2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBjaGVja1RleHQ6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiAkc2NlLnRydXN0QXNIdG1sKGRhdGEpO1xuICAgICAgICB9XG4gICAgfTtcbn1dKTtcblxuYXBwLmZhY3RvcnkoJ29ubGluZVN0YXR1cycsIFsnJHNjZScsICckd2luZG93JywgZnVuY3Rpb24oJHNjZSwgJHdpbmRvdykge1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY2hlY2tTdGF0dXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuICR3aW5kb3cubmF2aWdhdG9yLm9uTGluZTtcbiAgICAgICAgfVxuICAgIH07XG59XSk7XG5cbmFwcC5mYWN0b3J5KCdtYWluQ2F0ZWdvcnknLCBbXCIkaHR0cFwiLCBcIkdMT0JBTFNcIiwgXCJhdXRoU2VydmljZVwiLCBcIiRxXCIsIGZ1bmN0aW9uKCRodHRwLCBHTE9CQUxTLCBhdXRoU2VydmljZSwgJHEpIHtcbiAgICB2YXIgZmFjdG9yeSA9IHt9O1xuICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG5cbiAgICBmYWN0b3J5LmdldE1haW5DYXRlZ29yeSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAkaHR0cCh7XG4gICAgICAgICAgICAgICAgdXJsOiBHTE9CQUxTLkFQSV9VUkwxICsgJ2dldF9tYWluX2NhdGVnb3J5PycsXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgICAgICBjYWNoZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgcGFyYW1zOiAnJyxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7fVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHN1Y2Nlc3MuZGF0YS5kYXRhKTtcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7fSk7XG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIH07XG5cbiAgICByZXR1cm4gZmFjdG9yeTtcbn1dKTtcblxuYXBwLmZhY3RvcnkoJ2Vycm9yTXNnRmFjdG9yeScsIFtcIiRodHRwXCIsIFwiR0xPQkFMU1wiLCBcImF1dGhTZXJ2aWNlXCIsIFwiJHFcIiwgZnVuY3Rpb24oJGh0dHAsIEdMT0JBTFMsIGF1dGhTZXJ2aWNlLCAkcSkge1xuICAgIHZhciBmYWN0b3J5ID0ge307XG4gICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcblxuICAgIGZhY3RvcnkuZ2V0RXJyb3JNZXNzYWdlID0gZnVuY3Rpb24oZXJyb3IsIGZpZWxkbmFtZSkge1xuICAgICAgICB2YXIgbWVzc2FnZTtcblxuICAgICAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQoZXJyb3IpKSB7XG4gICAgICAgICAgICBpZiAoZXJyb3IucmVxdWlyZWQpIHtcblxuICAgICAgICAgICAgICAgIGlmIChmaWVsZG5hbWUgPT0gXCJwaG9uZW51bWJlclwiKSB7XG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBcIkVudGVyIHBob25lIG51bWJlclwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZmllbGRuYW1lID09IFwiZ3V5c1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBcIkVudGVyIHRvdGFsIGd1eXMgbnVtYmVyXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChmaWVsZG5hbWUgPT0gXCJnaXJsc1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBcIkVudGVyIHRvdGFsIGdpcmxzIG51bWJlclwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZmllbGRuYW1lID09IFwiZ3Vlc3RcIikge1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlID0gXCJFbnRlciB0b3RhbCBndWVzdCBudW1iZXJcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGZpZWxkbmFtZSA9PSBcImRhdGVcIikge1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlID0gXCJDaG9vc2UgcmVzZXJ2YXRpb24gZGF0ZVwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZmllbGRuYW1lID09IFwiZW1haWxcIikge1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlID0gXCJFbnRlciBFbWFpbFwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZmllbGRuYW1lID09IFwiZm5hbWVcIikge1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlID0gXCJFbnRlciBGaXJzdCBOYW1lXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChmaWVsZG5hbWUgPT0gXCJsbmFtZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBcIkVudGVyIExhc3QgTmFtZVwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZmllbGRuYW1lID09IFwicGFzc3dvcmRcIikge1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlID0gXCJFbnRlciBQYXNzd29yZFwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZmllbGRuYW1lID09IFwiY29uZmlybXBhc3N3b3JkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSA9IFwiRW50ZXIgQ29uZmlybSBQYXNzd29yZFwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZmllbGRuYW1lID09IFwib2xkcGFzc3dvcmRcIikge1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlID0gXCJFbnRlciBPbGQgUGFzc3dvcmRcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGZpZWxkbmFtZSA9PSBcIm5ld3Bhc3N3b3JkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSA9IFwiRW50ZXIgTmV3IFBhc3N3b3JkXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChmaWVsZG5hbWUgPT0gXCJvY2Nhc3Npb25cIikge1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlID0gXCJFbnRlciBPY2Nhc3Npb25cIjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGZpZWxkbmFtZSA9PSBcInBpY2t1cFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBcIlNlbGVjdCBQaWNrdXAgTG9jYXRpb25cIjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGZpZWxkbmFtZSA9PSBcInBpY2t1cHRpbWVcIikge1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlID0gXCJTZWxlY3QgUGlja3VwIFRpbWVcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGZpZWxkbmFtZSA9PSBcImRyb3BvZmZcIikge1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlID0gXCJTZWxlY3QgRHJvcE9mZiBMb2NhdGlvblwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZmllbGRuYW1lID09IFwiYWRkcmVzc1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBcIkVudGVyIEFkZHJlc3NcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGZpZWxkbmFtZSA9PSBcInN0YXRlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSA9IFwiU2VsZWN0IFN0YXRlXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChmaWVsZG5hbWUgPT0gXCJjb3VudHJ5XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSA9IFwiU2VsZWN0IENvdW50cnlcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGZpZWxkbmFtZSA9PSBcImNhcmROb1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBcIkVudGVyIENyZWRpdCBDYXJkIE5vXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChmaWVsZG5hbWUgPT0gXCJleHBpcnlEYXRlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSA9IFwiRW50ZXIgRXhwaXJ5IERhdGVcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGZpZWxkbmFtZSA9PSBcImN2dlwiKSB7XG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBcIkVudGVyIENWVlwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZmllbGRuYW1lID09IFwiemlwXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSA9IFwiRW50ZXIgWmlwIENvZGVcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGZpZWxkbmFtZSA9PSBcIm1vbnRoXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSA9IFwiU2VsZWN0IEV4cGlyeSBNb250aFwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZmllbGRuYW1lID09IFwieWVhclwiKSB7XG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBcIlNlbGVjdCBFeHBpcnkgWWVhclwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZmllbGRuYW1lID09IFwiY2l0eVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBcIkVudGVyIENpdHlcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVycm9yLnBhdHRlcm4pIHtcbiAgICAgICAgICAgICAgICBpZiAoZmllbGRuYW1lID09IFwicGhvbmVudW1iZXJcIikge1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlID0gXCJJbnZhbGlkIHBob25lIG51bWJlclwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZmllbGRuYW1lID09IFwiYWdlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSA9IFwiUGxlYXNlIGVudGVyIHByb3BlciBBZ2VcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGZpZWxkbmFtZSA9PSBcImVtYWlsXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSA9IFwiSW52YWxpZCBlbWFpbCBhZGRyZXNzXCI7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVycm9yLm1heGxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGlmIChmaWVsZG5hbWUgPT0gXCJwaG9uZW51bWJlclwiKSB7XG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBcIkludmFsaWQgcGhvbmUgbnVtYmVyXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChmaWVsZG5hbWUgPT0gXCJjdnZcIikge1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlID0gXCJJbnZhbGlkIENWViBudW1iZXJcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGZpZWxkbmFtZSA9PSBcImNhcmROb1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBcIkludmFsaWQgQ3JlZGl0IENhcmQgbnVtYmVyXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSA9IFwiUGxlYXNlIGVudGVyIGEgdmFsaWQgbnVtYmVyXCI7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVycm9yLm1pbmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGlmIChmaWVsZG5hbWUgPT0gXCJwaG9uZW51bWJlclwiKSB7XG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBcIkVudGVyIG1pbmltdW0gMTAgZGlnaXRzXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChmaWVsZG5hbWUgPT0gXCJjdnZcIikge1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlID0gXCJFbnRlciBtaW5pbXVtIDMgZGlnaXRcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGZpZWxkbmFtZSA9PSBcImNhcmROb1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBcIkVudGVyIG1pbmltdW0gMTYgZGlnaXRcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGZpZWxkbmFtZSA9PSBcInBhc3N3b3JkXCIgfHwgZmllbGRuYW1lID09IFwib2xkcGFzc3dvcmRcIiB8fCBmaWVsZG5hbWUgPT0gXCJuZXdwYXNzd29yZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBcIlBhc3N3b3JkIHNob3VsZCBiZSBtaW5pbXVtIG9mIDQgbGVuZ3RoXCI7XG4gICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXJyb3IuZW1haWwpIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlID0gXCJJbnZhbGlkIGVtYWlsIGFkZHJlc3NcIjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXJyb3IubnVtYmVyKSB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZSA9IFwiT25seSBEaWdpdHMgYXJlIEFsbG93ZWRcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWVzc2FnZTtcbiAgICB9O1xuICAgIHJldHVybiBmYWN0b3J5O1xufV0pOyIsInZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnYXV0aGVudGljYXRpb25TZXJ2aWNlcycsIFtdKTtcbmFwcC5zZXJ2aWNlKCdhdXRoU2VydmljZScsIFsnJGNvb2tpZXMnLCAnJGNvb2tpZVN0b3JlJywgJyRodHRwJywgJyRzdGF0ZScsIGZ1bmN0aW9uKCRjb29raWVzLCAkY29va2llU3RvcmUsICRodHRwLCAkc3RhdGUpIHtcbiAgICB2YXIgYXV0aFNlcnZpY2UgPSB7fTtcbiAgICBhdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhhdXRoU2VydmljZS5hdXRoVG9rZW4pXG4gICAgICAgIHZhciBhdXRoVG9rZW4gPSAkY29va2llU3RvcmUuZ2V0KCdBdXRoVG9rZW4nKTtcbiAgICAgICAgYXV0aFNlcnZpY2UuYXV0aFRva2VuID0gYXV0aFRva2VuID8gYXV0aFRva2VuIDogJyc7XG4gICAgICAgIHJldHVybiBhdXRoU2VydmljZS5hdXRoVG9rZW47XG4gICAgfTtcbiAgICBhdXRoU2VydmljZS5zZXRBdXRoVG9rZW4gPSBmdW5jdGlvbih0b2tlbikge1xuICAgICAgICAkY29va2llU3RvcmUucHV0KCdBdXRoVG9rZW4nLCBcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaXCIpO1xuICAgIH07XG4gICAgYXV0aFNlcnZpY2UuY2xlYXJBdXRoZW50aWNhdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAkY29va2llU3RvcmUucmVtb3ZlKCdBdXRoVG9rZW4nKTtcbiAgICB9O1xuICAgIGF1dGhTZXJ2aWNlLmNsZWFyQXV0aGVudGljYXRpb25CYWNrID0gZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgIGlmIChlcnIgPT0gNDAxKSB7XG4gICAgICAgICAgICAkY29va2llU3RvcmUucmVtb3ZlKCdBdXRoVG9rZW4nKTtcbiAgICAgICAgICAgIC8vJHN0YXRlLmdvKCdsb2dpbicpO1xuICAgICAgICAgICAgLy93aW5kb3cubG9jYXRpb24gPSBzZXR0aW5ncy51cmwgKyAnL2xvZ2luJztcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIGF1dGhTZXJ2aWNlO1xufV0pOyIsInZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnY29tbW9uRGlyZWN0aXZlcycsIFtdKTtcbmFwcC5kaXJlY3RpdmUoJ3BhZ2VUaXRsZScsIFsnJHJvb3RTY29wZScsICckdGltZW91dCcsIGZ1bmN0aW9uKCRyb290U2NvcGUsICR0aW1lb3V0KXtcblxuLy9jb29tbW9uIGRpcmVjdGl2ZVxuXHRyZXR1cm4ge1xuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50KSB7XG4gICAgICB2YXIgbGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcykge1xuICAgICAgICAvLyBEZWZhdWx0IHRpdGxlIC0gbG9hZCBvbiBEYXNoYm9hcmQgMVxuICAgICAgICB2YXIgdGl0bGUgPSAnUHJvamVjdCBOYW1lJztcbiAgICAgICAgLy8gQ3JlYXRlIHlvdXIgb3duIHRpdGxlIHBhdHRlcm5cbiAgICAgICAgaWYgKHRvU3RhdGUuZGF0YS5wYWdlVGl0bGUpIHt0aXRsZSA9IHRvU3RhdGUuZGF0YS5wYWdlVGl0bGU7fVxuICAgICAgICAkdGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICBlbGVtZW50LnRleHQodGl0bGUpO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3RhcnQnLCBsaXN0ZW5lcik7XG4gICAgfVxuICB9O1xufV0pO1xuIiwidmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdNYWluQ29udHJvbGxlcicsWyduZ0Nvb2tpZXMnLCdkZWZhdWx0U2VydmljZXMnXSk7XG5cbmFwcC5jb250cm9sbGVyKCdNYWluQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJyRyb290U2NvcGUnLCckY29va2llcycsJyRjb29raWVTdG9yZScsJyRzdGF0ZScsJ2F1dGhTZXJ2aWNlJywncmVzb3VyY2VTZXJ2aWNlJywnJGh0dHAnLCBmdW5jdGlvbigkc2NvcGUsICRyb290U2NvcGUsJGNvb2tpZXMsJGNvb2tpZVN0b3JlLCRzdGF0ZSxhdXRoU2VydmljZSxyZXNvdXJjZVNlcnZpY2UsJGh0dHApIHtcblx0JHNjb3BlLnNpZ25vdXQgPSBmdW5jdGlvbigpIHtcblx0XHRhdXRoU2VydmljZS5jbGVhckF1dGhlbnRpY2F0aW9uKCk7XG5cdFx0JHN0YXRlLmdvKCdsb2dpbicpO1xuXHR9O1xuXG5cblx0JGh0dHAoe1xuXHRcdG1ldGhvZDogJ0dFVCcsXG5cdFx0dXJsOiAnJ1xuXHR9KS50aGVuKGZ1bmN0aW9uIHN1Y2Nlc3NDYWxsYmFjayhyZXNwb25zZSkge1xuXHRcdC8vY29uc29sZS5sb2cocmVzcG9uc2UpXG5cdFx0XG5cdCAgICAvLyB3aGVuIHRoZSByZXNwb25zZSBpcyBhdmFpbGFibGVcblx0fSwgZnVuY3Rpb24gZXJyb3JDYWxsYmFjayhyZXNwb25zZSkge1xuXHQgICAgLy8gY2FsbGVkIGFzeW5jaHJvbm91c2x5IGlmIGFuIGVycm9yIG9jY3Vyc1xuXHQgICAgLy8gb3Igc2VydmVyIHJldHVybnMgcmVzcG9uc2Ugd2l0aCBhbiBlcnJvciBzdGF0dXMuXG5cdH0pO1xuXG5cbn1dKTsiLCJ2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ3JvdXRlJyxbXG5cdFx0J2FkbWluLnJvdXRlJyxcblx0XHQndXNlci5yb3V0ZSdcblx0XSk7XG4iLCJ2YXIgTW9kdWxlTmFtZSA9ICdERU1PJztcbnZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgndXNlci5yb3V0ZScsW1xuICAgICduZ0Nvb2tpZXMnLFxuICAgICdkZWZhdWx0U2VydmljZXMnLFxuICAgICdjb25zdGFudHMnLFxuICAgICd1aS5yb3V0ZXInXG4gICAgXSk7XG5cbmFwcC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLCAnJGxvY2F0aW9uUHJvdmlkZXInLCckaHR0cFByb3ZpZGVyJywnR0xPQkFMUycsJ1NFVFRJTkdTJywgZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIsJGh0dHBQcm92aWRlcixHTE9CQUxTLFNFVFRJTkdTKSB7XG4gICAgJHN0YXRlUHJvdmlkZXJcbiAgICAuc3RhdGUoJ21haW4uY29tcG9uZW50MScsIHtcbiAgICAgICAgdXJsOiBcIi9jb21wb25lbnQxXCIsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIHBhZ2VUaXRsZTogJ0NvbXBvbmVudCBUd28nXG4gICAgICAgIH0sXG4gICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAnaG9tZSc6IHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJcIiArIFNFVFRJTkdTW0dMT0JBTFMuRU5WXS5zaXRlVXJsICsgXCJhcHAvY29tcG9uZW50cy9jb21wb25lbnQxL2NvbXBvbmVudDFWaWV3Lmh0bWxcIixcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBcImNvbXBvbmVudDFDdHJsXCIsXG4gICAgICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgICAgICBkZXBzOiBbJyRvY0xhenlMb2FkJywgZnVuY3Rpb24oJG9jTGF6eUxvYWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkb2NMYXp5TG9hZC5sb2FkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBNb2R1bGVOYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydEJlZm9yZTogJyNsb2FkX3BsdWdpbnNfYmVmb3JlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlczogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiXCIgKyBTRVRUSU5HU1tHTE9CQUxTLkVOVl0uc2l0ZVVybCArIFwiYXBwL2NvbXBvbmVudHMvY29tcG9uZW50MS9jb21wb25lbnQxQ3RybC5qc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiXCIgKyBTRVRUSU5HU1tHTE9CQUxTLkVOVl0uc2l0ZVVybCArIFwiYXBwL2NvbXBvbmVudHMvY29tcG9uZW50MS9ob21lRGlyZWN0aXZlLmpzXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH0pXG4gICAgLnN0YXRlKCdtYWluLmNvbXBvbmVudDInLCB7XG4gICAgICAgIHVybDogXCIvY29tcG9uZW50MlwiLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBwYWdlVGl0bGU6ICdDb21wb25lbnQgVHdvJ1xuICAgICAgICB9LFxuICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgJ2hvbWUnOiB7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwiXCIgKyBTRVRUSU5HU1tHTE9CQUxTLkVOVl0uc2l0ZVVybCArIFwiYXBwL2NvbXBvbmVudHMvY29tcG9uZW50Mi9jb21wb25lbnQyVmlldy5odG1sXCIsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogXCJjb21wb25lbnQyQ3RybFwiLFxuICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgICAgICAgZGVwczogWyckb2NMYXp5TG9hZCcsIGZ1bmN0aW9uKCRvY0xhenlMb2FkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJG9jTGF6eUxvYWQubG9hZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogTW9kdWxlTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnRCZWZvcmU6ICcjbG9hZF9wbHVnaW5zX2JlZm9yZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZXM6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlwiICsgU0VUVElOR1NbR0xPQkFMUy5FTlZdLnNpdGVVcmwgKyBcImFwcC9jb21wb25lbnRzL2NvbXBvbmVudDIvY29tcG9uZW50MkN0cmwuanNcIiAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJcIiArIFNFVFRJTkdTW0dMT0JBTFMuRU5WXS5zaXRlVXJsICsgXCJhcHAvY29tcG9uZW50cy9jb21wb25lbnQyL2NvbXBvbmVudDJTZXJ2aWNlLmpzXCIsXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICAgICAgICAgIHVzZXI6Wyd1c2VyQXBpU2VydmljZScsZnVuY3Rpb24odXNlckFwaVNlcnZpY2Upe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdXNlckFwaVNlcnZpY2UuR2V0QWxsQ291bnRyeSgpO1xuICAgICAgICAgICAgICAgICAgICB9XSxcbiAgICAgICAgICAgICAgICAgICAgdXNlcjE6Wyd1c2VyQXBpU2VydmljZScsZnVuY3Rpb24odXNlckFwaVNlcnZpY2Upe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdXNlckFwaVNlcnZpY2UuR2V0QWxsQ291bnRyeSgpO1xuICAgICAgICAgICAgICAgICAgICB9XSxcbiAgICAgICAgICAgICAgICAgICAgdXNlcjI6Wyd1c2VyQXBpU2VydmljZScsZnVuY3Rpb24odXNlckFwaVNlcnZpY2Upe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdXNlckFwaVNlcnZpY2UuR2V0QWxsQ291bnRyeSgpO1xuICAgICAgICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfSlcbiAgIFxufV0pOyIsInZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnYWRtaW4ucm91dGUnLFtcblx0J25nQ29va2llcycsXG5cdCdkZWZhdWx0U2VydmljZXMnLFxuICAgICdjb25zdGFudHMnLFxuXHQndWkucm91dGVyJ1xuXHRdKTtcblxuYXBwLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsICckbG9jYXRpb25Qcm92aWRlcicsJyRodHRwUHJvdmlkZXInLCdHTE9CQUxTJywnU0VUVElOR1MnLCBmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlciwkaHR0cFByb3ZpZGVyLEdMT0JBTFMsU0VUVElOR1MpIHtcbiAgICAkc3RhdGVQcm92aWRlclxuICAgIC5zdGF0ZSgnbG9naW4nLCB7XG4gICAgICAgIHVybDogXCIvbG9naW5cIixcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgcGFnZVRpdGxlOiAnTG9naW4nXG4gICAgICAgIH0sXG4gICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAnbWFpbic6IHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJcIiArIFNFVFRJTkdTW0dMT0JBTFMuRU5WXS5zaXRlVXJsICsgXCJhcHAvY29tcG9uZW50cy9sb2dpbi9sb2dpbi5odG1sXCIsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogXCJsb2dpbkN0cmxcIixcbiAgICAgICAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgICAgICAgIGRlcHM6IFsnJG9jTGF6eUxvYWQnLCBmdW5jdGlvbigkb2NMYXp5TG9hZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRvY0xhenlMb2FkLmxvYWQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IE1vZHVsZU5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0QmVmb3JlOiAnI2xvYWRfcGx1Z2luc19iZWZvcmUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVzOiBbXCJcIiArIFNFVFRJTkdTW0dMT0JBTFMuRU5WXS5zaXRlVXJsICsgXCJhcHAvY29tcG9uZW50cy9sb2dpbi9sb2dpbkN0cmwuanNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfSlcbiAgICAgLnN0YXRlKCdyZWdpc3RlcicsIHtcbiAgICAgICAgdXJsOiBcIi9yZWdpc3RlclwiLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBwYWdlVGl0bGU6ICdSZWdpc3RlcidcbiAgICAgICAgfSxcbiAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICdtYWluJzoge1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcIlwiICsgU0VUVElOR1NbR0xPQkFMUy5FTlZdLnNpdGVVcmwgKyBcImFwcC9jb21wb25lbnRzL3JlZ2lzdGVyL3JlZ2lzdGVyVmlldy5odG1sXCIsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogXCJyZWdpc3RlckN0cmxcIixcbiAgICAgICAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgICAgICAgIGRlcHM6IFsnJG9jTGF6eUxvYWQnLCBmdW5jdGlvbigkb2NMYXp5TG9hZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRvY0xhenlMb2FkLmxvYWQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IE1vZHVsZU5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0QmVmb3JlOiAnI2xvYWRfcGx1Z2luc19iZWZvcmUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVzOiBbXCJcIiArIFNFVFRJTkdTW0dMT0JBTFMuRU5WXS5zaXRlVXJsICsgXCJhcHAvY29tcG9uZW50cy9yZWdpc3Rlci9yZWdpc3RlckN0cmwuanNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfSlcbiAgICAuc3RhdGUoJ21haW4nLCB7XG4gICAgICAgIHVybDogXCJcIixcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgcGFnZVRpdGxlOiAnSG9tZSBQYWdlJ1xuICAgICAgICB9LFxuICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgJ21haW4nOiB7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwiXCIgKyBTRVRUSU5HU1tHTE9CQUxTLkVOVl0uc2l0ZVVybCArIFwiYXBwL2NvbW1vbi92aWV3cy9tYWluTGF5b3V0Lmh0bWxcIixcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBcIlwiLFxuICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgICAgICAgZGVwczogWyckb2NMYXp5TG9hZCcsIGZ1bmN0aW9uKCRvY0xhenlMb2FkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJG9jTGF6eUxvYWQubG9hZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogTW9kdWxlTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnRCZWZvcmU6ICcjbG9hZF9wbHVnaW5zX2JlZm9yZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZXM6IFtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfSlcbiAgICAuc3RhdGUoJ21haW4ucm9vdCcsIHtcbiAgICAgICAgdXJsOiBcIi9cIixcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgcGFnZVRpdGxlOiAnSG9tZSBQYWdlJ1xuICAgICAgICB9LFxuICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgJ2hvbWUnOiB7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwiXCIgKyBTRVRUSU5HU1tHTE9CQUxTLkVOVl0uc2l0ZVVybCArIFwiYXBwL2NvbXBvbmVudHMvaG9tZS9ob21lVmlldy5odG1sXCIsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogXCJob21lQ3RybFwiLFxuICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgICAgICAgZGVwczogWyckb2NMYXp5TG9hZCcsIGZ1bmN0aW9uKCRvY0xhenlMb2FkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJG9jTGF6eUxvYWQubG9hZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogTW9kdWxlTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnRCZWZvcmU6ICcjbG9hZF9wbHVnaW5zX2JlZm9yZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZXM6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlwiICsgU0VUVElOR1NbR0xPQkFMUy5FTlZdLnNpdGVVcmwgKyBcImFwcC9jb21wb25lbnRzL2hvbWUvaG9tZUN0cmwuanNcIiBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH0pXG4gICAgLnN0YXRlKCdtYWluLmhvbWUnLCB7XG4gICAgICAgIHVybDogXCIvaG9tZVwiLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBwYWdlVGl0bGU6ICdIb21lIFBhZ2UnXG4gICAgICAgIH0sXG4gICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAnaG9tZSc6IHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJcIiArIFNFVFRJTkdTW0dMT0JBTFMuRU5WXS5zaXRlVXJsICsgXCJhcHAvY29tcG9uZW50cy9ob21lL2hvbWVWaWV3Lmh0bWxcIixcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBcImhvbWVDdHJsXCIsXG4gICAgICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgICAgICBkZXBzOiBbJyRvY0xhenlMb2FkJywgZnVuY3Rpb24oJG9jTGF6eUxvYWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkb2NMYXp5TG9hZC5sb2FkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBNb2R1bGVOYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydEJlZm9yZTogJyNsb2FkX3BsdWdpbnNfYmVmb3JlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlczogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiXCIgKyBTRVRUSU5HU1tHTE9CQUxTLkVOVl0uc2l0ZVVybCArIFwiYXBwL2NvbXBvbmVudHMvaG9tZS9ob21lQ3RybC5qc1wiIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfSlcbiAgICBcbn1dKTsiLCJ2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ3VzZXIuYXBpLnNlcnZpY2VzJyxbXSk7XG5hcHAuc2VydmljZSgndXNlckFwaVNlcnZpY2UnLCBbJyRjb29raWVzJywgJyRjb29raWVTdG9yZScsICckaHR0cCcsICckc3RhdGUnLCBmdW5jdGlvbigkY29va2llcywgJGNvb2tpZVN0b3JlLCAkaHR0cCwgJHN0YXRlKSB7XG4gICAgdmFyIHVzZXJBcGlTZXJ2aWNlID0ge307XG4gICAgdXNlckFwaVNlcnZpY2UuR2V0QWxsQ291bnRyeSA9IGZ1bmN0aW9uKCkgeyAgICAgICAgXG4gICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgICB1cmw6ICdodHRwOi8vcGhwNTQuaW5kaWFuaWMuY29tL3ZlZ2FzX3ZlbnVlcy93ZWJzZXJ2aWNlL2dldF9uaWdodF9jbHViX2xpc3Rpbmc/JnNlYXJjaF9uaWdodGNsdWI9JnBhZ2VfaW5kZXg9MScsXG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgIGRhdGE6ICQucGFyYW0oe1xuXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICByZXR1cm4gdXNlckFwaVNlcnZpY2U7XG59XSk7IiwidmFyIE1vZHVsZU5hbWUgPSAnREVNTyc7XG52YXIgQXBwID0gYW5ndWxhci5tb2R1bGUoTW9kdWxlTmFtZSwgW1xuICAgIFwidWkucm91dGVyXCIsXG4gICAgXCJyb3V0ZVwiLFxuICAgIFwibmdDb29raWVzXCIsXG4gICAgXCJvYy5sYXp5TG9hZFwiLFxuICAgIFwibmdTYW5pdGl6ZVwiLFxuICAgIFwiTG9jYWxTdG9yYWdlTW9kdWxlXCIsXG4gICAgXCJ1aS5ib290c3RyYXBcIixcbiAgICBcIm5nTWF0ZXJpYWxcIixcbiAgICBcIm5nQW5pbWF0ZVwiLFxuICAgIFwiY29uc3RhbnRzXCIsXG4gICAgXCJjb21tb25EaXJlY3RpdmVzXCIsXG4gICAgXCJkZWZhdWx0U2VydmljZXNcIixcbiAgICBcIk1haW5Db250cm9sbGVyXCIgLFxuICAgIFwiYXV0aGVudGljYXRpb25TZXJ2aWNlc1wiLFxuICAgIFwidXNlci5hcGkuc2VydmljZXNcIlxuICAgIF0pO1xuXG5BcHAucnVuKFsnJHJvb3RTY29wZScsICckc3RhdGUnLCAnJHN0YXRlUGFyYW1zJywgJyRjb29raWVTdG9yZScsICckY29va2llcycsICdhdXRoU2VydmljZScsXG4gICAgZnVuY3Rpb24oJHJvb3RTY29wZSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMsICRjb29raWVTdG9yZSwgJGNvb2tpZXMsIGF1dGhTZXJ2aWNlKSB7XG4gICAgICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdGFydCcsIGZ1bmN0aW9uKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zKSB7XG4gICAgICAgICAgICBpZiAodG9TdGF0ZS5uYW1lLmluZGV4T2YoJ21haW4nKSA+IC0xICYmIGF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpID09ICcnKSB7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2xvZ2luJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0b1N0YXRlLm5hbWUgPT0gJ21haW4nICYmIGF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpICE9ICcnKSB7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ21haW4uaG9tZScpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodG9TdGF0ZS5uYW1lLmluZGV4T2YoJ2xvZ2luJykgPiAtMSAmJiBhdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSAhPSAnJykge1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdtYWluLmhvbWUnKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBdKTtcblxuXG5BcHAuY29uZmlnKFsnJGNvbnRyb2xsZXJQcm92aWRlcicsIGZ1bmN0aW9uKCRjb250cm9sbGVyUHJvdmlkZXIpIHtcbiAgICAvLyB0aGlzIG9wdGlvbiBtaWdodCBiZSBoYW5keSBmb3IgbWlncmF0aW5nIG9sZCBhcHBzLCBidXQgcGxlYXNlIGRvbid0IHVzZSBpdFxuICAgIC8vIGluIG5ldyBvbmVzIVxuICAgICRjb250cm9sbGVyUHJvdmlkZXIuYWxsb3dHbG9iYWxzKCk7XG59XSk7XG5cblxuQXBwLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsICckbG9jYXRpb25Qcm92aWRlcicsJyRodHRwUHJvdmlkZXInLCdHTE9CQUxTJywnU0VUVElOR1MnLCBmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlciwkaHR0cFByb3ZpZGVyLEdMT0JBTFMsU0VUVElOR1MpIHtcblxuICAgIGNvbnNvbGUubG9nKCdwYXRoOiAnK1NFVFRJTkdTW0dMT0JBTFMuRU5WXS5zaXRlVXJsKVxuICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoIGZ1bmN0aW9uKCRpbmplY3RvciwgJGxvY2F0aW9uKSB7XG4gICAgICAgIHZhciAkc3RhdGUgPSAkaW5qZWN0b3IuZ2V0KCckc3RhdGUnKTtcbiAgICAgICAgdmFyIFN0b3JhZ2UgPSAkaW5qZWN0b3IuZ2V0KCdhdXRoU2VydmljZScpO1xuICAgICAgICBpZiAoU3RvcmFnZS5pc0F1dGhlbnRpY2F0ZWQoKSkge1xuICAgICAgICAgICAgJHN0YXRlLmdvKCdtYWluLmhvbWUnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICRzdGF0ZS5nbygnbG9naW4nKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChoaXN0b3J5LnB1c2hTdGF0ZSkge1xuICAgICAgICAkbG9jYXRpb25Qcm92aWRlci5oYXNoUHJlZml4KCchJyk7XG4gICAgICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh7XG4gICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgcmVxdWlyZUJhc2U6IHRydWVcbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIHsgICAgICAgIFxuICAgICAgICAkbG9jYXRpb25Qcm92aWRlci5oYXNoUHJlZml4KCchJyk7XG4gICAgICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh7XG4gICAgICAgICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAgICAgICAgIHJlcXVpcmVCYXNlOiBmYWxzZVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgJGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaCgnaW50ZXJjZXB0SHR0cCcpO1xufV0pO1xuXG5cblxuLyogSW5pdCBnbG9iYWwgc2V0dGluZ3MgYW5kIHJ1biB0aGUgYXBwICovXG5BcHAucnVuKFtcIiRyb290U2NvcGVcIiwgXCIkc3RhdGVcIixcInRyYWZmaWNDb3BcIiwgZnVuY3Rpb24oJHJvb3RTY29wZSwgJHN0YXRlLCB0cmFmZmljQ29wKSB7XG4gICAgJHJvb3RTY29wZS4kc3RhdGUgPSAkc3RhdGU7IC8vIHN0YXRlIHRvIGJlIGFjY2Vzc2VkIGZyb20gdmlldyBcbiAgICAkcm9vdFNjb3BlLnRyYWZmaWNDb3AgPSB0cmFmZmljQ29wOyBcbiAgICBcbiAgICBcbiAgIFxufV0pO1xuXG5hbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuICBhbmd1bGFyLmJvb3RzdHJhcChkb2N1bWVudCwgW01vZHVsZU5hbWVdKTtcbn0pO1xuXG5mdW5jdGlvbiBzZXRNZXRhRGF0YSgkc2NvcGUsICRyb290U2NvcGUsIE1ldGFJbmZvcm1hdGlvbiwgc2VvKSB7XG4gICAgaWYgKHR5cGVvZiBzZW8gIT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIHNlby5zZW9fdGl0bGUgIT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgTWV0YUluZm9ybWF0aW9uLnNldE1ldGFUaXRsZShzZW8uc2VvX3RpdGxlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIHNlby5zZW9fZGVzY3JpcHRpb24gIT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgTWV0YUluZm9ybWF0aW9uLnNldE1ldGFEZXNjcmlwdGlvbihzZW8uc2VvX2Rlc2NyaXB0aW9uKVxuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2Ygc2VvLnNlb19rZXl3b3JkcyAhPSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBNZXRhSW5mb3JtYXRpb24uc2V0TWV0YUtleXdvcmQoc2VvLnNlb19rZXl3b3JkcylcbiAgICAgICAgfVxuICAgICAgICAkcm9vdFNjb3BlLm1ldGFEYXRhID0gTWV0YUluZm9ybWF0aW9uO1xuICAgIH1cbn1cbiJdfQ==
