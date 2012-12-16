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
		url: '/templates'
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
		model: LayoutTemplate
	});
});