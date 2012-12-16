'use strict';

define(['backbone', 'exports'], function (backbone, exports) {

	//
	// DocumentType

	var DocumentType = exports.DocumentType = backbone.Model.extend({
		defaults: {
			id: '',
			name: '',
			type: 'object',
			additionalProperties: false
		}
	});

	//
	// DocumentTypeCollection

	var DocumentTypeCollection = exports.DocumentTypeCollection = backbone.Collection.extend({
		model: DocumentType,
		url: '/documentTypes'
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