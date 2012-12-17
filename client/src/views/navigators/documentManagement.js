'use strict';

define(['knockout', 'knockback', 'dispatcher'], function (ko, kb, dispatcher) {

	var DocumentTypeExplorerViewModel = kb.ViewModel.extend({
		constructor: function (model) {
			kb.ViewModel.prototype.constructor.call(this, model, {
				keys: ['documentType', 'documentTypes']
			});

			this.id = 'types';
			this.path = '#types';

			this.name = 'Document Types';
			this.icon = 'content/images/48/document.png';

			this.item = this.documentType;
			this.items = this.documentTypes;

			this.isSelected = ko.observable(true);
		},

		refresh: function () {
			dispatcher.trigger('documentTypes:load');
		},

		selectItem: function (item) {
			dispatcher.trigger('documentType:selected', { documentType: item.model() });
		}
	});

	var DocumentCollectionExplorerViewModel = kb.ViewModel.extend({
		constructor: function (model) {
			kb.ViewModel.prototype.constructor.call(this, model, {
				keys: ['documentCollection', 'documentCollections']
			});

			this.id = 'collections';
			this.path = '#collections';

			this.name = 'Collections';
			this.icon = 'content/images/48/database.png';

			this.item = this.documentCollection;
			this.items = this.documentCollections;

			this.isSelected = ko.observable(false);
		},

		refresh: function () {
			dispatcher.trigger('documentCollections:load');
		},

		selectItem: function () {

		}
	});

	return kb.ViewModel.extend({
		constructor: function (model) {
			kb.ViewModel.prototype.constructor.call(this, model, {
				keys: ['documentTypes', 'documentCollections'],
				//factories: {
				//	'model.documentTypes': 'DocumentTypeExplorerViewModel',
				//	'model.documentCollections': 'DocumentCollectionExplorerViewModel'
				//}
			});

			this.explorers = [
				new DocumentTypeExplorerViewModel(this.documentTypes),
				new DocumentCollectionExplorerViewModel(this.documentCollections)
			]

			this.explorers[0].refresh();

			return this;
		},

		selectExplorer: function (explorer) {
			explorer.refresh();
		}
	});
});