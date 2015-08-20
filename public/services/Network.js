function Network($http)
{
	this.get = function(url){
		
		return $http.get(url); // return promise
	}

	this.post = function(urlData,jsonData){
		return $http.post(urlData,jsonData); // return promise
	}
	this.put = function(urlData,jsonData){
		return $http.put(urlData,jsonData); // return promise
	}
	this.delete = function(url){
		return $http.delete(url); // return promise
	}
  		
}