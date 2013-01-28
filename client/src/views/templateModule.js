'use strict';

define(['knockout', 'knockback', 'dispatcher', '../context/templateModule', './shared/editor'], function (ko, kb, dispatcher, context, EditorViewModel) {

	//
	// LayoutTemplateInspectorViewModel

	var LayoutTemplateInspectorViewModel = kb.ViewModel.extend({
		constructor: function (model) {
			kb.ViewModel.prototype.constructor.call(this, model, {
				keys: ['layoutTemplate']
			});
		}
	});

	//
	// DataTemplateInspectorViewModel

	var DataTemplateInspectorViewModel = kb.ViewModel.extend({
		constructor: function (model) {
			kb.ViewModel.prototype.constructor.call(this, model, {
				keys: ['dataTemplate']
			});
		}
	});

	//
	// LayoutTemplateExplorerViewModel

	var LayoutTemplateExplorerViewModel = kb.ViewModel.extend({
		constructor: function (model) {
			kb.ViewModel.prototype.constructor.call(this, model, {
				keys: ['layoutTemplate']
			});

			this.item = this.layoutTemplate;
			this.items = kb.collectionObservable(model.get('templates'), {
				filters: function (t) {
					return t.get('isLayout') === false;
				}
			});

			this.inspector = { name: 'layoutTemplateInspector', src: 'src/views', model: new LayoutTemplateInspectorViewModel(model) };

			return this;
		},

		selectItem: function (item) {
			dispatcher.trigger('layoutTemplate:select', { 'template': item.model() });
		},

		createItem: function () {
			dispatcher.trigger('layoutTemplate:create', {
				defaults: { name: 'New Layout', isLayout: true }
			});
		},

		deleteItem: function () {

		},

		refresh: function () {
			dispatcher.trigger('templates:load');
		}
	});

	//
	// DataTemplateExplorerViewModel

	var DataTemplateExplorerViewModel = kb.ViewModel.extend({
		constructor: function (model) {
			kb.ViewModel.prototype.constructor.call(this, model, {
				keys: ['dataTemplate']
			});

			this.item = this.dataTemplate;
			this.items = kb.collectionObservable(model.get('templates'), {
				filters: function (t) {
					return t.get('isLayout') === true;
				}
			});

			this.inspector = { name: 'dataTemplateInspector', src: 'src/views', model: new DataTemplateInspectorViewModel(model) };
			//this.inspector.model.setMode('html');

			return this;
		},

		selectItem: function (item) {
			dispatcher.trigger('dataTemplate:select', { 'template': item.model() });
		},

		createItem: function () {
			dispatcher.trigger('dataTemplate:create', {
				defaults: { name: 'New Data Template', isLayout: false }
			});
		},

		deleteItem: function () {

		},

		refresh: function () {
			dispatcher.trigger('templates:load');
		}
	});

	//
	// TemplateModuleNavigatorViewModel

	var TemplateModuleNavigatorViewModel = kb.ViewModel.extend({
		constructor: function (model) {
			var self = this;
			var layoutExplorer = new LayoutTemplateExplorerViewModel(model);
			var dataTemplateExplorer = new DataTemplateExplorerViewModel(model);

			//
			// Explorers

			this.explorers = [
				{
					anchor: 'layouts',
					name: 'Layouts',
					icon: 'content/images/48/window.png',
					isActive: ko.observable(true),
					model: layoutExplorer,
					contextMenu: { name: 'layoutExplorerContextMenu', src: 'src/views/menus', model: layoutExplorer }
				},
				{
					anchor: 'templates',
					name: 'Data Templates',
					icon: 'content/images/48/window_sel.png',
					isActive: ko.observable(false),
					model: dataTemplateExplorer,
					contextMenu: { name: 'dataTemplateExplorerContextMenu', src: 'src/views/menus', model: dataTemplateExplorer }
				}
			];

			//
			// Active ContextMenu

			this.contextMenu = ko.computed(function () {
				//var explorersArray = self.explorers();

				for (var i = 0; i < self.explorers.length; i++) {
					if (self.explorers[i].isActive()) return self.explorers[i].contextMenu;
				};

			}, this);

			//
			// Active Inspector

			this.inspector = ko.computed(function () {
				//var explorersArray = self.explorers();

				for (var i = 0; i < self.explorers.length; i++) {
					if (self.explorers[i].isActive()) return self.explorers[i].model.inspector;
				};

			}, this);

			//
			// Event Hanlders

			dispatcher.on('explorer:activate', function (e) {
				ko.utils.arrayForEach(self.explorers, function (item) {
					item.isActive(false);
				});

				e.explorer.isActive(true);
				e.explorer.model.refresh();
			});

			//
			// Initialize

			self.explorers[0].model.refresh();

			return this;
		},

		selectExplorer: function (explorer) {
			dispatcher.trigger('explorer:activate', { 'explorer': explorer });
		}
	});

	//
	// TemplateInspectorViewModel

	var TemplateInspectorViewModel = kb.ViewModel.extend({
		constructor: function (model) {
			kb.ViewModel.prototype.constructor.call(this, model, {

			});
		}
	});

	//
	// TemplateModuleViewModel

	return kb.ViewModel.extend({
		constructor: function () {
			this.view = { name: 'templateModule', src: 'src/views', model: this };
			this.navigator = new TemplateModuleNavigatorViewModel(context);

			return this;
		}
	});
});