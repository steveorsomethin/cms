'use strict';

define([
		'knockout',
		'knockback',
		'ApplicationContext',
		'./propertyList',
		'./editor.js',
		'EventBus'
	], 
	function(ko, kb, applicationContext, PropertyListViewModel, EditorViewModel, eventBus) {
		var refreshModel = function(model) {
			this.model(model);
			this.propertiesModel.model(model);
		};

		var addHandlers = function() {
			var self = this;
			applicationContext.on('change:documentType', function(context, documentType) {
				refreshModel.call(self, documentType);
			});
		};

		return kb.ViewModel.extend({
			constructor: function(model) {
				kb.ViewModel.prototype.constructor.apply(this, arguments);
				addHandlers.call(this)
				refreshModel.call(this, model);
			},

			editorModel: new EditorViewModel(),
			propertiesModel: new PropertyListViewModel(),

		    addProperty: function() {
		    	eventBus.trigger('addProperty', this.model().get('properties'));
		    },
		    
		    save: function() {
		        console.log(this.model().toJSON());
		    }
		});
	}
);