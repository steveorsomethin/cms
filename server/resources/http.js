'use strict';

var express = require('express'),
	domain = require('../domain'),
	model = require('../domain/model'),
	persistence = require('../persistence'),
	redisPersistence = require('../persistence/redis');

var httpResources = module.exports = {};

httpResources.initialize = function(port) {
	var app = express.createServer(),
		documentTypeRepo = new persistence.DocumentTypeRepo(redisPersistence.documentTypes),
		documentManager = new domain.DocumentManager(),
		templateRepo = new persistence.TemplateRepo(redisPersistence.templates);

	//TODO: Switch out/augment bodyParser to work with content types other than JSON
	app.use(express.bodyParser());

	//DocumentTypes
	app.put('/documentTypes/:documentType', function(req, res) {
		documentTypeRepo.create(req.params.documentType, model.DocumentType(req.body), function(error, result) {
			res.send(result);
		});
	});	

	app.get('/documentTypes/:documentType', function(req, res) {
		documentTypeRepo.read(req.params.documentType, function(error, result) {
			res.send(model.DocumentType(result));
		});
	});

	app.post('/documentTypes/:documentType', function(req, res) {
		documentTypeRepo.update(req.params.documentType, model.DocumentType(req.body), function(error, result) {
			res.send(result);
		});
	});

	app.delete('/documentTypes/:documentType', function(req, res) {
		documentTypeRepo.delete(req.params.documentType, function(error, result) {
			res.send(result);
		});
	});

	//Documents
	app.put('/documentTypes/:documentType/documents/:document', function(req, res) {
		documentManager.create(req.params.documentType, req.params.document, req.body, 
			function(error, result) {
				if (error) {
					res.status(401).send(error);
				} else {
					res.status(201).send(result);
				}
			});
	});

	app.get('/documentTypes/:documentType/documents/:document', function(req, res) {
		documentManager.read(req.params.documentType, req.params.document,
			function(error, result) {
				res.send(result);
			});
	});

	app.post('/documentTypes/:documentType/documents/:document', function(req, res) {
		documentManager.update(req.params.documentType, req.params.document, req.body,
			function(error, result) {
				res.send(result);
			});
	});

	app.delete('/documentTypes/:documentType/documents/:document', function(req, res) {
		documentManager.delete(req.params.documentType, req.params.document,
			function(error, result) {
				res.send(result);
			});
	});

	//Templates
	app.put('/templates/:name', function(req, res) {
		templateRepo.create(req.params.name, req.body, function(error, result) {
			res.send(result);
		});
	});

	app.get('/templates/:name', function(req, res) {
		templateRepo.read(req.params.name, function(error, result) {
			res.send(result);
		});
	});

	app.post('/templates/:name', function(req, res) {
		templateRepo.update(req.params.name, req.body, function(error, result) {
			res.send(result);
		});
	});

	app.delete('/templates/:name', function(req, res) {
		templateRepo.delete(req.params.name, function(error, result) {
			res.send(result);
		});
	});

	app.listen(port);
};