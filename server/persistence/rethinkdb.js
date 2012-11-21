'use strict';

var util = require('util'),
	r = require('rethinkdb'),
	_ = require('underscore'),
	uuid = require('node-uuid'),
	async = require('async'),
	model = require('../domain/model');

var rethinkdbPersistence = module.exports = {},
	documentTypes = rethinkdbPersistence.documentTypes = {},
	documents = rethinkdbPersistence.documents = {},
	templates = rethinkdbPersistence.templates = {},
	siteMaps = rethinkdbPersistence.siteMaps = {};

var connection = r.connect({host:'localhost', port:28015}, 
	function(conn) {
		conn.use('cms');
	}, 
	function() {
		throw 'Connection to rethinkdb failed'; //TODO: Log this, make it more detailed
	}
);

//Document Types
documentTypes.create = function(name, documentType, callback) {
	r.table('DocumentTypes').insert(documentType, true).run(function(result) {
		if (result.errors) {
			callback(result);
		} else {
			callback(null, documentType);
		}
	});
};

documentTypes.filter = function(filter, callback) {
	r.table('DocumentTypes').filter(function(row) {
		return r.let({it: row},
				r.branch(r.js('return ' + filter), //it.properties.id.type == "string"
				r.expr(true), r.expr(false))
		);
	}).run().collect(function(results) {
		console.log(JSON.stringify(results));
		if (results.errors) { //TODO: Error handling, verify this path is even possible
			callback(results);
		} else {
			callback(null, results);
		}
	});
};

documentTypes.read = function(name, callback) {
	r.table('DocumentTypes').get(name).run(function(result) {
		if (!result) {
			return callback(null, null);
		} else {
			return callback(null, result);
		}
	});
};

documentTypes.readAll = function(callback) {
	var results = [];
	r.table('DocumentTypes').run().collect(function(results) {
		if (results.errors) { //TODO: Error handling, verify this path is even possible
			callback(results);
		} else {
			callback(null, results);
		}
	});
};

documentTypes.update = function(name, documentType, callback) {
	r.table('DocumentTypes').get(name).update(documentType).run(function(result) {
		if (result.errors) {
			callback(result);
		} else {
			callback(null, documentType);
		}
	});
};

documentTypes.del = function(name, callback) {
	r.table('DocumentTypes').get(name).del().run(function(result) {
		callback();
	});
};

//Documents
documents.create = function(name, document, callback) {
	r.table('Documents').insert(document, true).run(function(result) {
		if (result.errors) {
			callback(result);
		} else {
			callback(null, document);
		}
	});
};

documents.filter = function(filter, tag, callback) {
	tag = tag || '';
	console.log(tag);
	r.table('Documents').filter(function(row) {
		console.log(['filter', arguments]);
		return r.let({it: row, tag: r.expr(tag)},
				r.branch(r.js('return ' + filter).and(r.js('if(tag === "") {return true;} if(it.tags == undefined) {return false;} for (var i = 0; i < it.tags.length; i++) {if(it.tags[i] === tag) {return true;}} return false;')),
				r.expr(true), r.expr(false))
		);
	}).run().collect(function(rows) {
		console.log(['collect', JSON.stringify(arguments)]);
		callback(null, rows);
	});
};

documents.read = function(name, callback) {
	r.table('Documents').get(name).run(function(result) {
		if (!result) {
			return callback(null, null);
		} else {
			return callback(null, result);
		}
	});
};

documents.readAll = function(name, callback) {
	var results = [];
	r.table('Documents').run().collect(function(results) {
		if (results.errors) { //TODO: Error handling, verify this path is even possible
			callback(results);
		} else {
			callback(null, results);
		}
	});
};

documents.update = function(name, document, callback) {
	r.table('Documents').get(name).update(document).run(function(result) {
		if (result.errors) {
			callback(result);
		} else {
			callback(null, document);
		}
	});
};

documents.del = function(name, callback) {
	r.table('Documents').get(name).del().run(function(result) {
		callback();
	});
};

//Templates
templates.create = function(name, template, callback) {
	callback('Not implemented');
};

templates.filter = function(name, callback) {
	callback('Not implemented');
};

templates.read = function(name, callback) {
	callback('Not implemented');
};

templates.readAll = function(callback) {
	callback('Not implemented');
};

templates.update = function(name, template, callback) {
	callback('Not implemented');
};

templates.del = function(name, callback) {
	callback('Not implemented');
};

//Site Maps
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