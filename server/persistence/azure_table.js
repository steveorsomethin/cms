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
	callback(null);
};

documentTypes.read = function(name, callback) {
	callback(null);
};

documentTypes.readAll = function(callback) {
	callback(null);
};

documentTypes.update = function(name, documentType, callback) {
	callback(null);
};

documentTypes.del = function(name, callback) {
	callback(null);
};

//Documents
documents.create = function(name, document, callback) {
	callback(null);
};

documents.read = function(name, callback) {
	callback(null);
};

documents.readAll = function(name, callback) {
	callback(null);
};

documents.update = function(name, document, callback) {
	callback(null);
};

documents.del = function(name, callback) {
	redisClient.DEL(name, callback);
};

//Templates
templates.create = function(name, template, callback) {
	var body = {};
	body[name] = JSON.stringify(template);
	redisClient.HMSET('Templates', body, function(error, result) {
		if (error) {
			return callback(error);
		} else {
			return callback(null, template);
		}
	});
};

templates.read = function(name, callback) {
	redisClient.HMGET('Templates', name, function(error, result) {
		if (error) {
			return callback(error);
		} else if (!result.length || !result[0]) {
			return callback(null, null);
		} else {
			return callback(null, JSON.parse(result));
		}
	});
};

templates.readAll = function(callback) {
	redisClient.HGETALL('Templates', function(error, result) {
		var items = [], key;
		if (error) {
			return callback(error);
		} else {
			for (key in result) {
				items.push(JSON.parse(result[key]));
			}
			return callback(null, items);
		}
	});
};

templates.update = function(name, template, callback) {
	var body = {};
	body[name] = JSON.stringify(template);
	redisClient.HMSET('Templates', body, function(error, result) {
		if (error) {
			return callback(error);
		} else {
			return callback(null, template);
		}
	});
};

templates.del = function(name, callback) {
	redisClient.HDEL('Templates', name, callback);
};

//Site Maps
siteMaps.create = function(name, siteMap, callback) {
	redisClient.SET(name, JSON.stringify(siteMap), callback);
};

siteMaps.read = function(name, callback) {
	redisClient.GET(name, callback);
};

siteMaps.update = function(name, siteMap, callback) {
	redisClient.SET(name, siteMap, callback);
};

siteMaps.del = function(name, callback) {
	redisClient.DEL(name, callback);
};