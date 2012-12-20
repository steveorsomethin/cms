'use strict';

define(['knockback', 'knockout', 'dispatcher', '../documentTypeForm', '../editor'], function (kb, ko, dispatcher, DocumentTypeForm, DocumentTypeEditor) {
	return kb.ViewModel.extend({
		constructor: function () {
			var self = this;
			this.documentTypeForm = new DocumentTypeForm();
			this.documentTypeEditor = new DocumentTypeEditor();

			//
			// Observables

			this.documentType = ko.observable();

			//
			// Event Handlers

			dispatcher.on('documentType:selected', function (e) {
				self.documentType(kb.viewModel(e.documentType));

				self.documentTypeForm.model(e.documentType);
				self.documentTypeForm.propertiesModel.model(e.documentType);

				self.documentTypeEditor.model(e.documentType);
			});
		}
	});
});