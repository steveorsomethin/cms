'use strict';

var util = require('util'),
	redis = require('redis'),
	model = require('../domain/model');

//TODO: Consider moving this into a constructor and making the redis calls an object
var redisClient = redis.createClient();

var redisPersistence = module.exports = {},
	documentTypes = redisPersistence.documentTypes = {},
	documents = redisPersistence.documents = {},
	templates = redisPersistence.templates = {},
	siteMaps = redisPersistence.siteMaps = {};

/*
* Flattening/unflattening assumes that our schemas always go
* exactly one level deep, no more, no less.
*/
var flattenDocumentType = function(name, documentType) {
	var flattened = {}, key1, key2;

	for (key1 in documentType) {
		for (key2 in documentType[key1]) {
			flattened[util.format("%s:%s:%s", name, key1, key2)] = documentType[key1][key2];
		}
	}

	return flattened;
};

var unflattenDocumentType = function(flattened) {
	var documentType = {}, property, key, splitKeys, i;

	for (key in flattened) {
		splitKeys = key.split(':');

		//Start at index 1 here, as index 0 is the name of the root object
		property = documentType[splitKeys[1]] = documentType[splitKeys[1]] || {};
		property[splitKeys[2]] = flattened[key];
	}

	return model.DocumentType(documentType);
};

//Data Types
documentTypes.create = function(name, documentType, callback) {
	redisClient.HMSET(name, flattenDocumentType(name, documentType), function(error, result) {
		if (error) {
			return callback(error);
		} else {
			return callback(null, documentType);
		}
	});
};

documentTypes.read = function(name, callback) {
	redisClient.HGETALL(name, function(error, result) {
		callback(error, unflattenDocumentType(result));
	});
};

documentTypes.update = function(name, documentType, callback) {
	redisClient.HMSET(name, flattenDocumentType(documentType), callback);
};

documentTypes.delete = function(name, callback) {
	redisClient.DEL(name, callback);
};

//Documents
documents.create = function(name, document, callback) {
	redisClient.HMSET(name, document, callback);
};

documents.read = function(name, callback) {
	redisClient.HGETALL(name, callback);
};

documents.update = function(name, document, callback) {
	redisClient.HMSET(name, document, callback);
};

documents.delete = function(name, callback) {
	redisClient.DEL(name, callback);
};

//Templates
templates.create = function(name, template, callback) {
	redisClient.HMSET(name, template, callback);
};

templates.read = function(name, callback) {
	redisClient.HGETALL(name, callback);
};

templates.update = function(name, template, callback) {
	redisClient.HMSET(name, template, callback);
};

templates.delete = function(name, callback) {
	redisClient.DEL(name, callback);
};

//Site Maps
siteMaps.create = function(name, siteMap, callback) {
	redisClient.HMSET(name, siteMap, callback);
};

siteMaps.read = function(name, callback) {
	redisClient.HGETALL(name, callback);
};

siteMaps.update = function(name, siteMap, callback) {
	redisClient.HMSET(name, siteMap, callback);
};

siteMaps.delete = function(name, callback) {
	redisClient.DEL(name, callback);
};