'use strict';

define([
		'knockout',
		'knockback',
		'ApplicationContext',
		'./propertyList',
		'EventBus'
	], 
	function(ko, kb, applicationContext, PropertyListViewModel, eventBus) {
		return kb.ViewModel.extend({
			propertiesModel: new PropertyListViewModel(),

		    addProperty: function() {
		    	eventBus.trigger('addProperty');
		    },
		    
		    save: function() {
		        eventBus.trigger('saveDocumentType');
		    }
		});
	}
);