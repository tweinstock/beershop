function Network($http)
{
	this.get = function(url){
		
		return $http.get(url); // return promise
	}

	this.post = function(urlData,jsonData){
		return $http({
	    	url: urlData,
	        method: "POST",
	        data: jsonData
	        
    	})
	}
	this.put = function(url){}
	this.delete = function(url){}
  		
}