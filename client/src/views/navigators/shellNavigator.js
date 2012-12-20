'use strict';

define(['knockout', 'knockback', 'backbone', 'dispatcher'], function (ko, kb, backbone, dispatcher) {

	//
	// NavigationOption

	var NavigationOption = backbone.Model.extend({
		defaults: {
			id: '',
			name: '',
			icon: ''
		}
	});

	//
	// NavigationOptionCollection

	var NavigationOptionCollection = backbone.Collection.extend({
		model: NavigationOption
	});

	//
	// ShellNavigator

	var ShellNavigator = kb.ViewModel.extend({
		constructor: function () {
			var self = this;
			var _modules = new NavigationOptionCollection([
				{ id: 'sitemap', name: 'Sitemap', icon: 'content/images/48/tree.png' },
				{ id: 'documents', name: 'Document Management', icon: 'content/images/48/documents.png' },
				{ id: 'templates', name: 'Layouts and Templates', icon: 'content/images/48/window_sel.png' },
				{ id: 'media', name: 'Media', icon: 'content/images/48/pictures.png' },
				{ id: 'settings', name: 'Settings', icon: 'content/images/48/gears.png' }
			]);

			//
			// UI Properties

			this.name = 'shellNavigator';
			this.view = 'src/views/navigators';
			this.model = this;

			//
			// Other Properties

			this.module = ko.observable(_modules.get('documents').toJSON());
			this.modules = kb.collectionObservable(_modules);

			//
			// Event Handlers

			dispatcher.on('module:selected', function (e) {
				self.module(e.toJSON());
			});

			dispatcher.on('router:navigated', function (e) {
				self.module(_modules.get(e.fragment).toJSON());
			});
		},

		selectModule: function (e) {
			dispatcher.trigger('module:selected', e.model());
		}
	});

	//
	// Export

	return ShellNavigator;
});