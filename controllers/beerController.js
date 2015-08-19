function beerController($scope,Network)
{
	/* load the get only once */
	
    Network.get('http://localhost:8080/beers').then(function(data) {
		$scope.beers = data.data;
	});

	$scope.viewMore = function( e ){
		$scope.showDesc = true;

		Network.get('http://localhost:8080/beerDetails/'+ e).then(function(data) {
			$scope.beerDescription = data.data;
		});
	}

	$scope.closeMe = function( e ){
		$scope.showDesc = false;
		$scope.showLogin = false;
	}
}
