var stringCase = (function(){
	/**
	 * 把下划线命名法转换为驼峰命名法
	 * @param  {[type]} string 参数名称
	 * @return {[type]}        驼峰命名法的参数名称
	 */
	var toCamel = function(string){
		var stringList = string.split('_');
		return stringList.map(function(item, index){
			if(index == 0){return item}

			return item.replace(/^\S/,function(item){
				return item.toUpperCase()
			})
		}).join('');
	}
	/**
	 * 把驼峰命名法转换为下划线命名法
	 * @param  {[type]} string 参数名称
	 * @return {[type]}        下划线命名法的参数名称
	 */
	var toUndercode = function(string){
		return string.replace(/\S[A-Z]/g, function(item){
			return item[0] + '_' + item[1].toLowerCase()
		})
	}

	return {
		toCamel : toCamel,
		toUndercode : toUndercode
	}
})()