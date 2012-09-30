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

//Document Types
documentTypes.create = function(name, documentType, callback) {
	redisClient.SET(name, JSON.stringify(documentType), function(error, result) {
		if (error) {
			return callback(error);
		} else {
			return callback(null, documentType);
		}
	});
};

documentTypes.read = function(name, callback) {
	redisClient.GET(name, function(error, result) {
		if (error) {
			return callback(error);
		} else {
			return callback(null, JSON.parse(result));
		}
	});
};

documentTypes.update = function(name, documentType, callback) {
	redisClient.SET(name, JSON.stringify(documentType), function(error, result) {
		if (error) {
			return callback(error);
		} else {
			return callback(null, documentType);
		}
	});
};

documentTypes.delete = function(name, callback) {
	redisClient.DEL(name, callback);
};

//Documents
documents.create = function(name, document, callback) {
	redisClient.SET(name, JSON.stringify(document), function(error, result) {
		if (error) {
			return callback(error);
		} else {
			return callback(null, document);
		}
	});
};

documents.read = function(name, callback) {
	redisClient.GET(name, function(error, result) {
		callback(error, JSON.parse(result));
	});
};

documents.update = function(name, document, callback) {
	redisClient.SET(name, JSON.stringify(document), function(error, result) {
		if (error) {
			return callback(error);
		} else {
			return callback(null, document);
		}
	});
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