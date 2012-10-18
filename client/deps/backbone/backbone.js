//We need to guarantee underscore is evaluated before backbone, thus the order plugin and explicit dependency here
define(['order!deps/underscore/underscore-min', 'order!deps/backbone/backbone-min'], function(){
 	return Backbone;
});