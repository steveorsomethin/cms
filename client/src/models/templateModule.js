'use strict';

define(['backbone', 'exports'], function (backbone, exports) {

	//
	// DataTemplate

	var DataTemplate = exports.DataTemplate =  backbone.Model.extend({
		defaults: {
			id: '',
			name: '',
			documentType: '',
			body: ''
		}
	});

	//
	// DataTemplateCollection

	var DataTemplateCollection = exports.DataTemplateCollection = backbone.Collection.extend({
		model: DataTemplate,
		url: '/services/templates'
	});

	//
	// LayoutTemplate

	var LayoutTemplate = exports.LayoutTemplate =  backbone.Model.extend({
		defaults: {
			id: '',
			name: '',
			body: '<!DOCTYPE html>\n<html>\n	<head>\n	</head>\n	<body>\n 	</body>\n</html>'
		}
	});

	//
	// LayoutTemplateCollection

	var LayoutTemplateCollection = exports.LayoutTemplateCollection = backbone.Collection.extend({
		model: LayoutTemplate,
		url: '/services/templates'
	});

	//
	// Template

	var Template = exports.Template = backbone.Model.extend({
		defaults: {
			id: '',
			name: '',
			documentType: '',
			body: '',
			isLayout: false
		}
	}, {
		defaultLayoutTemplate: function () {
			return new Template({
				name: 'New Layout',
				body: '<!DOCTYPE html>\n<html>\n	<head>\n	</head>\n	<body>\n 	</body>\n</html>',
				isLayout: 'true'
			});
		},

		defaultDataTemplate: function () {
			return new Template({
				name: 'New Data Template',
				body: '',
				isLayout: 'false'
			});
		}
	});

	//
	// TemplateCollection

	var TemplateCollection = exports.TemplateCollection = backbone.Collection.extend({
		model: Template,
		url: '/services/templates'
	});
});