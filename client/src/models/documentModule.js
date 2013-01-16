'use strict';

define(['backbone', 'exports'], function (backbone, exports) {
define(['underscore', 'backbone', 'exports'], function (_, backbone, exports) {

	//
	// Property

	var Property = exports.Property = backbone.Model.extend({
		defaults: {
			name: '',
			type: 'object',
			required: false
		}
	});

	//
	// PropertyCollection

	var PropertyCollection = exports.PropertyCollection = backbone.Collection.extend({
		model: Property
	});

	//
	// DocumentType

	var DocumentType = exports.DocumentType = backbone.Model.extend({
		defaults: {
			id: '',
			name: '',
			type: 'object',
			additionalProperties: false,
			properties: new PropertyCollection()
		},

		}
	});

	//
	// DocumentTypeCollection

	var DocumentTypeCollection = exports.DocumentTypeCollection = backbone.Collection.extend({
		model: DocumentType,
		url: '/services/documentTypes'
	});

	//
	// Document

	var Document = exports.Document = backbone.Model.extend({
		defaults: {
			id: '',
			name: ''
		}
	});

	//
	// DocumentCollection

	var DocumentCollection = exports.DocumentCollection = backbone.Collection.extend({
		model: Document
	});

	//
	// DocumentCollectionMetadata

	var DocumentCollectionMetadata = exports.DocumentCollectionMetadata = backbone.Model.extend({
		defaults: {
			id: '',
			name: ''
		}
	})

	//
	// DocumentCollectionMetadataCollection

	var DocumentCollectionMetadataCollection = exports.DocumentCollectionMetadataCollection = backbone.Collection.extend({
		model: DocumentCollectionMetadata
	})
});