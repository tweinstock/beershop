function beerController($scope,$q,$location,Network)
{
	/* load the get only once */

	$scope.cartObj = {} ;
	$scope.cartList = {} ;
	$scope.showCart = false ;
	
    Network.get('http://localhost/beers').then(function(data) {
		$scope.beers = data.data;
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
		});
	}

	$scope.getCart = function(){
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
}
