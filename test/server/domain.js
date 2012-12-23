'use strict';

var assert = require('assert'),
	should = require('should'),
	sinon = require('sinon'),
	_ = require('underscore'),
	config = require('../../server/config'),
	domainModule = require('../../server/domain');

var uuidRegex = /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/g,
	uuidReplacement = '00000000-0000-0000-0000-000000000000',
	schemaUriRegex = /"schemaUri":"urn:[a-zA-Z0-9]+#/g,
	schemaUriReplacement = '"schemaUri":"urn:SCHEMAURIPLACEHOLDER#';

var stubPersistence = (function() {
	var stubPersistence = {};

	stubPersistence.reset = function() {
		['documentTypes', 'documents', 'templates', 'pages', 'siteMaps'].forEach(function(name) {
			var stub = stubPersistence[name] = {};

			['create', 'read', 'update', 'del', 'readAll', 'filter'].forEach(function(name) {
				stub[name] = sinon.stub();
			});
		});
	};

	stubPersistence.reset();

	return stubPersistence;
}).call(this);

var compareErrors = function(error1, error2) {
	var normError = function(error) {
		return JSON.stringify(error)
			.replace(uuidRegex, uuidReplacement)
			.replace(schemaUriRegex, schemaUriReplacement);
	};

	normError(error1).should.equal(normError(error2));
};

var domain = domainModule(stubPersistence);

describe('domain', function() {
	beforeEach(function() {
		stubPersistence.reset();
	});

	//Document Types
	describe('.documentTypes', function() {
		describe('.create', function() {
			it('should call back with its input on success', function(done) {
				var documentType = _.clone(require('../mock/documentTypes/valid.json'));

				stubPersistence.documentTypes.create.callsArgWith(1, null, documentType);

				domain.documentTypes.create(documentType, function(error, result) {
					should.exist(result);
					result.should.equal(documentType);
					done();
				});
			});

			it('should call back with error on invalid input', function(done) {
				var documentType = _.clone(require('../mock/documentTypes/invalid.json')),
					invalidError = _.clone(require('../mock/documentTypes/error400.json'));

				domain.documentTypes.create(documentType, function(error, result) {
					should.exist(error);
					compareErrors(error, invalidError);
					done();
				});
			});
		});

		describe('.read', function() {
			it('should call back with a document type', function(done) {
				var documentType = _.clone(require('../mock/documentTypes/valid.json'));

				stubPersistence.documentTypes.read.callsArgWith(1, null, documentType);

				domain.documentTypes.read('DOCUMENTTYPEPLACEHOLDER', function(error, result) {
					should.exist(result);
					result.should.equal(documentType);
					done();
				});
			});

			it('should call back with error when not found', function(done) {
				var notFoundError = _.clone(require('../mock/documentTypes/error404.json'));

				stubPersistence.documentTypes.read.callsArgWith(1, null, null);

				domain.documentTypes.read('DOCUMENTTYPEPLACEHOLDER', function(error, result) {
					should.exist(error);
					compareErrors(error, notFoundError);
					done();
				});
			});
		});

		describe('.readAll', function() {
			it('should call back with an array', function(done) {
				stubPersistence.documentTypes.readAll.callsArgWith(0, null, []);

				domain.documentTypes.readAll(function(error, result) {
					should.exist(result);
					assert(Array.isArray(result));
					done();
				});
			});
		});

		describe('.update', function() {
			it('should call back with its input on success', function(done) {
				var documentType = _.clone(require('../mock/documentTypes/valid.json'));

				stubPersistence.documentTypes.update.callsArgWith(1, null, documentType);

				domain.documentTypes.update(documentType, function(error, result) {
					should.exist(result);
					result.should.equal(documentType);
					done();
				});
			});

			it('should call back with error on invalid input', function(done) {
				var documentType = _.clone(require('../mock/documentTypes/invalid.json')),
					invalidError = _.clone(require('../mock/documentTypes/error400.json'));

				domain.documentTypes.update(documentType, function(error, result) {
					should.exist(error);
					compareErrors(error, invalidError);
					done();
				});
			});
		});

		describe('.del', function() {
			it('should call back with nothing on success', function(done) {
				stubPersistence.documentTypes.del.callsArgWith(1, null, null);

				domain.documentTypes.del('DOCUMENTTYPEPLACEHOLDER', function(error, result) {
					should.not.exist(error);
					should.not.exist(result);
					done();
				});
			});
		});
	});

	//Documents
	describe('.documents', function() {
		describe('.create', function() {
			it('should call back with its input on success', function(done) {
				var documentType = _.clone(require('../mock/documentTypes/valid.json')),
					document = _.clone(require('../mock/documents/valid.json'));

				stubPersistence.documentTypes.read.callsArgWith(1, null, documentType);
				stubPersistence.documents.create.callsArgWith(1, null, document);

				domain.documents.create(document, function(error, result) {
					should.exist(result);
					result.should.equal(document);
					assert(stubPersistence.documentTypes.read.called);
					done();
				});
			});

			it('should call back with error on invalid input', function(done) {
				var documentType = _.clone(require('../mock/documentTypes/valid.json')),
					document = _.clone(require('../mock/documents/invalid.json')),
					invalidError = _.clone(require('../mock/documents/error400.json'));

				stubPersistence.documentTypes.read.callsArgWith(1, null, documentType);

				domain.documents.create(document, function(error, result) {
					should.exist(error);
					compareErrors(error, invalidError);
					assert(stubPersistence.documentTypes.read.called);
					done();
				});
			});

			it('should call back with error on missing document type', function(done) {
				var document = _.clone(require('../mock/documents/valid.json')),
					notFoundError = _.clone(require('../mock/documentTypes/error404.json'));

				stubPersistence.documentTypes.read.callsArgWith(1, null, null);

				domain.documents.create(document, function(error, result) {
					should.exist(error);
					compareErrors(error, notFoundError);
					assert(stubPersistence.documentTypes.read.called);
					done();
				});
			});
		});

		describe('.read', function() {
			it('should call back with a document', function(done) {
				var document = _.clone(require('../mock/documents/valid.json'));

				stubPersistence.documents.read.callsArgWith(1, null, document);

				domain.documents.read('DOCUMENTPLACEHOLDER', function(error, result) {
					should.exist(result);
					result.should.equal(document);
					done();
				});
			});

			it('should call back with error when not found', function(done) {
				var notFoundError = _.clone(require('../mock/documents/error404.json'));

				stubPersistence.documents.read.callsArgWith(1, null, null);

				domain.documents.read('DOCUMENTPLACEHOLDER', function(error, result) {
					should.exist(error);
					compareErrors(error, notFoundError);
					done();
				});
			});
		});

		describe('.filter', function() {
			it('should call back with an object when configured such', function(done) {
				stubPersistence.documents.filter.callsArgWith(1, null, {});

				domain.documents.filter({}, function(error, result) {
					should.exist(result);
					assert(!Array.isArray(result) && result instanceof Object);
					done();
				});
			});

			it('should call back with an array when configured such', function(done) {
				stubPersistence.documents.filter.callsArgWith(1, null, {});

				domain.documents.filter({isArray: true}, function(error, result) {
					should.exist(result);
					assert(Array.isArray(result));
					done();
				});
			});
		});

		describe('.update', function() {
			it('should call back with its input on success', function(done) {
				var documentType = _.clone(require('../mock/documentTypes/valid.json')),
					document = _.clone(require('../mock/documents/valid.json'));

				stubPersistence.documentTypes.read.callsArgWith(1, null, documentType);
				stubPersistence.documents.update.callsArgWith(1, null, document);

				domain.documents.update(document, function(error, result) {
					should.exist(result);
					result.should.equal(document);
					assert(stubPersistence.documentTypes.read.called);
					done();
				});
			});

			it('should call back with error on invalid input', function(done) {
				var documentType = _.clone(require('../mock/documentTypes/valid.json')),
					document = _.clone(require('../mock/documents/invalid.json')),
					invalidError = _.clone(require('../mock/documents/error400.json'));

				stubPersistence.documentTypes.read.callsArgWith(1, null, documentType);

				domain.documents.update(document, function(error, result) {
					should.exist(error);
					compareErrors(error, invalidError);
					assert(stubPersistence.documentTypes.read.called);
					done();
				});
			});

			it('should call back with error on missing document type', function(done) {
				var document = _.clone(require('../mock/documents/valid.json')),
					notFoundError = _.clone(require('../mock/documentTypes/error404.json'));

				stubPersistence.documentTypes.read.callsArgWith(1, null, null);

				domain.documents.update(document, function(error, result) {
					should.exist(error);
					compareErrors(error, notFoundError);
					assert(stubPersistence.documentTypes.read.called);
					done();
				});
			});
		});

		describe('.del', function() {
			it('should call back with nothing on success', function(done) {
				stubPersistence.documents.del.callsArgWith(1, null, null);

				domain.documents.del('DOCUMENTPLACEHOLDER', function(error, result) {
					should.not.exist(error);
					should.not.exist(result);
					done();
				});
			});
		});
	});

	//Templates
	describe('.templates', function() {
		describe('.create', function() {
			it('should call back with its input on success', function(done) {
				var documentType = _.clone(require('../mock/documentTypes/valid.json')),
					template = _.clone(require('../mock/templates/valid.json'));

				stubPersistence.documentTypes.read.callsArgWith(1, null, documentType);
				stubPersistence.templates.create.callsArgWith(1, null, template);

				domain.templates.create(template, function(error, result) {
					should.exist(result);
					result.should.equal(template);
					assert(stubPersistence.documentTypes.read.called);
					done();
				});
			});

			it('should call back with error on invalid input', function(done) {
				var template = _.clone(require('../mock/templates/invalid.json')),
					invalidError = _.clone(require('../mock/templates/error400.json'));

				domain.templates.create(template, function(error, result) {
					should.exist(error);
					compareErrors(error, invalidError);
					done();
				});
			});

			it('should call back with error on missing document type', function(done) {
				var template = _.clone(require('../mock/templates/valid.json')),
					notFoundError = _.clone(require('../mock/documentTypes/error404.json'));

				stubPersistence.documentTypes.read.callsArgWith(1, null, null);

				domain.documents.create(template, function(error, result) {
					should.exist(error);
					compareErrors(error, notFoundError);
					assert(stubPersistence.documentTypes.read.called);
					done();
				});
			});
		});

		describe('.filter', function() {
			it('should call back with an object when configured such', function(done) {
				stubPersistence.templates.filter.callsArgWith(1, null, {});

				domain.templates.filter({}, function(error, result) {
					should.exist(result);
					assert(!Array.isArray(result) && result instanceof Object);
					done();
				});
			});

			it('should call back with an array when configured such', function(done) {
				stubPersistence.templates.filter.callsArgWith(1, null, {});

				domain.templates.filter({isArray: true}, function(error, result) {
					should.exist(result);
					assert(Array.isArray(result));
					done();
				});
			});
		});

		describe('.read', function() {
			it('should call back with a template', function(done) {
				var template = _.clone(require('../mock/templates/valid.json'));

				stubPersistence.templates.read.callsArgWith(1, null, template);

				domain.templates.read('TEMPLATEPLACEHOLDER', function(error, result) {
					should.exist(result);
					result.should.equal(template);
					done();
				});
			});

			it('should call back with error when not found', function(done) {
				var notFoundError = _.clone(require('../mock/templates/error404.json'));

				stubPersistence.templates.read.callsArgWith(1, null, null);

				domain.templates.read('TEMPLATEPLACEHOLDER', function(error, result) {
					should.exist(error);
					compareErrors(error, notFoundError);
					done();
				});
			});
		});

		describe('.readAll', function() {
			it('should call back with an array', function(done) {
				stubPersistence.templates.readAll.callsArgWith(0, null, []);

				domain.templates.readAll(function(error, result) {
					should.exist(result);
					assert(Array.isArray(result));
					done();
				});
			});
		});

		describe('.update', function() {
			it('should call back with its input on success', function(done) {
				var documentType = _.clone(require('../mock/documentTypes/valid.json')),
					template = _.clone(require('../mock/templates/valid.json'));

				stubPersistence.documentTypes.read.callsArgWith(1, null, documentType);
				stubPersistence.templates.update.callsArgWith(1, null, template);

				domain.templates.update(template, function(error, result) {
					should.exist(result);
					result.should.equal(template);
					assert(stubPersistence.documentTypes.read.called);
					done();
				});
			});

			it('should call back with error on invalid input', function(done) {
				var template = _.clone(require('../mock/templates/invalid.json')),
					invalidError = _.clone(require('../mock/templates/error400.json'));

				domain.templates.update(template, function(error, result) {
					should.exist(error);
					compareErrors(error, invalidError);
					done();
				});
			});

			it('should call back with error on missing document type', function(done) {
				var template = _.clone(require('../mock/templates/valid.json')),
					notFoundError = _.clone(require('../mock/documentTypes/error404.json'));

				stubPersistence.documentTypes.read.callsArgWith(1, null, null);

				domain.documents.update(template, function(error, result) {
					should.exist(error);
					compareErrors(error, notFoundError);
					assert(stubPersistence.documentTypes.read.called);
					done();
				});
			});
		});

		describe('.del', function() {
			it('should call back with nothing on success', function(done) {
				stubPersistence.templates.del.callsArgWith(1, null, null);

				domain.templates.del('TEMPLATEPLACEHOLDER', function(error, result) {
					should.not.exist(error);
					should.not.exist(result);
					done();
				});
			});
		});
	});

	//Pages
	describe('.pages', function() {
		describe('.create', function() {
			it('should call back with its input on success', function(done) {
				var documentType = _.clone(require('../mock/documentTypes/valid.json')),
					template = _.clone(require('../mock/templates/valid.json')),
					page = _.clone(require('../mock/pages/valid.json'));

				stubPersistence.documentTypes.read.callsArgWith(1, null, documentType);
				stubPersistence.templates.read.callsArgWith(1, null, template);
				stubPersistence.pages.create.callsArgWith(1, null, page);

				domain.pages.create(page, function(error, result) {
					should.exist(result);
					result.should.equal(page);
					assert(stubPersistence.documentTypes.read.called);
					assert(stubPersistence.templates.read.calledThrice);
					done();
				});
			});

			it('should call back with error on invalid input', function(done) {
				var page = _.clone(require('../mock/pages/invalid.json')),
					invalidError = _.clone(require('../mock/pages/error400.json'));

				domain.pages.create(page, function(error, result) {
					should.exist(error);
					compareErrors(error, invalidError);
					done();
				});
			});

			it('should call back with error on missing document type', function(done) {
				var page = _.clone(require('../mock/pages/valid.json')),
					notFoundError = _.clone(require('../mock/documentTypes/error404.json'));

				stubPersistence.documentTypes.read.callsArgWith(1, null, null);

				domain.pages.create(page, function(error, result) {
					should.exist(error);
					compareErrors(error, notFoundError);
					assert(stubPersistence.documentTypes.read.called);
					done();
				});
			});

			it('should call back with error on missing template', function(done) {
				var page = _.clone(require('../mock/pages/valid.json')),
					notFoundError = _.clone(require('../mock/templates/error404.json'));

				stubPersistence.templates.read.callsArgWith(1, null, null);
				stubPersistence.pages.create.callsArgWith(1, null, page);

				domain.pages.create(page, function(error, result) {
					should.exist(error);
					compareErrors(error, notFoundError);
					assert(stubPersistence.templates.read.called);
					done();
				});
			});
		});

		describe('.read', function() {
			it('should call back with a page', function(done) {
				var page = _.clone(require('../mock/pages/valid.json'));

				stubPersistence.pages.read.callsArgWith(1, null, page);

				domain.pages.read('PAGEPLACEHOLDER', function(error, result) {
					should.exist(result);
					result.should.equal(page);
					done();
				});
			});

			it('should call back with error when not found', function(done) {
				var notFoundError = _.clone(require('../mock/pages/error404.json'));

				stubPersistence.pages.read.callsArgWith(1, null, null);

				domain.pages.read('PAGEPLACEHOLDER', function(error, result) {
					should.exist(error);
					compareErrors(error, notFoundError);
					done();
				});
			});
		});

		describe('.readAll', function() {
			it('should call back with an array', function(done) {
				stubPersistence.pages.readAll.callsArgWith(0, null, []);

				domain.pages.readAll(function(error, result) {
					should.exist(result);
					assert(Array.isArray(result));
					done();
				});
			});
		});

		describe('.update', function() {
			it('should call back with its input on success', function(done) {
				var documentType = _.clone(require('../mock/documentTypes/valid.json')),
					template = _.clone(require('../mock/templates/valid.json')),
					page = _.clone(require('../mock/pages/valid.json'));

				stubPersistence.documentTypes.read.callsArgWith(1, null, documentType);
				stubPersistence.templates.read.callsArgWith(1, null, template);
				stubPersistence.pages.update.callsArgWith(1, null, page);

				domain.pages.update(page, function(error, result) {
					should.exist(result);
					result.should.equal(page);
					assert(stubPersistence.documentTypes.read.called);
					assert(stubPersistence.templates.read.calledThrice);
					done();
				});
			});

			it('should call back with error on invalid input', function(done) {
				var page = _.clone(require('../mock/pages/invalid.json')),
					invalidError = _.clone(require('../mock/pages/error400.json'));

				domain.pages.update(page, function(error, result) {
					should.exist(error);
					compareErrors(error, invalidError);
					done();
				});
			});

			it('should call back with error on missing document type', function(done) {
				var page = _.clone(require('../mock/pages/valid.json')),
					notFoundError = _.clone(require('../mock/documentTypes/error404.json'));

				stubPersistence.documentTypes.read.callsArgWith(1, null, null);

				domain.pages.update(page, function(error, result) {
					should.exist(error);
					compareErrors(error, notFoundError);
					assert(stubPersistence.documentTypes.read.called);
					done();
				});
			});

			it('should call back with error on missing template', function(done) {
				var page = _.clone(require('../mock/pages/valid.json')),
					notFoundError = _.clone(require('../mock/templates/error404.json'));

				stubPersistence.templates.read.callsArgWith(1, null, null);
				stubPersistence.pages.update.callsArgWith(1, null, page);

				domain.pages.update(page, function(error, result) {
					should.exist(error);
					compareErrors(error, notFoundError);
					assert(stubPersistence.templates.read.called);
					done();
				});
			});
		});

		describe('.del', function() {
			it('should call back with nothing on success', function(done) {
				stubPersistence.pages.del.callsArgWith(1, null, null);

				domain.pages.del('PAGEPLACEHOLDER', function(error, result) {
					should.not.exist(error);
					should.not.exist(result);
					done();
				});
			});
		});
	});
});