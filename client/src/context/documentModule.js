'use strict';

define(['backbone', '../models/documentModule'], function (backbone, model) {

	var DocumentManagementContext = backbone.Model.extend({
		initialize: function () {
			var defaultDocumentType = new model.DocumentType({ name: 'New Document Type'});
			var defaultDocumentTypeCollection = new model.DocumentTypeCollection();

			var defaultDocumentCollectionMetadata = new model.DocumentCollectionMetadata({ name: 'New Documents'});
			var defaultDocumentCollectionMetadataCollection = new model.DocumentCollectionMetadataCollection()

			//
			// DocumentType State

			this.set('documentType', new model.DocumentType());
			this.set('documentTypes', defaultDocumentTypeCollection);

			//
			// DocumentCollection State

			this.set('documentCollectionMetadata', defaultDocumentCollectionMetadata);
			this.set('documentCollectionMetadataCollections', defaultDocumentCollectionMetadataCollection);

			//
			// Document State

			this.set('document', null);

			return this;
		}
	});

	return new DocumentManagementContext();
});