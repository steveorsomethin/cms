'use strict';

define([
		'backbone',
		'knockout',
		'knockback',
		'ApplicationContext',
		'./documentTypeForm',
		'./editor.js',
		'EventBus'
	], 
	function(backbone, ko, kb, applicationContext, DocumentTypeFormViewModel, EditorViewModel, eventBus) {
		var refreshModel = function(model) {
			this.model(model);
			this.editorModel.model(model);
			this.formModel.model(model);
			this.formModel.propertiesModel.model(model);
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
				addHandlers.call(this);
				refreshModel.call(this, model);
				this.views = {
					form: new backbone.Model({view: 'documentTypeForm', model: this.formModel, url: 'src/views'}),
					editor: new backbone.Model({template: 'editor', model: this.editorModel, url: 'src/views'})
				};
			},

			activeView: function(viewModel) { 
				console.log(arguments);
				var test = viewModel._activeView();
				return test; 
			},
			//activeModel: function() return ''
			_activeView: ko.observable('documentTypeForm'),
			_activeModel: ko.observable(),

			editorModel: new EditorViewModel(),
			formModel: new DocumentTypeFormViewModel(),

			setFormView: function() {
				
			},

			setSourceView: function() {
				
			}
		});
	}
);