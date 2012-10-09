'use strict';

define([
	'jquery',
	'knockback',
	'knockout',
	'EventBus',
	'./documentType',
	'text!./main.html',
	'../model'],
	function($, kb, ko, eventBus, DocumentTypeViewModel, mainHtml, model) {
		var MainViewModel =  kb.ViewModel.extend({
		    documentType: new DocumentTypeViewModel(new model.DocumentType())
		}, {
			/*
			* Start should be called from the entry point of the application.
			* targetElement will be receive the main view, allowing for the 
			* editor to be hosted in just about any parent UI
			*/
			start: function(targetElement) {
				$(targetElement).append($(mainHtml));
				ko.applyBindings(new MainViewModel());
			}
		});

		return MainViewModel;
	}
);