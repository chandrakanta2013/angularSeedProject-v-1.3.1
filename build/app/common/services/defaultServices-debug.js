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