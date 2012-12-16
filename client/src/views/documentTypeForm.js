'use strict';

define([
		'knockout',
		'knockback',
		'./propertyList',
		'ApplicationContext',
		'dispatcher'
	], 
	function(ko, kb, PropertyListViewModel, applicationContext, eventBus) {
		return kb.ViewModel.extend({
			constructor: function(model) {
				kb.ViewModel.prototype.constructor.apply(this, arguments);

				this.propertiesModel = new PropertyListViewModel();
			},
			
		addProperty: function() {
			eventBus.trigger('addProperty');
		},

		save: function() {
			eventBus.trigger('saveDocumentType');
		}
		});
	}
);