'use strict';

define(['knockout', 'knockback', 'EventBus'], function (ko, kb, dispatcher) {

	//
	// DataTemplateExplorerViewModel

	var DataTemplateExplorerViewModel = kb.ViewModel.extend({
		constructor: function (collection) {

			this.id = 'data';
			this.path = '#data';

			this.name = 'Data Templates';
			this.icon = 'content/images/48/window_sel.png';
			this.items = collection;

			this.isSelected = ko.observable(true);
		},

		refresh: function () {
			dispatcher.trigger('dataTemplates:load');
		}
	});

	//
	// LayoutTemplateExplorerViewModel

	var LayoutTemplateExplorerViewModel = kb.ViewModel.extend({
		constructor: function (collection) {

			this.id = 'layout';
			this.path = '#layout';

			this.name = 'Layout Templates';
			this.icon = 'content/images/48/window.png';
			this.items = collection;

			this.isSelected = ko.observable(false);
		},

		refresh: function () {
			dispatcher.trigger('layoutTemplates:load');
		}
	});

	//
	// TemplateManagementNavigatorViewModel

	return kb.ViewModel.extend({
		constructor: function (model) {
			kb.ViewModel.prototype.constructor.call(this, model, {
				keys: ['dataTemplates', 'layoutTemplates']
			});

			this.explorers = [
				new DataTemplateExplorerViewModel(this.dataTemplates),
				new LayoutTemplateExplorerViewModel(this.layoutTemplates)
			];

			this.explorers[0].refresh();

			return this;
		},

		selectExplorer: function (explorer) {
			explorer.refresh();
		}
	})
});