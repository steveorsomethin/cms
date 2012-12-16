//TODO: Break this out as needed, or simply collapse up a level into domain.js

'use strict';

var util = require('util'),
	_ = require('underscore'),
	async = require('async'),
	uuid = require('node-uuid'),
	errors = require('../errors'),
	model = require('./model'),
	validators = model.validators,
	persistence = require('../persistence'),
	mongoosePersistence = require('../persistence/mongoose');

var documentTypeNotFound = 'DocumentType with name %s not found.',
	documentNotFound = 'Document with name %s not found.',
	templateNotFound = 'Template with name %s not found.',
	pageNotFound = 'Page with name %s not found.';

var documentTypeRepo = new persistence.DocumentTypeRepo(mongoosePersistence.documentTypes),
	documentRepo = new persistence.DocumentRepo(mongoosePersistence.documents),
	templateRepo = new persistence.TemplateRepo(mongoosePersistence.templates),
	pageRepo = new persistence.TemplateRepo(mongoosePersistence.pages);

var domainManagers = module.exports = {};

var ensureDocumentType = function(documentTypeName, callback) {
	documentTypeRepo.read(documentTypeName, function(error, documentType) {
		if (!documentType) {
			var error = new errors.ResourceNotFound(util.format(documentTypeNotFound, documentTypeName));
			return callback(error);
		} else {
			callback(null, documentType);
		}
	});
};

var ensureTemplate = function(templateName, callback) {
	templateRepo.read(templateName, function(error, template) {
		if (!template) {
			var error = new errors.ResourceNotFound(util.format(templateNotFound, templateName));
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

//DocumentTypes
var DocumentTypeManager = domainManagers.DocumentTypeManager = function() {

};

DocumentTypeManager.prototype.create = function(documentTypeName, documentType, onComplete) {
	var validationError = validators.DocumentType(documentType);
	documentType.id = documentType.name;
	if (validationError) {
		return onComplete(validationError);
	} else {
		return documentTypeRepo.create(documentTypeName, documentType, onComplete);
	}
};

DocumentTypeManager.prototype.read = function(documentTypeName, onComplete) {
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

DocumentTypeManager.prototype.readAll = function(onComplete) {
	documentTypeRepo.readAll(function(error, result) {
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

DocumentTypeManager.prototype.update = function(documentTypeName, documentType, onComplete) {
	var validationError = validators.DocumentType(documentType);
	documentType.id = documentType.name;
	if (validationError) {
		return onComplete(validationError);
	} else {
		documentTypeRepo.update(documentTypeName, documentType, onComplete);
	}
};

DocumentTypeManager.prototype.del = function(documentTypeName, onComplete) {
	documentTypeRepo.del(documentTypeName, onComplete);
};

//Documents
var DocumentManager = domainManagers.DocumentManager = function() {
	//Whatever here
};

var ensureDocumentType = function(documentTypeName) {
	return function(callback) {
		documentTypeRepo.read(documentTypeName, function(error, documentType) {
			if (!documentType) {
				var error = new errors.ResourceNotFound(util.format(documentTypeNotFound, documentTypeName));
				return callback(error);
			} else {
				callback(null, documentType);
			}
		});
	};
}

var preSaveDocument = function(documentTypeName, document) {
	return function(callback) {
		async.waterfall([
			ensureDocumentType(documentTypeName),

			function(documentType, callback) {
				var validationError = validators.Document(document, documentType);
				if (validationError) {
					return callback(validationError);
				} 

				return callback();
			}
		], callback);
	};
};

var preSaveTemplate = function(documentTypeName, template) {
	return function(callback) {
		async.waterfall([
			ensureDocumentType(documentTypeName),

			function(documentType, callback) {
				var validationError = validators.Template(template);
				if (validationError) {
					return callback(validationError);
				} 

				return callback();
			}
		], callback);
	};
};

//TODO: Pass documentType to persistence module
DocumentManager.prototype.create = function(documentTypeName, documentName, document, onComplete) {
	async.waterfall([
		preSaveDocument(documentTypeName, document),

		function(callback) {
			documentRepo.create(documentName, document, function(error, result) {
				if (error) {
					return callback(error);
				} 

				return callback(null, result);
			});
		}
	], onComplete);
};

DocumentManager.prototype.read = function(documentTypeName, documentName, onComplete) {
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

DocumentManager.prototype.filter = function(filter, tag, onComplete) {
	documentRepo.filter(filter, tag, onComplete); //TODO: Fill this out
};

DocumentManager.prototype.update = function(documentTypeName, documentName, document, onComplete) {
	async.waterfall([
		preSaveDocument(documentTypeName, document),

		function(callback) {
			documentRepo.update(documentName, document, function(error, result) {
				if (error) {
					return callback(error);
				} 

				return callback(null, result);
			});
		}
	], onComplete);
};

DocumentManager.prototype.del = function(documentTypeName, documentName, onComplete) {
	documentRepo.del(documentName, onComplete);
};

//Templates
var TemplateManager = domainManagers.TemplateManager = function() {
	//Whatever here
};

//TODO: Pass documentType to persistence module
TemplateManager.prototype.create = function(documentTypeName, templateName, template, onComplete) {
	async.waterfall([
		preSaveTemplate(documentTypeName, template),

		function(callback) {
			templateRepo.create(templateName, template, function(error, result) {
				if (error) {
					return onComplete(error);
				} 

				return onComplete(null, result);
			});
		}
	], onComplete);
};

TemplateManager.prototype.filter = function(filter, onComplete) {
	templateRepo.filter(filter, onComplete); //TODO: Fill this out
};

TemplateManager.prototype.read = function(documentTypeName, templateName, onComplete) {
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


TemplateManager.prototype.readAll = function(onComplete) {
	templateRepo.readAll(function(error, result) {
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

TemplateManager.prototype.update = function(documentTypeName, templateName, template, onComplete) {
	async.waterfall([
		preSaveTemplate(documentTypeName, template),

		function(callback) {
			templateRepo.update(templateName, template, function(error, result) {
				if (error) {
					return onComplete(error);
				} 

				return onComplete(null, result);
			});
		}
	], onComplete);
};

TemplateManager.prototype.del = function(documentTypeName, templateName, onComplete) {
	templateRepo.del(templateName, onComplete);
};
//Pages
var PageManager = domainManagers.PageManager = function() {
	//Whatever here
};

PageManager.prototype.create = function(page, onComplete) {
	async.waterfall([
		function(callback) {
			preSavePage(page, callback);
		},

		function(callback) {
			pageRepo.create(page, callback);
		}
	], onComplete);
};

PageManager.prototype.filter = function(filter, onComplete) {
	pageRepo.filter(filter, onComplete); //TODO: Fill this out
};

PageManager.prototype.read = function(pageName, onComplete) {
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

PageManager.prototype.readAll = function(onComplete) {
	pageRepo.readAll(function(error, result) {
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

PageManager.prototype.update = function(page, onComplete) {
	async.waterfall([
		function(callback) {
			preSavePage(page, callback);
		},

		function(callback) {
			pageRepo.update(page, callback);
		}
	], onComplete);
};

PageManager.prototype.del = function(pageName, onComplete) {
	pageRepo.del(pageName, onComplete);
};
