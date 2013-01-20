'use strict';

define(['knockout', 'knockback', 'dispatcher', '../context/documentModule'], function (ko, kb, dispatcher, context) {

	//
	// DocumentTypeItemViewModel

	var DocumentTypeItemViewModel = kb.ViewModel.extend({
		constructor: function (model) {
			kb.ViewModel.prototype.constructor.call(this, model, {
				keys: ['id', 'name']
			});
		}
	});

	//
	// DocumentTypeFormViewModel

	var DocumentTypeFormViewModel = kb.ViewModel.extend({
		constructor: function (model) {
			kb.ViewModel.prototype.constructor.call(this, model);

			var self = this;

			self.triggerAddProperty = ko.observable(false);
			self.triggerAddProperty.subscribe(function (value) {
				if (value === true) {
					dispatcher.trigger('documentType:addProperty', { 'property': { name: '', type: 'object', required: false } });
				}
			});
		}
	});

	//
	// DocumentTypeInspectorViewModel

	var DocumentTypeInspectorViewModel = kb.ViewModel.extend({
		constructor: function (model) {
			kb.ViewModel.prototype.constructor.call(this, model, {
				keys: ['documentType'],
				factories: {
					'documentType': DocumentTypeFormViewModel
				}
			});

			this.views = [
				{
					anchor: 'editor',
					name: 'Editor',
					icon: 'content/images/48/window.png',
					template: {
						name: 'documentTypeForm',
						src: 'src/views',
						model: this.documentType
					}
				},
				{
					anchor: 'metadata',
					name: 'Metadata',
					icon: 'content/images/48/gear.png'
				}
			];
		}
	});

	//
	// DocumentTypeExplorerViewModel

	var DocumentTypeExplorerViewModel = kb.ViewModel.extend({
		constructor: function (model) {
			kb.ViewModel.prototype.constructor.call(this, model, {
				keys: ['documentType', 'documentTypes'],
				factories: {
					'documentTypes.models': DocumentTypeItemViewModel
				}
			});

			this.item = this.documentType;
			this.items = this.documentTypes;
			this.inspector = new DocumentTypeInspectorViewModel(model);
		},

		selectItem: function (item) {
			dispatcher.trigger('documentType:select', { 'documentType': item.model() });
		},

		createItem: function () {
			dispatcher.trigger('documentType:create', { 'documentType': { name: 'New Document Type'} });
		},

		deleteItem: function (item) {
			// TODO: delete the selected item from the module context
		},

		refresh: function () {
			dispatcher.trigger('documentTypes:load');
		}
	});

	//
	// DocumentCollectionInspectorViewModel

	var DocumentCollectionInspectorViewModel = kb.ViewModel.extend({
		constructor: function (model) {
			kb.ViewModel.prototype.constructor.call(this, model, {
				keys: ['documentCollection']
			});

			this.views = [
				{
					anchor: 'contents',
					name: 'Contents',
					icon: 'content/images/48/list.png'
				},
				{
					anchor: 'metadata',
					name: 'Metadata',
					icon: 'content/images/48/gear.png'
				}
			];
		}
	});

	//
	// DocumentCollectionExplorerViewModel

	var DocumentCollectionExplorerViewModel = kb.ViewModel.extend({
		constructor: function (model) {
			kb.ViewModel.prototype.constructor.call(this, model, {
				keys: ['documentCollections']
			});

			var self = this;
			this.items = this.documentCollections;
			this.inspector = new DocumentCollectionInspectorViewModel(model);
		},

		selectItem: function (item) {
			// TODO: set the selected item in the module context
		},

		createItem: function () {
			// TODO: create a new item in the module context
		},

		deleteItem: function (item) {
			// TODO: delete the selected item from the module context
		},

		refresh: function () {
			dispatcher.trigger('documentCollections:load');
		}
	});

	//
	// DocumentManagementNavigatorViewModel

	var DocumentManagementNavigatorViewModel = kb.ViewModel.extend({
		constructor: function (model) {
			var self = this;
			var typeExplorer = new DocumentTypeExplorerViewModel(model);
			var collectionExplorer = new DocumentCollectionExplorerViewModel(model);

			this.explorers = ko.observableArray([{
					anchor: 'types',
					name: 'Document Types',
					icon: 'content/images/48/document.png',
					isActive: ko.observable(true),
					model: typeExplorer,
					contextMenu: { name: 'documentTypeExplorerContextMenu', src: 'src/views/menus', model: typeExplorer }
				},
				{
					anchor: 'collections',
					name: 'Collections',
					icon: 'content/images/48/database.png',
					isActive: ko.observable(false),
					model: collectionExplorer,
					contextMenu: { name: 'documentCollectionExplorerContextMenu', src: 'src/views/menus', model: collectionExplorer }
				}
			]);

			this.contextMenu = ko.computed(function () {
				var explorersArray = self.explorers();

				for (var i = 0; i < explorersArray.length; i++) {
					if (explorersArray[i].isActive()) return explorersArray[i].contextMenu;
				};

			}, this);

			this.inspector = ko.computed(function () {
				var explorersArray = self.explorers();

				for (var i = 0; i < explorersArray.length; i++) {
					if (explorersArray[i].isActive()) return explorersArray[i].model.inspector;
				};

			}, this);

			dispatcher.on('explorer:activate', function (e) {
				ko.utils.arrayForEach(self.explorers(), function (item) {
					item.isActive(false);
				});

				e.explorer.isActive(true);
				e.explorer.model.refresh();
			});

			this.explorers()[0].model.refresh();

			return this;
		},

		selectExplorer: function (explorer) {
			dispatcher.trigger('explorer:activate', { 'explorer': explorer });
		}
	});

	//
	// DocumentManagementViewModel

	var DocumentManagementViewModel = kb.ViewModel.extend({
		constructor: function () {

			this.view = { name: 'documentModule', src: 'src/views', model: this };
			this.navigator = new DocumentManagementNavigatorViewModel(context);
			
			return this;
		}
	});

	return DocumentManagementViewModel;
});