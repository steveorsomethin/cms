'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	_ = require('underscore');

var mongoosePersistence = module.exports = function(connectionString) {
	var mongoosePersistence = {};

	var db = mongoose.createConnection(connectionString),
		DocumentType = db.model('DocumentTypes',
			new mongoose.Schema({
				metadata: Schema.Types.Mixed,
				documentType: Schema.Types.Mixed
			})
		),
		Document = db.model('Documents',
			new mongoose.Schema({
				metadata: Schema.Types.Mixed,
				document: {
					id: String,
					name: String,
					documentType: String,
					tags: [String],
					body: Schema.Types.Mixed
				}
			})
		),
		Template = db.model('Templates',
			new mongoose.Schema({
				metadata: Schema.Types.Mixed,
				template: Schema.Types.Mixed
			})
		),
		Page = db.model('Pages',
			new mongoose.Schema({
				metadata: Schema.Types.Mixed,
				page: Schema.Types.Mixed
			})
		);

	//Document Types
	var documentTypes = mongoosePersistence.documentTypes = {};

	documentTypes.create = function(documentType, callback) {
		DocumentType.update(
			{'documentType.name': documentType.name},
			{$set: {documentType: documentType}},
			{upsert: true},
			function(error, result) {
				if (error) {
					callback(error);
				} else {
					callback(null, documentType);
				}
			}
		);
	};

	documentTypes.filter = function(filter, callback) {
		callback('Not implemented');
	};

	documentTypes.read = function(name, callback) {
		DocumentType.findOne({'documentType.id': name}, function(error, result) {
			var documentType;

			if (error) {
				callback(error);
			} else {
				documentType = result ? result.documentType : null;
				callback(null, documentType);
			}
		});
	};

	documentTypes.readAll = function(callback) {
		DocumentType.find({}, function(error, results) {
			var documentTypes = [];

			if (error) {
				callback(error);
			} else {
				for (var i = 0; i < results.length; i++) {
					documentTypes.push(results[i].documentType);
				}
				callback(null, documentTypes);
			}
		});
	};

	documentTypes.update = documentTypes.create; //TODO: Do we need this?

	documentTypes.del = function(name, callback) {
		DocumentType.findOneAndRemove({'documentType.id': name}, function(error, result) {
			if (error) {
				callback(error);
			} else {
				callback();
			}
		});
	};

	//Documents
	var documents = mongoosePersistence.documents = {};

	documents.create = function(document, callback) {
		Document.update(
			{'document.name': document.name},
			{$set: {document: document}},
			{upsert: true},
			function(error, result) {
				if (error) {
					callback(error);
				} else {
					callback(null, document);
				}
			}
		);
	};

	//TODO: BAD cannot trust the vm. This is purely for the new years demo
	var buildMongooseFilter = function(filter) {
		var params = filter.parameters;
		params.exports = {};
		require('vm').runInNewContext('exports = ' + filter.predicate, filter.parameters);
		return params.exports;
	};

	documents.filter = function(filter, callback) {
		filter = filter || {isArray: true, parameters: {}, predicate: '{}'};
		var mongooseFilter = buildMongooseFilter(filter);

		Document.find(mongooseFilter, function(error, results) {
			var documents;
			
			if (error) {
				callback(error);
			} else {
				if (filter.isArray) {
					documents = [];
					for (var i = 0; i < results.length; i++) {
						documents.push(results[i].document);
					}
					callback(null, documents);
				} else {
					callback(null, results.length ? results[0].document : null);
				}
			}
		});
	};

	documents.read = function(name, callback) {
		Document.findOne({'document.name': name}, function(error, result) {
			var document;

			if (error) {
				callback(error);
			} else {
				document = result ? result.document : null;
				callback(null, document);
			}
		});
	};

	documents.readAll = function(name, callback) {
		callback('Not implemented');
	};

	documents.update = documents.create; //TODO: Do we need this?

	documents.del = function(name, callback) {
		Document.findOneAndRemove({'document.name': name}, function(error, result) {
			if (error) {
				callback(error);
			} else {
				callback();
			}
		});
	};

	//Templates
	var templates = mongoosePersistence.templates = {};

	templates.create = function(template, callback) {
		Template.update(
			{'template.name': template.name},
			{$set: {template: template}},
			{ upsert: true },
			function(error, result) {
				if (error) {
					callback(error);
				} else {
					callback(null, template);
				}
			}
		);
	};

	templates.filter = function(filter, callback) {
		filter = filter || {};

		Template.find(filter, function(error, results) {
			var templates = [];

			if (error) {
				callback(error);
			} else {
				if (filter.isArray) {
					for (var i = 0; i < results.length; i++) {
						templates.push(results[i].template);
					}
					callback(null, templates);
				} else {
					callback(null, results.length ? results[0].template : null);
				}
			}
		});
	};

	templates.read = function(name, callback) {
		Template.findOne({'template.name': name}, function(error, result) {
			var template;

			if (error) {
				callback(error);
			} else {
				template = result ? result.template : null;
				callback(null, template);
			}
		});
	};

	templates.readAll = function(callback) {
		Template.find({}, function(error, results) {
			var templates = [];

			if (error) {
				callback(error);
			} else {
				for (var i = 0; i < results.length; i++) {
					templates.push(results[i].template);
				}
				callback(null, templates);
			}
		});
	};

	templates.update = templates.create; //TODO: Do we need this?

	templates.del = function(name, callback) {
		Template.findOneAndRemove({'template.name': name}, function(error, result) {
			if (error) {
				callback(error);
			} else {
				callback();
			}
		});
	};

	//Pages
	var pages = mongoosePersistence.pages = {};

	pages.create = function(page, callback) {
		Page.update(
			{'page.name': page.name},
			{$set: {page: page}},
			{ upsert: true },
			function(error, result) {
				if (error) {
					callback(error);
				} else {
					callback(null, page);
				}
			}
		);
	};

	pages.filter = function(filter, callback) {
		callback('Not implemented');
	};

	pages.read = function(name, callback) {
		Page.findOne({'page.name': name}, function(error, result) {
			var page;

			if (error) {
				callback(error);
			} else {
				page = result ? result.page : null;
				callback(null, page);
			}
		});
	};

	pages.readAll = function(callback) {
		Page.find({}, function(error, results) {
			var pages = [];

			if (error) {
				callback(error);
			} else {
				for (var i = 0; i < results.length; i++) {
					pages.push(results[i].page);
				}
				callback(null, pages);
			}
		});
	};

	pages.update = pages.create; //TODO: Do we need this?

	pages.del = function(name, callback) {
		Page.findOneAndRemove({'page.name': name}, function(error, result) {
			if (error) {
				callback(error);
			} else {
				callback();
			}
		});
	};

	//Site Maps
	var siteMaps = mongoosePersistence.siteMaps = {};

	siteMaps.create = function(name, siteMap, callback) {
		callback('Not implemented');
	};

	siteMaps.read = function(name, callback) {
		callback('Not implemented');
	};

	siteMaps.update = function(name, siteMap, callback) {
		callback('Not implemented');
	};

	siteMaps.del = function(name, callback) {
		callback('Not implemented');
	};

	return mongoosePersistence;
};