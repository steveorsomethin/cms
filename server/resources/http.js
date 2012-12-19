'use strict';

var util = require('util'),
	express = require('express'),
	domain = require('../domain'),
	errors = require('../errors');

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
	response.status(status).json(error);
};

//TODO: Blow this out to inspect Accept headers and serialize appropriately
var sendResponse = function(successCode, response) {
	return function(error, result) {
		if (error) {
			return sendError(error, response);
		} else {
			return response.status(successCode).json(result);
		}
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
		documentTypeManager.create(req.body, sendResponse(CREATED, res));
	});	

	app.get(documentTypeParamRoute, function(req, res) {
		documentTypeManager.read(req.params.name, sendResponse(OK, res));
	});

	app.post(documentTypeBaseRoute, function(req, res) {
		documentTypeManager.update(req.body, sendResponse(ACCEPTED, res));
	});

	app.del(documentTypeParamRoute, function(req, res) {
		documentTypeManager.del(req.params.name, sendResponse(NO_CONTENT, res));
	});

	app.get(documentTypeBaseRoute, function(req, res) {
		documentTypeManager.readAll(sendResponse(OK, res));
	});

	//Documents
	var documentBaseRoute = serviceBaseRoute + '/documents',
		documentParamRoute = documentBaseRoute + '/:name';

	app.put(documentBaseRoute, function(req, res) {
		documentManager.create(req.body, sendResponse(CREATED, res));
	});

	app.get(documentParamRoute, function(req, res) {
		documentManager.read(req.params.name, sendResponse(OK, res));
	});

	app.post(documentBaseRoute, function(req, res) {
		documentManager.update(req.body, sendResponse(ACCEPTED, res));
	});

	app.del(documentParamRoute, function(req, res) {
		documentManager.del(req.params.name, sendResponse(NO_CONTENT, res));
	});

	app.get(documentBaseRoute, function(req, res) {
		documentManager.filter(req.query.filter, req.query.tag, sendResponse(OK, res));
	});

	//Templates
	var templateBaseRoute = serviceBaseRoute + '/templates',
		templateParamRoute = templateBaseRoute + '/:name';

	app.put(templateBaseRoute, function(req, res) {
		templateManager.create(req.body, sendResponse(CREATED, res));
	});

	app.get(templateParamRoute, function(req, res) {
		templateManager.read(req.params.name, sendResponse(OK, res));
	});

	app.post(templateBaseRoute, function(req, res) {
		templateManager.update(req.body, sendResponse(ACCEPTED, res));
	});

	app.del(templateParamRoute, function(req, res) {
		templateManager.del(req.params.name, sendResponse(NO_CONTENT, res));
	});

	app.get(templateBaseRoute, function(req, res) {
		templateManager.readAll(sendResponse(OK, res));
	});

	//Pages
	var pageBaseRoute = serviceBaseRoute + '/pages',
		pageParamRoute = pageBaseRoute + '/:name';

	app.put(pageBaseRoute, function(req, res) {
		pageManager.create(req.body, sendResponse(CREATED, res));
	});

	app.get(pageParamRoute, function(req, res) {
		pageManager.read(req.params.name, sendResponse(OK, res));
	});

	app.post(pageBaseRoute, function(req, res) {
		pageManager.update(req.body, sendResponse(ACCEPTED, res));
	});

	app.del(pageParamRoute, function(req, res) {
		pageManager.del(req.params.name, sendResponse(NO_CONTENT, res));
	});

	app.get(pageBaseRoute, function(req, res) {
		pageManager.readAll(sendResponse(OK, res));
	});

	app.get(pageParamRoute + '/render', function(req, res) {
		var async = require('async'),
			_ = require('underscore'),
			dust = require('dustjs-linkedin');
		async.waterfall([
			function(callback) {
				pageManager.read(req.params.name, callback);
			},
			function(page, callback) {
				var tasks = [
					function(callback) {
						templateManager.read(page.layout, function(error, result) {
							if (error) {
								return callback(error);
							} else {
								page.layout = result;
								callback();
							}
						});
					}
				];
				_.each(page.sections, function(section) {
					tasks.push(function(callback) {
						templateManager.read(section.template, function(error, result) {
							if (error) {
								return callback(error);
							} else {
								section.template = result;
								callback();
							}
						});
					});
					tasks.push(function(callback) {
						section.filter.parameters = req.query;
						documentManager.filter(section.filter, function(error, result) {
							if (error) {
								return callback(error);
							} else {
								section.document = result.body;
								callback();
							}
						});
					});
				});

				async.parallel(tasks, function(error, results) {
					if (error) {
						callback(error);
					} else {
						callback(null, page);
					}
				});
			}
		], function(error, result) {
			if (error) {
				console.error(error);
				return res.status(INTERNAL_ERROR).send(error.toString());
			}

			var page = result, document = {}, compiled;
			_.each(page.sections, function(section) {
				document[section.placeHolder] = section.document;
				compiled = dust.compile(section.template.body, section.placeHolder);
				dust.loadSource(compiled);
			});

			compiled = dust.compile(page.layout.body, page.layout.name);
			dust.loadSource(compiled);
			dust.render(page.layout.name, document, function(error, result) {
				if (error) {
					return res.status(INTERNAL_ERROR).send(error);
				} else {
					return res.status(OK).send(result);
				}
			});
		});
	});

	app.listen(port);

	return app;
};