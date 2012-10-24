'use strict';

define([
		'jquery',
		'knockback',
		'knockout',
		'./documentType',
		'text!./main.html',
		'../model',
		'ApplicationContext',
		'EventBus'
	],
	function($, kb, ko, DocumentTypeViewModel, mainHtml, model, applicationContext, eventBus) {
		var MainViewModel =  kb.ViewModel.extend({
			documentTypes: new kb.CollectionObservable(applicationContext.get('documentTypes')),
		    documentType: new DocumentTypeViewModel(applicationContext.get('documentType')),

		    createDocumentType: function() {
		    	eventBus.trigger('createDocumentType');
		    },

		    selectDocumentType: function(documentType) {
		    	eventBus.trigger('selectDocumentType', documentType.model());
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