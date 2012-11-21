'use strict';

var util = require('util'),
	azure = require('azure'),
	_ = require('underscore'),
	uuid = require('node-uuid'),
	async = require('async'),
	model = require('../domain/model');

//TODO: Are long-lived table services ok?
var tableService = azure.createTableService();

var azureTablePersistence = module.exports = {},
	documentTypes = azureTablePersistence.documentTypes = {},
	documents = azureTablePersistence.documents = {},
	templates = azureTablePersistence.templates = {},
	siteMaps = azureTablePersistence.siteMaps = {};

//Document Types
documentTypes.create = function(name, documentType, callback) {
	callback('Not implemented');
};

documentTypes.read = function(name, callback) {
	callback('Not implemented');
};

documentTypes.readAll = function(callback) {
	callback('Not implemented');
};

documentTypes.update = function(name, documentType, callback) {
	callback('Not implemented');
};

documentTypes.del = function(name, callback) {
	callback('Not implemented');
};

//Documents
documents.create = function(name, document, callback) {
	callback('Not implemented');
};

documents.read = function(name, callback) {
	callback('Not implemented');
};

documents.readAll = function(name, callback) {
	callback('Not implemented');
};

documents.update = function(name, document, callback) {
	callback('Not implemented');
};

documents.del = function(name, callback) {
	callback('Not implemented');
};

//Templates
templates.create = function(name, template, callback) {
	callback('Not implemented');
};

templates.read = function(name, callback) {
	callback('Not implemented');
};

templates.readAll = function(callback) {
	callback('Not implemented');
};

templates.update = function(name, template, callback) {
	callback('Not implemented');
};

templates.del = function(name, callback) {
	callback('Not implemented');
};

//Site Maps
siteMaps.create = function(name, siteMap, callback) {
	callback('Not implemented');
};

siteMaps.read = function(name, callback) {
	callback('Not implemented');
};

siteMaps.update = function(name, siteMap, callback) {
	callback('Not implemented');
};

siteMaps.del = function(name, callback) {
	callback('Not implemented');
};