'use strict';

define(['knockout', 'knockback', 'EventBus'], function(ko, kb, eventBus) {
	return kb.ViewModel.extend({
		//TODO: Make this dynamic/configurable
		types: ko.observableArray(['string', 'integer', 'float', 'boolean']),

	    addProperty: function() {
	    	eventBus.trigger('addProperty', this.model().get('properties'));
	    },
	    
	    save: function() {
	        console.log(this.model().toJSON());
	    }
	});
});