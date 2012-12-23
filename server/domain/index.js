//TODO: Break this out as needed, or simply collapse up a level into domain.js

'use strict';

var util = require('util'),
	_ = require('underscore'),
	async = require('async'),
	errors = require('../errors'),
	model = require('./model'),
	validators = model.validators;

var documentTypeNotFound = 'DocumentType with name %s not found.',
	documentNotFound = 'Document with name %s not found.',
	templateNotFound = 'Template with name %s not found.',
	pageNotFound = 'Page with name %s not found.';

var domain = module.exports = function(persistence) {
	var domain = {};

	var ensureDocumentType = function(documentTypeName, callback) {
		persistence.documentTypes.read(documentTypeName, function(error, documentType) {
			if (!documentType) {
				error = new errors.ResourceNotFound(util.format(documentTypeNotFound, documentTypeName));
				return callback(error);
			} else {
				callback(null, documentType);
			}
		});
	};

	var ensureTemplate = function(templateName, callback) {
		persistence.templates.read(templateName, function(error, template) {
			if (!template) {
				error = new errors.ResourceNotFound(util.format(templateNotFound, templateName));
				return callback(error);
			} else {
				callback(null, template);
			}
		});
	};

	var preSaveDocument = function(document, callback) {
		//While this validation really should be in the model, we have a chicken and egg problem
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
			return persistence.documentTypes.create(documentType, onComplete);
		}
	};

	documentTypes.read = function(documentTypeName, onComplete) {
		persistence.documentTypes.read(documentTypeName, function(error, result) {
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
		persistence.documentTypes.readAll(function(error, result) {
			if (error) {
				return onComplete(error);
			} else if (!result) {
				return onComplete(null, []);
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
			persistence.documentTypes.update(documentType, onComplete);
		}
	};

	documentTypes.del = function(documentTypeName, onComplete) {
		persistence.documentTypes.del(documentTypeName, onComplete);
	};

	//Documents
	var documents = domain.documents = {};

	documents.create = function(document, onComplete) {
		async.waterfall([
			function(callback) {
				preSaveDocument(document, callback);
			},

			function(callback) {
				persistence.documents.create(document, callback);
			}
		], onComplete);
	};

	documents.read = function(documentName, onComplete) {
		persistence.documents.read(documentName, function(error, result) {
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
		persistence.documents.filter(filter, function(error, result) {
			if (error) {
				onComplete(error);
			} else {
				onComplete(null, filter.isArray && !Array.isArray(result) ? [result]: result);
			}
		});
	};

	documents.update = function(document, onComplete) {
		async.waterfall([
			function(callback) {
				preSaveDocument(document, callback);
			},

			function(callback) {
				persistence.documents.update(document, callback);
			}
		], onComplete);
	};

	documents.del = function(documentName, onComplete) {
		persistence.documents.del(documentName, onComplete);
	};

	//Templates
	var templates = domain.templates = {};

	templates.create = function(template, onComplete) {
		async.waterfall([
			function(callback) {
				preSaveTemplate(template, callback);
			},

			function(callback) {
				persistence.templates.create(template, callback);
			}
		], onComplete);
	};

	templates.filter = function(filter, onComplete) {
		persistence.templates.filter(filter, function(error, result) {
			if (error) {
				onComplete(error);
			} else {
				onComplete(null, filter.isArray && !Array.isArray(result) ? [result]: result);
			}
		});
	};

	templates.read = function(templateName, onComplete) {
		persistence.templates.read(templateName, function(error, result) {
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
		persistence.templates.readAll(function(error, result) {
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
				persistence.templates.update(template, callback);
			}
		], onComplete);
	};

	templates.del = function(templateName, onComplete) {
		persistence.templates.del(templateName, onComplete);
	};

	//Pages
	var pages = domain.pages = {};

	pages.create = function(page, onComplete) {
		async.waterfall([
			function(callback) {
				preSavePage(page, callback);
			},

			function(callback) {
				persistence.pages.create(page, callback);
			}
		], onComplete);
	};

	pages.filter = function(filter, onComplete) {
		persistence.pages.filter(filter, function(error, result) {
			if (error) {
				onComplete(error);
			} else {
				onComplete(null, filter.isArray && !Array.isArray(result) ? [result]: result);
			}
		});
	};

	pages.read = function(pageName, onComplete) {
		persistence.pages.read(pageName, function(error, result) {
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
		persistence.pages.readAll(function(error, result) {
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
				persistence.pages.update(page, callback);
			}
		], onComplete);
	};

	pages.del = function(pageName, onComplete) {
		persistence.pages.del(pageName, onComplete);
	};

	return domain;
};