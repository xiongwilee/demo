var _extend = function(arr, arr_arrow){
	var copy = function(){
		for(var item in arr_arrow){
			if(arr_arrow.hasOwnProperty(item)){
				arr[item] = arr_arrow[item];
			}
		}
		return arr;
	}
}

var Super = function(){
	this.name = 'xiong';
}
Super.prototype.test = {
	console.log(this.name);
}

var Sub = function(){
	Super.call(this)
}

