'use strict';

define(['knockout', 'knockback', 'dispatcher'], function (ko, kb, dispatcher) {

	//
	// DocumentTypeExplorerViewModel

	var DocumentTypeExplorerViewModel = kb.ViewModel.extend({
		constructor: function (model) {
			kb.ViewModel.prototype.constructor.call(this, model, {
				keys: ['documentType', 'documentTypes']
			});

			this.item = this.documentType;
			this.items = this.documentTypes;

			this.tab = { name: 'Document Types', path: 'types', icon: 'content/images/48/document.png' },
			this.contextMenu = { name: 'documentTypeContextMenu', src: 'src/views/navigators', model: this }

			this.isSelected = ko.observable(true);
		},

		refresh: function () {
			dispatcher.trigger('documentTypes:load');
		},

		selectItem: function (item) {
			dispatcher.trigger('documentType:selected', { documentType: item.model() });
		}
	});

	//
	// DocumentCollectionExplorerViewModel

	var DocumentCollectionExplorerViewModel = kb.ViewModel.extend({
		constructor: function (model) {
			kb.ViewModel.prototype.constructor.call(this, model, {
				keys: ['documentCollection', 'documentCollections']
			});

			this.item = this.documentCollection;
			this.items = this.documentCollections;

			this.tab = { name: 'Document Collections', path: 'collections', icon: 'content/images/48/database.png' };
			this.contextMenu = { name: 'documentCollectionContextMenu', src: 'src/views/navigators', data: this };

			this.isSelected = ko.observable(false);
		},

		refresh: function () {
			dispatcher.trigger('documentCollections:load');
		},

		selectItem: function () {

		}
	});

	//
	// DocumentManagementViewModel

	return kb.ViewModel.extend({
		constructor: function (model) {

			this.explorers = [
				new DocumentTypeExplorerViewModel(model),
				new DocumentCollectionExplorerViewModel(model)
			]

			this.explorers[0].refresh();

			return this;
		},

		selectExplorer: function (explorer) {
			explorer.refresh();
		}
	});
});