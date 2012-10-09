define(['knockback', 'EventBus'], function(kb, eventBus) {
	return kb.ViewModel.extend({
	    addProperty: function() {
	    	eventBus.trigger('addProperty', this.model().get('properties'));
	    },
	    
	    save: function() {
	        console.log(this.model().toJSON());
	    }
	});
});