'use strict';

define([
		'knockout',
		'knockback',
		'./propertyList',
		'ApplicationContext',
		'EventBus'
	], 
	function(ko, kb, PropertyListViewModel, applicationContext, eventBus) {
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