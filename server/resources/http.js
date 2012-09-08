'use strict';

var express = require('express'),
	persistence = require('../persistence'),
	redisPersistence = require('../persistence/redis');

var httpResources = module.exports = {};

httpResources.initialize = function(port) {
	var app = express.createServer(),
		dataTypeRepo = new persistence.DataTypeRepo(redisPersistence),
		entityRepo = new persistence.EntityRepo(redisPersistence),
		templateRepo = new persistence.TemplateRepo(redisPersistence);

	//DataTypes
	app.put('/datatypes/:name', function(req, res) {
		dataTypeRepo.createDataType(req.params.name, req.body, function(error, result) {
			res.send(result);
		});
	});	

	app.get('/datatypes/:name', function(req, res) {
		dataTypeRepo.readDataType(req.params.name, function(error, result) {
			res.send(result);
		});
	});

	app.post('/datatypes/:name', function(req, res) {
		dataTypeRepo.updateDataType(req.params.name, req.body, function(error, result) {
			res.send(result);
		});
	});

	app.delete('/datatypes/:name', function(req, res) {
		dataTypeRepo.deleteDataType(req.params.name, function(error, result) {
			res.send(result);
		});
	});

	//Entities
	app.put('/entities/:name', function(req, res) {
		entityRepo.createEntity(req.params.name, req.body, function(error, result) {
			res.send(result);
		});
	});

	app.get('/entities/:name', function(req, res) {
		entityRepo.readEntity(req.params.name, function(error, result) {
			res.send(result);
		});
	});

	app.post('/entities/:name', function(req, res) {
		entityRepo.updateEntity(req.params.name, req.body, function(error, result) {
			res.send(result);
		});
	});

	app.delete('/entities/:name', function(req, res) {
		entityRepo.deleteEntity(req.params.name, function(error, result) {
			res.send(result);
		});
	});

	//Templates
	app.put('/templates/:name', function(req, res) {
		templateRepo.createTemplate(req.params.name, req.body, function(error, result) {
			res.send(result);
		});
	});

	app.get('/templates/:name', function(req, res) {
		templateRepo.readTemplate(req.params.name, function(error, result) {
			res.send(result);
		});
	});

	app.post('/templates/:name', function(req, res) {
		templateRepo.updateTemplate(req.params.name, req.body, function(error, result) {
			res.send(result);
		});
	});

	app.delete('/templates/:name', function(req, res) {
		templateRepo.deleteTemplate(req.params.name, function(error, result) {
			res.send(result);
		});
	});

	app.listen(port);
};