'use strict';

define([
		'underscore',
		'backbone',
		'knockout',
		'knockback',
		'./editor.js',
		'../model',
		'ApplicationContext',
		'EventBus'
	], 
	function(_, backbone, ko, kb, EditorViewModel, model, applicationContext, eventBus) {
		var refreshModel = function(model) {
			this.model(model);
			this.editorModel.model(model);
		};

		var addHandlers = function() {
			var self = this;

			applicationContext.on('change:template', function(context, template) {
				refreshModel.call(self, template);
			});

			self.editorModel.editorText.subscribe(function(value) {
				self.model().set('body', value);
			});
		};

		return kb.ViewModel.extend({
			constructor: function(model) {
				kb.ViewModel.prototype.constructor.apply(this, arguments);

				this.editorModel = new EditorViewModel();
				this.editorModel.setMode('html');

				addHandlers.call(this);
				refreshModel.call(this, model);
			},

			save: function() {
		        eventBus.trigger('saveTemplate');
		    }
		});
	}
);