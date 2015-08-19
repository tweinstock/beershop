function userController($scope,$cookies,Network)
{
	$scope.showLogin = false;

	$scope.doLogin = function(){
			/* get data and check if user exists */

			var user_json = {
				username: $scope.username,
				password: $scope.password
			};

			Network.post('http://localhost:8080/login',JSON.stringify(user_json)).then(function(data) {
				$scope.loggedIn = false;
				$cookies.put('isLoggedIn', '0');

				if(data.data == 'true'){
					$cookies.put('isLoggedIn', '1');
					$scope.loggedIn = true;
				}
			});
		}

	$scope.ShowLoginPopup = function(){
		$scope.showLogin = true;
	}
}
