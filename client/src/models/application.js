'use strict';

define(['common', 'exports'], function (common, exports) {
	var backbone = common.get('backbone');

	//
	// Module

	var Module = exports.Module = backbone.Model.extend({
		defaults: {
			id: '',
			name: '',
			route: ''
		}
	}, {
		default: function () {
			return new Module();
		}
	});

	//
	// ModuleCollection

	var ModuleCollection = exports.ModuleCollection = backbone.Collection.extend({
		model: Module,

		initialize: function () {
			this.add({ id: 'sitemap', name: 'Sitemap', route: 'sitemap', icon: 'content/images/48/tree.png' });
			this.add({ id: 'documentManagement', name: 'Document Management', route: 'documents', icon: 'content/images/48/documents.png' });
			this.add({ id: 'templateManagement', name: 'Layouts and Templates', route: 'templates', icon: 'content/images/48/window_sel.png' });
		}
	}, {
		default: function () {
			return new ModuleCollection();
		}
	})
})