'use strict';

var util = require('util'),
	express = require('express'),
	domain = require('../domain'),
	model = require('../domain/model'),
	errors = require('../errors'),
	persistence = require('../persistence'),
	redisPersistence = require('../persistence/redis');

var httpResources = module.exports = {};

//HTTP status codes
var OK = 200,
	CREATED = 201,
	ACCEPTED = 202,
	NO_CONTENT = 204,
	BAD_REQUEST = 400,
	UNAUTHORIZED = 401,
	FORBIDDEN = 403,
	NOT_FOUND = 404;

var errorMap = (function() {
	var errorMap = {};

	var mapError = function(error, statusCode) {
		if (errorMap[error]) {
			throw new Error(util.format('Error %s is already mapped', error));
		}

		errorMap[error] = statusCode;
	};
	
	mapError(errors.ResourceNotFound.type, NOT_FOUND);
	mapError(errors.ResourceExists.type, BAD_REQUEST);
	mapError(errors.InvalidInput.type, BAD_REQUEST);

	return errorMap;
})();

var sendError = function(error, response) {
	var status = error.name && errorMap[error.name] ? errorMap[error.name] : 500;
	console.log(error);
	response.status(status).send(error.toString());
};

//TODO: Blow this out to inspect Accept headers and serialize appropriately
var sendResponse = function(error, body, successCode, response) {
	if (error) {
		return sendError(error, response);
	} else {
		return response.status(successCode).send(body);
	}
};

var 
	putHandler = function(response) {
		return function(error, result) {
			sendResponse(error, result, CREATED, response);
		};
	},

	getHandler = function(response) {
		return function(error, result) {
			sendResponse(error, result, OK, response);
		};
	},

	postHandler = function(response) {
		return function(error, result) {
			sendResponse(error, result, ACCEPTED, response);
		};
	},

	deleteHandler = function(response) {
		return function(error, result) {
			sendResponse(error, result, NO_CONTENT, response);
		};
	};

httpResources.initialize = function(port) {
	var app = express.createServer(),
		documentTypeRepo = new persistence.DocumentTypeRepo(redisPersistence.documentTypes),
		documentManager = new domain.DocumentManager(),
		templateRepo = new persistence.TemplateRepo(redisPersistence.templates);

	//TODO: Switch out/augment bodyParser to work with content types other than JSON
	app.use(express.bodyParser());

	//DocumentTypes
	var documentTypeRoute = '/documentTypes/:documentType';

	app.put(documentTypeRoute, function(req, res) {
		documentTypeRepo.create(req.params.documentType, model.DocumentType(req.body), putHandler(res));
	});	

	app.get(documentTypeRoute, function(req, res) {
		documentTypeRepo.read(req.params.documentType, getHandler(res));
	});

	app.post(documentTypeRoute, function(req, res) {
		documentTypeRepo.update(req.params.documentType, model.DocumentType(req.body), postHandler(res));
	});

	app.delete(documentTypeRoute, function(req, res) {
		documentTypeRepo.delete(req.params.documentType, deleteHandler(res));
	});

	//Documents
	var documentRoute = '/documentTypes/:documentType/documents/:document';

	app.put(documentRoute, function(req, res) {
		documentManager.create(req.params.documentType, req.params.document, req.body, putHandler(res));
	});

	app.get(documentRoute, function(req, res) {
		documentManager.read(req.params.documentType, req.params.document, getHandler(res));
	});

	app.post(documentRoute, function(req, res) {
		documentManager.update(req.params.documentType, req.params.document, req.body, postHandler(res));
	});

	app.delete(documentRoute, function(req, res) {
		documentManager.delete(req.params.documentType, req.params.document, deleteHandler(res));
	});

	//Templates
	var templateRoute = '/templates/:name';

	app.put(templateRoute, function(req, res) {
		templateRepo.create(req.params.name, req.body, putHandler(res));
	});

	app.get(templateRoute, function(req, res) {
		templateRepo.read(req.params.name, getHandler(res));
	});

	app.post(templateRoute, function(req, res) {
		templateRepo.update(req.params.name, req.body, postHandler(res));
	});

	app.delete(templateRoute, function(req, res) {
		templateRepo.delete(req.params.name, deleteHandler(res));
	});

	app.listen(port);
};