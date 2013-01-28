'use strict';

define(['backbone', 'exports'], function (backbone, exports) {

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