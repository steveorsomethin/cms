'use strict';

var util = require('util'),
	express = require('express'),
	domain = require('../domain'),
	model = require('../domain/model'),
	validators = model.validators,
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
	NOT_FOUND = 404,
	INTERNAL_ERROR = 500;

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
	var status = error.type && errorMap[error.type] ? errorMap[error.type] : 500;
	//console.error(JSON.stringify(error));
	response.status(status).json(error);
};

//TODO: Blow this out to inspect Accept headers and serialize appropriately
var sendResponse = function(error, body, successCode, response) {
	if (error) {
		return sendError(error, response);
	} else {
		return response.status(successCode).json(body);
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
		documentTypeManager = new domain.DocumentTypeManager(),
		documentManager = new domain.DocumentManager(),
		templateManager = new domain.TemplateManager(),
		pageManager = new domain.PageManager();

	app.use('/public', express.static(__dirname + '/../../client'));

	app.use(function(err, req, res, next) {
		res.status(INTERNAL_ERROR).json({ error: err });
	});

	//TODO: Switch out/augment bodyParser to work with content types other than JSON
	app.use(express.bodyParser());

	var serviceBaseRoute = '/services';

	//DocumentTypes
	var documentTypeBaseRoute = serviceBaseRoute + '/documentTypes',
		documentTypeParamRoute = documentTypeBaseRoute + '/:name';

	app.put(documentTypeBaseRoute, function(req, res) {
		documentTypeManager.create(req.body, putHandler(res));
	});	

	app.get(documentTypeParamRoute, function(req, res) {
		documentTypeManager.read(req.params.name, getHandler(res));
	});

	app.post(documentTypeBaseRoute, function(req, res) {
		documentTypeManager.update(req.body, postHandler(res));
	});

	app.del(documentTypeParamRoute, function(req, res) {
		documentTypeManager.del(req.params.name, deleteHandler(res));
	});

	app.get(documentTypeBaseRoute, function(req, res) {
		documentTypeManager.readAll(getHandler(res));
	});

	//Documents
	var documentBaseRoute = serviceBaseRoute + '/documents',
		documentParamRoute = documentBaseRoute + '/:name';

	app.put(documentBaseRoute, function(req, res) {
		documentManager.create(req.body, putHandler(res));
	});

	app.get(documentParamRoute, function(req, res) {
		documentManager.read(req.params.name, getHandler(res));
	});

	app.post(documentBaseRoute, function(req, res) {
		documentManager.update(req.body, postHandler(res));
	});

	app.del(documentParamRoute, function(req, res) {
		documentManager.del(req.params.name, deleteHandler(res));
	});

	app.get(documentBaseRoute, function(req, res) {
		documentManager.filter(req.query.filter, req.query.tag, getHandler(res));
	});

	//Templates
	var templateBaseRoute = serviceBaseRoute + '/templates',
		templateParamRoute = templateBaseRoute + '/:name';

	app.put(templateBaseRoute, function(req, res) {
		templateManager.create(req.body, putHandler(res));
	});

	app.get(templateParamRoute, function(req, res) {
		templateManager.read(req.params.name, getHandler(res));
	});

	app.post(templateBaseRoute, function(req, res) {
		templateManager.update(req.body, postHandler(res));
	});

	app.del(templateParamRoute, function(req, res) {
		templateManager.del(req.params.name, deleteHandler(res));
	});

	app.get(templateBaseRoute, function(req, res) {
		templateManager.readAll(getHandler(res));
	});

	//Pages
	var pageBaseRoute = serviceBaseRoute + '/pages',
		pageParamRoute = pageBaseRoute + '/:name';

	app.put(pageBaseRoute, function(req, res) {
		pageManager.create(req.body, putHandler(res));
	});

	app.get(pageParamRoute, function(req, res) {
		pageManager.read(req.params.name, getHandler(res));
	});

	app.post(pageBaseRoute, function(req, res) {
		pageManager.update(req.body, postHandler(res));
	});

	app.del(pageParamRoute, function(req, res) {
		pageManager.del(req.params.name, deleteHandler(res));
	});

	app.get(pageBaseRoute, function(req, res) {
		pageManager.readAll(getHandler(res));
	});

	app.post('/dt/:name', function(req, res) {
		var lastProperty, split, propertyName, subProperty;
		var documentType = 
			{
				"name" : req.body.name,
				"type" : "object",
				"additionalProperties" : false,
				"properties" :{}
			},
			properties = documentType.properties;

		for (var key in req.body) {
			split = key.split(':');

			propertyName = split[0];
			subProperty = split[1];

			if (key != 'name') {
				if (!lastProperty || lastProperty !== propertyName) {
					properties[propertyName] = {}; 
				} else {
					properties[propertyName][subProperty] = 
						subProperty === 'required' ? true : req.body[key];
				}

				lastProperty = propertyName;
			}
		}
		
		documentTypeManager.create(req.params.name, documentType, putHandler);
		res.redirect('/public/index.html');
	});

	app.get('/documentTypes/:documentType/templates/:template/documents/:document', function(req, res) {
		require('async').waterfall([
			function(callback) {
				if (req.query.filter) {
					documentManager.filter(req.query.filter, req.query.tag, callback);
				} else {
					documentManager.read(req.params.documentType, req.params.document, callback);
				}
			},
			function(document, callback) {
				if (document instanceof Array) {
					document = document[0];
				}

				templateManager.read(req.params.template, function(error, result) {
					if (error) {
						return callback(error);
					}
					return callback(null, document, result);
				});
			},
			function(document, template, callback) {
				var dust = require('dustjs-linkedin');
				var compiled = dust.compile(template.body, 'test');
				dust.loadSource(compiled);
				dust.render('test', document, callback);
			}
		], function(error, result) {
			if (error) {
				console.error(error);
				return res.status(INTERNAL_ERROR).send(error.toString());
			}
			return res.status(OK).send(result);
		});
	});

	app.listen(port);
};