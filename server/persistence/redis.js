'use strict';

var util = require('util'),
	redis = require('redis'),
	model = require('../domain/model');

//TODO: Consider moving this into a constructor and making the redis calls an object
//var redisClient = redis.createClient(6379, 'gutenberg.cloudapp.net');
var redisClient = redis.createClient();

var redisPersistence = module.exports = {},
	documentTypes = redisPersistence.documentTypes = {},
	documents = redisPersistence.documents = {},
	templates = redisPersistence.templates = {},
	siteMaps = redisPersistence.siteMaps = {};

//Document Types
documentTypes.create = function(name, documentType, callback) {
	var body = {};
	body[name] = JSON.stringify(documentType);
	redisClient.HMSET('DocumentTypes', body, function(error, result) {
		if (error) {
			return callback(error);
		} else {
			return callback(null, documentType);
		}
	});
};

documentTypes.read = function(name, callback) {
	redisClient.HMGET('DocumentTypes', name, function(error, result) {
		if (error) {
			return callback(error);
		} else if (!result.length || !result[0]) {
			return callback(null, null);
		} else {
			return callback(null, JSON.parse(result));
		}
	});
};

documentTypes.readAll = function(name, callback) {
	redisClient.HGETALL('DocumentTypes', function(error, result) {
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

documentTypes.update = function(name, documentType, callback) {
	var body = {};
	body[name] = JSON.stringify(documentType);
	redisClient.HMSET('DocumentTypes', body, function(error, result) {
		if (error) {
			return callback(error);
		} else {
			return callback(null, documentType);
		}
	});
};

documentTypes.del = function(name, callback) {
	redisClient.HDEL('DocumentTypes', name, callback);
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

documents.readAll = function(name, callback) {
	callback('Not implemented');
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

documents.del = function(name, callback) {
	redisClient.DEL(name, callback);
};

//Templates
templates.create = function(name, template, callback) {
	redisClient.SET(name, template, function(error, result) {
		if (error) {
			return callback(error);
		} else {
			return callback(null, template);
		}
	});
};

templates.read = function(name, callback) {
	redisClient.GET(name, callback);
};

templates.readAll = function(name, callback) {
	callback('Not implemented');
};

templates.update = function(name, template, callback) {
	redisClient.SET(name, template, function(error, result) {
		if (error) {
			return callback(error);
		} else {
			return callback(null, template);
		}
	});
};

templates.del = function(name, callback) {
	redisClient.DEL(name, callback);
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