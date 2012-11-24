'use strict';

define(['underscore', 'backbone'], function(_, backbone) {
	var exports = {};

	var Property = exports.Property = backbone.Model.extend({
		defaults: {
			name: '',
			type: 'string',
			required: false
		}
	});

	var PropertyCollection = exports.PropertyCollection = backbone.Collection.extend({
		model: Property
	});

	var DocumentType = exports.DocumentType = backbone.Model.extend({
		initialize: function() {
			var rawProperties = this.get('properties'),
				pairs = _.pairs(rawProperties),
				propertyArray = _.map(pairs, function(pair) {
					pair[1].name = pair[0];
					return new Property(pair[1]);
				});

			this.on('change:name', function() {
				this.set('id', this.get('name'));
			});
			this.trigger('change:name');
			
			this.set('properties', new PropertyCollection(propertyArray));
		},

		toJSON: function() {
			var i = 0, 
				json = _.clone(this.attributes),
				properties = this.get('properties'),
				property;

			json.properties = {};
			for (i = 0; i < properties.length; i++) {
				property = properties.at(i);
				json.properties[property.get('name')] = 
					{type: property.get('type'), required: property.get('required')};
			}
			
			return json;
		},

		defaults: {
			name: '',
			type: 'object',
			additionalProperties: false
		}
	});

	var DocumentTypeCollection = exports.DocumentTypeCollection = backbone.Collection.extend({
		model: DocumentType
	});

	var Template = exports.Template =  backbone.Model.extend({
		defaults: {
			name: '',
			documentType: '',
			body: '<!DOCTYPE html>\n<html>\n	<head>\n	</head>\n	<body>\n 	</body>\n</html>'
		}
	});

	var TemplateCollection = exports.TemplateCollection = backbone.Collection.extend({
		model: Template
	});

	return exports;
});
