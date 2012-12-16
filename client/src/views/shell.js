'use strict';

define(['knockout', 'knockback', 'dispatcher', '../context/shell', '../controllers/shell'], function (ko, kb, dispatcher, context, controller) {

	var ModuleViewModel = kb.ViewModel.extend({
		constructor: function (model) {
			kb.ViewModel.prototype.constructor.apply(this, arguments);

			var self = this;

			if (self.id) {
				self.view = ko.computed(function () {
					return { name: self.id(), src: 'src/views', model: self };
				})
			}

			return this;
		}
	});

	var ShellViewModel = kb.ViewModel.extend({
		constructor: function (model) {
			kb.ViewModel.prototype.constructor.apply(this, arguments);

			this.view = { name: 'shell', src: 'src/views', model: this };
			this.navigator = { name: 'shellNavigator', src: 'src/views/navigators', model: this };

			return this;
		},

		selectModule: function (module) {
			dispatcher.trigger('module:selected', { 'module': module.model() });
		}
	}, {
		start: function (element) {
			var viewModel = new ShellViewModel(context, {
				factories: {
					'module': ModuleViewModel,
					'modules.models': ModuleViewModel
				}
			});

			kb.applyBindings(viewModel, element);
		}
	});

	return ShellViewModel;
});