function userController($scope,$rootScope,$cookies,Network)
{
	$scope.username = $cookies.get('username') || '';
	$scope.password = '';
	$scope.wrongLogin = false;

	Network.get('http://localhost/isLoggedIn').then(function(data) {
		$scope.loggedIn = (data.data == 'true' ? true : false);
	});

	$scope.doLogin = function(){
		/* get data and check if user exists */

		var user_json = {
			username: $scope.username,
			password: $scope.password
		};

		Network.post('http://localhost/login',JSON.stringify(user_json)).then(function(data) {

			$scope.loggedIn = false;
			$cookies.put('isLoggedIn', '0');

			if(data.data == 'true'){
				$cookies.put('isLoggedIn', '1');
				$cookies.put('username', (JSON.parse(data.config.data)).username );
				$scope.loggedIn = true;
			}

		}).catch(function(response) {
			if( !response.data ){
				$scope.wrongLogin = true;
			}
		});
	}

	$scope.logOut = function(){		
		Network.get('http://localhost/logOut').then(function(data) {
			if( data.data == "true"){
				$cookies.remove('isLoggedIn');
				$cookies.remove('username');
				$scope.loggedIn = false;
				$scope.wrongLogin = false;
				$rootScope.$broadcast("logout");
			}
			else{
				console.log('could not log out, error :' + data.data);
			}
		});	
	}

	$scope.ShowLoginPopup = function(){
		$scope.showLogin = true;
	}

}
