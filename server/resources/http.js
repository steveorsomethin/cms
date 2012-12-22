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

	var crud = function(manager) {
		return function(req, res) {
			switch (req.method) {
				case 'PUT':
					manager.create(req.body, sendResponse(CREATED, res));
					break;
				case 'GET':
					manager.read(req.params.name, sendResponse(OK, res));
					break;
				case 'POST':
					manager.update(req.body, sendResponse(ACCEPTED, res));
					break;
				case 'DELETE':
					manager.del(req.params.name, sendResponse(NO_CONTENT, res));
					break;
			}
		};
	};

	//Set up boilerplate crud routes
	[
		['documentTypes', documentTypeManager], 
		['documents', documentManager],
		['templates', templateManager],
		['pages', pageManager]
	].forEach(function(tuple, i) {
		var baseRoute = util.format('%s/%s', serviceBaseRoute, tuple[0]),
			paramRoute = util.format('%s/:name', baseRoute),
			manager = tuple[1];

		app.put(baseRoute, crud(manager));
		app.get(paramRoute, crud(manager));
		app.post(baseRoute, crud(manager));
		app.del(paramRoute, crud(manager));
	});

	//DocumentTypes
	app.get(serviceBaseRoute + '/documentTypes', function(req, res) {
		documentTypeManager.readAll(sendResponse(OK, res));
	});

	//Documents
	app.get(serviceBaseRoute + '/documents', function(req, res) {
		documentManager.filter(null, sendResponse(OK, res));
	});

	//Templates
	app.get(serviceBaseRoute + '/templates', function(req, res) {
		templateManager.readAll(sendResponse(OK, res));
	});

	//Pages
	app.get(serviceBaseRoute + '/pages', function(req, res) {
		pageManager.readAll(sendResponse(OK, res));
	});

	app.get(serviceBaseRoute + '/pages/:name/render', function(req, res) {
		var async = require('async'),
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
				page.sections.forEach(function(section) {
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
								section.document = result;
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
			page.sections.forEach(function(section) {
				document[section.placeHolder] = section.document.body;
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