define([
	'jquery',
	'knockback',
	'knockout',
	'EventBus',
	'./documentType',
	'text!./main.html',
	'../../model'],
	function($, kb, ko, eventBus, DocumentTypeViewModel, mainHtml, model) {
		var MainViewModel =  kb.ViewModel.extend({
		    documentType: new DocumentTypeViewModel(new model.DocumentType({name: 'butts'}))
		}, {
			start: function(targetElement) {
				$(targetElement).append($(mainHtml));
				ko.applyBindings(new MainViewModel());
			}
		});

		return MainViewModel;
	}
);