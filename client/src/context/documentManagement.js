'use strict';

define(['backbone', '../models/documentManagement'], function (backbone, model) {

	var DocumentManagementContext = backbone.Model.extend({
		initialize: function () {
			var defaultDocumentType = new model.DocumentType({ name: 'New Document Type'});
			var defaultDocumentTypeCollection = new model.DocumentTypeCollection([defaultDocumentType]);

			var defaultDocumentCollectionMetadata = new model.DocumentCollectionMetadata({ name: 'New Documents'});
			var defaultDocumentCollectionMetadataCollection = new model.DocumentCollectionMetadataCollection([defaultDocumentCollectionMetadata])

			//
			// DocumentType State

			this.set('documentType', defaultDocumentType);
			this.set('documentTypes', defaultDocumentTypeCollection);

			//
			// DocumentCollection State

			this.set('documentCollectionMetadata', defaultDocumentCollectionMetadata);
			this.set('documentCollections', defaultDocumentCollectionMetadataCollection);

			//
			// Document State

			this.set('document', null);

			return this;
		}
	});

	return new DocumentManagementContext();
});