function beerController($scope,$q,$location,Network)
{
	/* load the get only once */
	$scope.cartList = {} ;
	$scope.showCart = false ;
	
    Network.get('http://localhost/beers').then(function(data) {
		$scope.beers = data.data;
	});

	Network.get('http://localhost/getCart').then(function(data) {
		$scope.cartObj = data.data;
		$scope.countCartObj = Object.keys( data.data ).length;
		/* return as string or empty project, if empty, create an empty object */
		if($scope.cartObj == undefined || JSON.stringify($scope.cartObj) === '{}' || $scope.cartObj.length == 0)
			$scope.cartObj = {};
	});

	$scope.viewMore = function( e ){
		$scope.showDesc = true;

		Network.get('http://localhost/beerDetails/'+ e).then(function(data) {
			$scope.beerDescription = data.data;
		});
	}

	$scope.closeMe = function( e ){
		$scope.showDesc = false;
		$scope.showLogin = false;
		$scope.showCart = false;
	}

	$scope.createCart = function(jsonCart){
		Network.put('http://localhost/addToCart',jsonCart).then(function(data) {
			$scope.countCartObj = Object.keys( $scope.cartObj ).length;
		});
	}

	$scope.getCart = function(){
		console.log()
		if( Object.keys($scope.cartObj).length === 0 ){
			alert('Your cart is empty');
			return false;
		}

		Network.get('http://localhost/getCart').then(function(data) {
			$scope.cartObj = data.data;

			/* return as string or empty project, if empty, create an empty object */
			if($scope.cartObj == undefined || JSON.stringify($scope.cartObj) === '{}' || $scope.cartObj.length == 0){
				$scope.cartObj = {};
				$scope.showCart = false;
			}
			else{
				$scope.showCart = true;
			}
		});

		$scope.buildCartList();
	}

	$scope.buildCartList = function(){
		var deffered = $q.defer(),
			promises = [],
		    obj = { "total" : 0 },
		    total = 0;

	    for( el in $scope.cartObj ){
	     	Network.get('http://localhost/beerDetails/'+ el).then(function( data ) {   
		       	obj[ data.data.id ] = {
			        "id" : data.data.id,
			        "name" : data.data.name,
			        "count" : $scope.cartObj[ data.data.id ],
			        "priceUnit" : data.data.price,
			        "priceTotal" : ( data.data.price  * $scope.cartObj[ data.data.id ] ),
			        "img_tumb" : data.data.img_tumb
			        
		       	}

		       	obj.total+= ( data.data.price  * $scope.cartObj[ data.data.id ] );

		       	deffered.resolve( obj );
	     	});
	     	
	   		promises.push( deffered.promise );
	    }

	   $q.all(promises).then(function(data){
	    	$scope.cartList = data[0];
	    	$scope.showCheckOut = true;

	    	/*empty cart? show 0 in total price and not empty string*/

	    	if($scope.cartList == undefined || $scope.cartList.length == 0){
	    		$scope.cartList = {'total' : 0};
	    		$scope.showCheckOut = false;
	    	}
	
	   });
	}

	$scope.addCount = function( e ){

		if( $scope.cartObj[e] == undefined){
			$scope.cartObj[e] = 1;
		}
		else{
			$scope.cartObj[e]++;
		}
		$scope.createCart($scope.cartObj);
	}

	$scope.removeCount = function( e ){
		if( $scope.cartObj[e] != undefined && $scope.cartObj[e] > 0 ){
			$scope.cartObj[e]--;

			/*if 0, delete from object*/
			if($scope.cartObj[e] == 0){
				delete $scope.cartObj[e];
			}
		}

		$scope.createCart($scope.cartObj);
	}

	$scope.removeCart = function(){
		Network.delete('http://localhost/deleteCart').then(function(data) {
			$scope.cartList = data.data;
		});

		$location.path('/thankyou');
	}

	$scope.removeFromCart = function( id_ ){
		for( el in $scope.cartList ){
			if( el == id_ )
				delete $scope.cartList[ el ];
		}
		for( el in $scope.cartObj ){
			if( el == id_ )
				delete $scope.cartObj[ el ];
		}

		//$scope.createCart($scope.cartObj);
		$scope.buildCartList();
	}

	/*event listener*/
	$scope.$on("logout",function () {
		$scope.cartList = {} ;
		$scope.showCart = false ;
		$scope.cartObj = {};
		$scope.countCartObj = 0;
	});
}
