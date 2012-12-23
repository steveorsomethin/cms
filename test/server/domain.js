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

var mockPersistence = (function() {
	var mockPersistence = {};

	mockPersistence.reset = function() {
		['documentTypes', 'documents', 'templates', 'pages', 'siteMaps'].forEach(function(name) {
			var mock = mockPersistence[name] = {};

			['create', 'read', 'update', 'del', 'readAll', 'filter'].forEach(function(name) {
				mock[name] = sinon.stub();
			});
		});
	};

	mockPersistence.reset();

	return mockPersistence;
}).call(this);

var compareErrors = function(error1, error2) {
	var normError = function(error) {
		return JSON.stringify(error)
			.replace(uuidRegex, uuidReplacement)
			.replace(schemaUriRegex, schemaUriReplacement);
	};

	normError(error1).should.equal(normError(error2));
};

var domain = domainModule(mockPersistence);

describe('domain.documentTypes', function() {
	beforeEach(function() {
		mockPersistence.reset();
	});

	describe('#create', function() {
		it('should return its input on success', function() {
			var documentType = _.clone(require('../mock/documentTypes/valid.json'));

			domain.documentTypes.create(documentType, function(error, result){
				should.exist(result);
				result.should.equal(documentType);
			});

			mockPersistence.documentTypes.create.callsArgWith(1, null, documentType);
		});

		it('should return error on invalid input', function() {
			var documentType = _.clone(require('../mock/documentTypes/invalid.json')),
				invalidError = _.clone(require('../mock/documentTypes/error400.json'));

			domain.documentTypes.create(documentType, function(error, result) {
				should.exist(error);
				compareErrors(error, invalidError);
			});

			mockPersistence.documentTypes.create.callsArgWith(1, null, null);
		});
	});

	describe('#read', function() {
		it('should return a document type', function() {
			var documentType = _.clone(require('../mock/documentTypes/valid.json'));
			domain.documentTypes.read('DOCUMENTTYPEPLACEHOLDER', function(error, result) {
				should.exist(error);
				compareErrors(error, notFoundError);
			});

			mockPersistence.documentTypes.read.callsArgWith(1, null, documentType);
		});

		it('should return error when not found', function() {
			var notFoundError = _.clone(require('../mock/documentTypes/error404.json'));
			domain.documentTypes.read('DOCUMENTTYPEPLACEHOLDER', function(error, result) {
				should.exist(error);
				compareErrors(error, notFoundError);
			});

			mockPersistence.documentTypes.read.callsArgWith(1, null, null);
		});
	});

	describe('#update', function() {
		it('should return its input on success', function() {
			var documentType = _.clone(require('../mock/documentTypes/valid.json'));

			domain.documentTypes.update(documentType, function(error, result){
				should.exist(result);
				result.should.equal(documentType);
			});

			mockPersistence.documentTypes.update.callsArgWith(1, null, documentType);
		});

		it('should return error on invalid input', function() {
			var documentType = _.clone(require('../mock/documentTypes/invalid.json')),
				invalidError = _.clone(require('../mock/documentTypes/error400.json'));

			domain.documentTypes.update(documentType, function(error, result) {
				should.exist(error);
				compareErrors(error, invalidError);
			});

			mockPersistence.documentTypes.update.callsArgWith(1, null, null);
		});
	});

	describe('#del', function() {
		it('should return nothing', function() {
			domain.documentTypes.del('DOCUMENTTYPEPLACEHOLDER', function(error, result) {
				should.not.exist(error);
				should.not.exist(result);
			});

			mockPersistence.documentTypes.read.callsArgWith(1, null, null);
		});
	});
});