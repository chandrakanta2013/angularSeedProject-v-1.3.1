var app=angular.module("defaultServices",[]);app.factory("encodeURL",function(){return{encode:function(e){var r="";for(var n in e)r+=encodeURIComponent(n)+"="+encodeURIComponent(e[n])+"&";return r=r.slice(0,-1)},serialize:function(e,r){var n=[];for(var t in e)e.hasOwnProperty(t)&&(_.isArray(e[t])?_.each(e[t],function(e){_.isObject(e)?n.push(encodeURIComponent(t)+"%3D"+encodeURIComponent(JSON.stringify(e))):n.push(encodeURIComponent(t)+"%3D"+encodeURIComponent(e))}):_.isObject(e[t])?n.push(encodeURIComponent(t)+"%3D"+encodeURIComponent(JSON.stringify(e[t]))):_.isNull(e[t])||_.isUndefined(e[t])||n.push(encodeURIComponent(t)+"%3D"+encodeURIComponent(e[t])));return n.join("%26")}}}),app.factory("browserService",["$window",function(e){var r=function(e){e=e.toLowerCase();var r=/(chrome)[ \/]([\w.]+)/.exec(e)||/(webkit)[ \/]([\w.]+)/.exec(e)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(e)||/(msie) ([\w.]+)/.exec(e)||e.indexOf("compatible")<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(e)||[];return{browser:r[1]||"",version:r[2]||"0"}},n=r(e.navigator.userAgent),t={};return n.browser&&(t[n.browser]=!0,t.version=n.version),t.chrome?t.webkit=!0:t.webkit&&(t.safari=!0),t}]),app.factory("resourceinterceptor",["$q","browserService","encodeURL",function(e,r,n){return{request:function(e){if(e.url.search("php54.indianic.com/healthcareiq/api")!=-1)if(r.msie&&"9.0"===r.version||"8.0"===r.version&&"GET"==e.method){var t=n.serialize(e.params),o="_quantum_proxy.php?q="+encodeURIComponent(e.url);""!==t&&(o+="%3F"+t),e.params={},e.url=o}else if(r.msie&&"9.0"===r.version||"8.0"===r.version&&"POST"!=e.method){var o="_quantum_proxy.php?q="+encodeURIComponent(e.url);e.url=o}else if(r.msie&&"9.0"===r.version||"8.0"===r.version&&"PUT"!=e.method){var o="_quantum_proxy.php?q="+encodeURIComponent(e.url);e.url=o}return e},requestError:function(r){return e.reject(r)},response:function(e){return e},responseError:function(r){return e.reject(r)}}}]),app.factory("resourceUrl",["browserService",function(e){return{proxify:function(e){return"_quantum_proxy.php?q="+encodeURIComponent(e)}}}]),app.factory("MetaInformation",[function(){var e="",r="",n="";return{metaDescription:function(){return e},metaKeyword:function(){return r},metaTitle:function(){return n},reset:function(){e="",r="",n=""},setMetaTitle:function(e){n=e},setMetaDescription:function(r){e=r},setMetaKeyword:function(e){r=e}}}]),app.service("resourceService",["$cookies","$cookieStore","$http","$state","resourceUrl","browserService",function(e,r,n,t,o,a){var i={};return i.GetAllCountry=function(){return n({url:"http://php54.indianic.com/vegas_venues/webservice/get_night_club_listing?&search_nightclub=&page_index=1",method:"POST",data:$.param({}),headers:{"Content-Type":"application/x-www-form-urlencoded"}})},i}]),app.service("trafficCop",function(){function e(e){e=n(e),a.all--,a[e]--,a[e]<0&&t(e),console.log("pending: "+a.all)}function r(e){e=n(e),o.all++,o[e]++,a.all++,a[e]++}function n(e){switch(e=(e||"").toLowerCase()){case"get":case"post":case"delete":case"put":case"head":return e}return"get"}function t(e){var r=Math.abs(a[e]);a[e]=0;for(var n=["get","post","delete","put","head"],t=0;t<n.length;t++){var o=n[t];r&&a[o]&&(a[o]-=r,a[o]<0?(r=Math.abs(a[o]),a[o]=0):r=0)}}var o={all:0,get:0,post:0,delete:0,put:0,head:0},a={all:0,get:0,post:0,delete:0,put:0,head:0};return{pending:a,total:o,endRequest:e,startRequest:r}}),app.service("interceptHttp",["$q","trafficCop",function(e,r){var n=function(e){try{return e.config.method}catch(e){return"get"}};return{request:function(e){return r.startRequest(e.method),e},requestError:function(n){return r.startRequest("get"),e.reject(n)},response:function(e){return r.endRequest(n(e)),e},responseError:function(t){return r.endRequest(n(t)),e.reject(t)}}}]),app.service("sceTrustHtml",["$sce",function(e){return{checkText:function(r){return e.trustAsHtml(r)}}}]),app.factory("onlineStatus",["$sce","$window",function(e,r){return{checkStatus:function(){return r.navigator.onLine}}}]),app.factory("mainCategory",["$http","GLOBALS","authService","$q",function(e,r,n,t){var o={},a=t.defer();return o.getMainCategory=function(){return e({url:r.API_URL1+"get_main_category?",method:"GET",cache:!1,params:"",headers:{}}).then(function(e){a.resolve(e.data.data)},function(e){}),a.promise},o}]),app.factory("errorMsgFactory",["$http","GLOBALS","authService","$q",function(e,r,n,t){var o={};t.defer();return o.getErrorMessage=function(e,r){var n;return angular.isDefined(e)&&(e.required?"phonenumber"==r?n="Enter phone number":"guys"==r?n="Enter total guys number":"girls"==r?n="Enter total girls number":"guest"==r?n="Enter total guest number":"date"==r?n="Choose reservation date":"email"==r?n="Enter Email":"fname"==r?n="Enter First Name":"lname"==r?n="Enter Last Name":"password"==r?n="Enter Password":"confirmpassword"==r?n="Enter Confirm Password":"oldpassword"==r?n="Enter Old Password":"newpassword"==r?n="Enter New Password":"occassion"==r?n="Enter Occassion":"pickup"==r?n="Select Pickup Location":"pickuptime"==r?n="Select Pickup Time":"dropoff"==r?n="Select DropOff Location":"address"==r?n="Enter Address":"state"==r?n="Select State":"country"==r?n="Select Country":"cardNo"==r?n="Enter Credit Card No":"expiryDate"==r?n="Enter Expiry Date":"cvv"==r?n="Enter CVV":"zip"==r?n="Enter Zip Code":"month"==r?n="Select Expiry Month":"year"==r?n="Select Expiry Year":"city"==r&&(n="Enter City"):e.pattern?"phonenumber"==r?n="Invalid phone number":"age"==r?n="Please enter proper Age":"email"==r&&(n="Invalid email address"):e.maxlength?n="phonenumber"==r?"Invalid phone number":"cvv"==r?"Invalid CVV number":"cardNo"==r?"Invalid Credit Card number":"Please enter a valid number":e.minlength?"phonenumber"==r?n="Enter minimum 10 digits":"cvv"==r?n="Enter minimum 3 digit":"cardNo"==r?n="Enter minimum 16 digit":"password"!=r&&"oldpassword"!=r&&"newpassword"!=r||(n="Password should be minimum of 4 length"):e.email?n="Invalid email address":e.number&&(n="Only Digits are Allowed")),n},o}]);