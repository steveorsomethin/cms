//TODO: Break this out as needed, or simply collapse up a level into domain.js

'use strict';

var util = require('util'),
	_ = require('underscore'),
	async = require('async'),
	errors = require('../errors'),
	model = require('./model'),
	persistence = require('../persistence'),
	validators = model.validators;

var documentTypeNotFound = 'DocumentType with name %s not found.',
	documentNotFound = 'Document with name %s not found.',
	templateNotFound = 'Template with name %s not found.',
	pageNotFound = 'Page with name %s not found.';

var domain = module.exports = function(persistenceImpl) {
	var domain = {};

	var documentTypeRepo = new persistence.DocumentTypeRepo(persistenceImpl.documentTypes),
		documentRepo = new persistence.DocumentRepo(persistenceImpl.documents),
		templateRepo = new persistence.TemplateRepo(persistenceImpl.templates),
		pageRepo = new persistence.TemplateRepo(persistenceImpl.pages);

	var ensureDocumentType = function(documentTypeName, callback) {
		documentTypeRepo.read(documentTypeName, function(error, documentType) {
			if (!documentType) {
				error = new errors.ResourceNotFound(util.format(documentTypeNotFound, documentTypeName));
				return callback(error);
			} else {
				callback(null, documentType);
			}
		});
	};

	var ensureTemplate = function(templateName, callback) {
		templateRepo.read(templateName, function(error, template) {
			if (!template) {
				error = new errors.ResourceNotFound(util.format(templateNotFound, templateName));
				return callback(error);
			} else {
				callback(null, template);
			}
		});
	};

	var preSaveDocument = function(document, callback) {
		if (typeof document.documentType !== 'string') {
			return callback(new errors.InvalidInput({documentType: 'Property is required'}));
		}

		async.waterfall([
			function(callback) {
				ensureDocumentType(document.documentType, callback);
			},

			function(documentType, callback) {
				document.tags = document.tags || [];
				var validationError = validators.Document(document, documentType);
				if (validationError) {
					return callback(validationError);
				}

				return callback();
			}
		], callback);
	};

	var preSaveTemplate = function(template, callback) {
		var validationError = validators.Template(template);
		if (validationError) {
			return callback(validationError);
		}

		ensureDocumentType(template.documentType, function(error, result) {
			return error ? callback(error) : callback();
		});
	};

	var preSavePage = function(page, callback) {
		var validationError = validators.Page(page);
		if (validationError) {
			return callback(validationError);
		}

		var templateTask = function(templateName) {
			return function(callback) {
				ensureTemplate(templateName, callback);
			};
		};

		var documentTypeTask = function(documentTypeName) {
			return function(callback) {
				ensureDocumentType(documentTypeName, callback);
			};
		};

		var tasks = [templateTask(page.layout)];
		_.each(page.sections, function(section) {
			tasks.push(templateTask(section.template));
			tasks.push(documentTypeTask(section.filter.documentType));
		});

		async.parallel(tasks, function(error, result) {
			return error ? callback(error) : callback();
		});
	};

	//Document Types
	var documentTypes = domain.documentTypes = {};

	documentTypes.create = function(documentType, onComplete) {
		var validationError = validators.DocumentType(documentType);
		documentType.id = documentType.name;
		if (validationError) {
			return onComplete(validationError);
		} else {
			return documentTypeRepo.create(documentType, onComplete);
		}
	};

	documentTypes.read = function(documentTypeName, onComplete) {
		documentTypeRepo.read(documentTypeName, function(error, result) {
			if (error) {
				return onComplete(error);
			} else if (!result) {
				error = new errors.ResourceNotFound(util.format(documentTypeNotFound, documentTypeName));
				return onComplete(error);
			} else {
				return onComplete(null, result);
			}
		});
	};

	documentTypes.readAll = function(onComplete) {
		documentTypeRepo.readAll(function(error, result) {
			if (error) {
				return onComplete(error);
			} else if (!result) {
				error = new errors.ResourceNotFound(util.format(documentTypeNotFound, 'all'));
				return onComplete(error);
			} else {
				return onComplete(null, result);
			}
		});
	};

	documentTypes.update = function(documentType, onComplete) {
		var validationError = validators.DocumentType(documentType);
		documentType.id = documentType.name;
		if (validationError) {
			return onComplete(validationError);
		} else {
			documentTypeRepo.update(documentType, onComplete);
		}
	};

	documentTypes.del = function(documentTypeName, onComplete) {
		documentTypeRepo.del(documentTypeName, onComplete);
	};

	//Documents
	var documents = domain.documents = {};

	documents.create = function(document, onComplete) {
		async.waterfall([
			function(callback) {
				preSaveDocument(document, callback);
			},

			function(callback) {
				documentRepo.create(document, callback);
			}
		], onComplete);
	};

	documents.read = function(documentName, onComplete) {
		documentRepo.read(documentName, function(error, result) {
			if (error) {
				return onComplete(error);
			} else if (!result) {
				error = new errors.ResourceNotFound(util.format(documentNotFound, documentName));
				return onComplete(error);
			} else {
				return onComplete(null, result);
			}
		});
	};

	documents.filter = function(filter, onComplete) {
		documentRepo.filter(filter, onComplete); //TODO: Fill this out
	};

	documents.update = function(document, onComplete) {
		async.waterfall([
			function(callback) {
				preSaveDocument(document, callback);
			},

			function(callback) {
				documentRepo.update(document, callback);
			}
		], onComplete);
	};

	documents.del = function(documentName, onComplete) {
		documentRepo.del(documentName, onComplete);
	};

	//Templates
	var templates = domain.templates = {};

	templates.create = function(template, onComplete) {
		async.waterfall([
			function(callback) {
				preSaveTemplate(template, callback);
			},

			function(callback) {
				templateRepo.create(template, callback);
			}
		], onComplete);
	};

	templates.filter = function(filter, onComplete) {
		templateRepo.filter(filter, onComplete); //TODO: Fill this out
	};

	templates.read = function(templateName, onComplete) {
		templateRepo.read(templateName, function(error, result) {
			if (error) {
				return onComplete(error);
			} else if (!result) {
				error = new errors.ResourceNotFound(util.format(templateNotFound, templateName));
				return onComplete(error);
			} else {
				return onComplete(null, result);
			}
		});
	};

	templates.readAll = function(onComplete) {
		templateRepo.readAll(function(error, result) {
			if (error) {
				return onComplete(error);
			} else if (!result) {
				error = new errors.ResourceNotFound(util.format(templateNotFound, 'all'));
				return onComplete(error);
			} else {
				return onComplete(null, result);
			}
		});
	};

	templates.update = function(template, onComplete) {
		async.waterfall([
			function(callback) {
				preSaveTemplate(template, callback);
			},

			function(callback) {
				templateRepo.update(template, callback);
			}
		], onComplete);
	};

	templates.del = function(templateName, onComplete) {
		templateRepo.del(templateName, onComplete);
	};

	//Pages
	var pages = domain.pages = {};

	pages.create = function(page, onComplete) {
		async.waterfall([
			function(callback) {
				preSavePage(page, callback);
			},

			function(callback) {
				pageRepo.create(page, callback);
			}
		], onComplete);
	};

	pages.filter = function(filter, onComplete) {
		pageRepo.filter(filter, onComplete); //TODO: Fill this out
	};

	pages.read = function(pageName, onComplete) {
		pageRepo.read(pageName, function(error, result) {
			if (error) {
				return onComplete(error);
			} else if (!result) {
				error = new errors.ResourceNotFound(util.format(pageNotFound, pageName));
				return onComplete(error);
			} else {
				return onComplete(null, result);
			}
		});
	};

	pages.readAll = function(onComplete) {
		pageRepo.readAll(function(error, result) {
			if (error) {
				return onComplete(error);
			} else if (!result) {
				error = new errors.ResourceNotFound(util.format(pageNotFound, 'all'));
				return onComplete(error);
			} else {
				return onComplete(null, result);
			}
		});
	};

	pages.update = function(page, onComplete) {
		async.waterfall([
			function(callback) {
				preSavePage(page, callback);
			},

			function(callback) {
				pageRepo.update(page, callback);
			}
		], onComplete);
	};

	pages.del = function(pageName, onComplete) {
		pageRepo.del(pageName, onComplete);
	};

	return domain;
};