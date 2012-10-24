'use strict';

define([
		'underscore',
		'backbone',
		'knockout',
		'knockback',
		'./documentTypeForm',
		'./editor.js',
		'../model',
		'ApplicationContext',
		'EventBus'
	], 
	function(_, backbone, ko, kb, DocumentTypeFormViewModel, EditorViewModel, model, applicationContext, eventBus) {
		var refreshModel = function(model) {
			this.model(model);
			this.editorModel.model(model);
			this.formModel.model(model);
			//TODO: Give control to the child model in how to handle its own children
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
					form: {view: 'documentTypeForm', model: this.formModel, url: 'src/views'},
					editor: {view: 'editor', model: this.editorModel, url: 'src/views'}
				};

				this.active = ko.observable(this.views.form);
			},

			formModel: new DocumentTypeFormViewModel(),
			editorModel: new EditorViewModel(),

			setFormView: function() {
				//TODO: Ensure JSON is valid
				var documentType = JSON.parse(this.editorModel.editor.getValue()),
					propertyPairs = _.pairs(documentType.properties),
					propertyArray = _.map(propertyPairs, function(pair) {
						pair[1].name = pair[0];
						return new model.Property(pair[1]);
					});

				this.editorModel.model().get('properties').reset(propertyArray);
				this.editorModel.model().set(_.omit(documentType, 'properties'));

				this.active(this.views.form);
			},

			setSourceView: function() {
				this.active(this.views.editor);
			}
		});
	}
);