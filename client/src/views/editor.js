'use strict';

define([
		'jquery',
		'underscore',
		'knockout',
		'knockback',
		'ace',
		'EventBus',
		'../model'
	], 
	function($, _, ko, kb, ace, eventBus, model) {
		var cleanupEditor = function() {
			if (this.editor) {
				this.editor.destroy();
				this.editor = null;
			}
		};

		var addHandlers = function() {
			var self = this;

			//TODO: Throw an event, handle this in a command
			this.editor.on('change', function() {
				//TODO: Ensure JSON is valid
				var documentType = JSON.parse(self.editor.getValue()),
					propertyPairs = _.pairs(documentType.properties),
					propertyArray = _.map(propertyPairs, function(pair) {
						pair[1].name = pair[0];
						return new model.Property(pair[1]);
					});

				self.model().get('properties').reset(propertyArray);
				self.model().set(_.omit(documentType, 'properties'));
			});
		};

		return kb.ViewModel.extend({
			constructor: function(model) {
				kb.ViewModel.prototype.constructor.apply(this, arguments);
			},

			afterRender: function(elements, viewModel) {
				var jsonText = JSON.stringify(viewModel.model().toJSON(), undefined, 4);

				cleanupEditor.call(viewModel);

				viewModel.editor = ace.edit(elements[0]);
				viewModel.editor.setTheme("ace/theme/twilight");
				viewModel.editor.getSession().setMode("ace/mode/json");
				viewModel.editor.setValue(jsonText);

				addHandlers.call(viewModel);
			},

			beforeRemove: function() {
				console.log(arguments);
				cleanupEditor.call(viewModel);
			}
		});
});