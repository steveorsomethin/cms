'use strict';

define(['backbone', '../models/application', '../views/viewModelFactory'], function (backbone, model, factory) {

	var ShellContext = backbone.Model.extend({
		initialize: function () {

			//
			// Model Properties

			this.set('module', new model.ModuleMetadata({ id: 'sitemap', name: 'Sitemap', route: 'sitemap', icon: 'content/images/48/tree.png' }));
			this.set('modules', new model.ModuleMetadataCollection());
			this.set('viewModel', undefined);

			//
			// Model Event Handlers

			this.on('change:module', function (model, value) {
				if (factory.hasPath(value.get('id'))) {
					var Creator = factory.creatorForPath(model, value.get('id'));

					this.set('viewModel', new Creator());
				}
			});
		}
	});

	return new ShellContext();
});