App.controller("registerCtrl",["$scope","authService","$cookies","$cookieStore","$state","$stateParams",function(e,o,t,r,n,c){console.log(n.current.name),e.register=function(){console.log(234324),o.setAuthToken(),n.go("main.home")}}]);