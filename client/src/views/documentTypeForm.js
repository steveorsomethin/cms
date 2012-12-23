'use strict';

define([
		'knockout',
		'knockback',
		'./propertyList',
		'ApplicationContext',
		'dispatcher'
	], 
	function(ko, kb, PropertyListViewModel, applicationContext, dispatcher) {
		return kb.ViewModel.extend({
			constructor: function(model) {
				kb.ViewModel.prototype.constructor.apply(this, arguments);

				this.propertiesModel = new PropertyListViewModel();
			},
			
			addProperty: function() {
				dispatcher.trigger('addProperty');
			},
	
			save: function() {
				dispatcher.trigger('saveDocumentType');
			}
		});
	}
);