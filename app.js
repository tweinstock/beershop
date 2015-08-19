angular.module('beerApp', ['ngCookies','ngRoute'])
	.controller('userController',['$scope', '$cookies','Network',userController])
	.controller('beerController',['$scope','Network',beerController])
	.service('Network',Network)
	.directive('login', function() {
		return {
		    restrict: 'E',
		    controller: 'userController',
		    templateUrl: './templates/login.html',
			}
		}
	)
	.directive('description', function() {
		return {
		    restrict: 'E',
		    templateUrl: './templates/description.html',
		    controller: 'beerController'
			}
		}
	)
	.directive('cart', function() {
		return {
		    restrict: 'E',
		    templateUrl: './templates/cart.html'
			}
		}
	)
	.config(['$routeProvider',function($routeProvider) {
	  $routeProvider
	   .when('/', {
	    templateUrl: './templates/beerView.html'
	    //controller: 'beerController'
	    
	  })
	  .when('/about', {
	    template: '<p>Thank you Tomer and Sebastien</p>',
	  })
	  .otherwise({
        redirectTo: '/'
      });
	}])

