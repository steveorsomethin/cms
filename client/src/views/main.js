'use strict';

define([
		'jquery',
		'knockback',
		'knockout',
		'./documentType',
		'./template',
		'text!./main.html',
		'../model',
		'ApplicationContext',
		'EventBus'
	],
	function($, kb, ko, DocumentTypeViewModel, TemplateViewModel, mainHtml, model, applicationContext, eventBus) {
		var addHandlers = function() {
			var self = this;

			//TODO: These should probably be handled elsewhere
			eventBus.on('selectDocumentType', function() {
				self.active(self.views.documentType);
			});

			eventBus.on('selectTemplate', function() {
				self.active(self.views.template);
			});
		};

		var MainViewModel =  kb.ViewModel.extend({
			constructor: function(model) {
				kb.ViewModel.prototype.constructor.apply(this, arguments);

				this.documentTypesModel = new kb.CollectionObservable(applicationContext.get('documentTypes'));
			    this.documentTypeModel = new DocumentTypeViewModel(applicationContext.get('documentType'));
			    this.templateModel = new TemplateViewModel(applicationContext.get('template'));

				this.views = {
					documentType: {view: 'documentType', model: this.documentTypeModel, url: 'src/views'},
					template: {view: 'template', model: this.templateModel, url: 'src/views'}
				};

				this.active = ko.observable(this.views.documentType);

				addHandlers.call(this);
			},

			createDocumentType: function() {
				eventBus.trigger('createDocumentType');
			},

			selectDocumentType: function(documentType) {
				eventBus.trigger('selectDocumentType', documentType.model());
			},

			createTemplate: function() {
				eventBus.trigger('createTemplate');
			},

			selectTemplate: function(template) {
				eventBus.trigger('selectTemplate', template.model());
			}
		}, {
			/*
			* Start should be called from the entry point of the application.
			* targetElement will be receive the main view, allowing for the 
			* editor to be hosted in just about any parent UI
			*/
			start: function(targetElement) {
				$(targetElement).append($(mainHtml));
				ko.applyBindings(new MainViewModel(applicationContext));
			}
		});

		return MainViewModel;
	}
);