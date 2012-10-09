//We need to guarantee underscore is evaluated before backbone, thus the order plugin and explicit dependency here
define(['deps/dust/dust-full-1.0.0'], function(){
	return dust;
});