'use strict';

var linkImplementation = function(source, target, expectedFuncs) {
	var i, funcName,
		implError = 'Supplied documentType module implementation is missing required function ';

	for (i = 0; i < expectedFuncs.length; i++) {
		funcName = expectedFuncs[i];

		if (typeof source[funcName] !== 'function') {
			throw new Error(implError + funcName);
		} else {
			target[funcName] = source[funcName];
		}
	}
};

var crud = ['create', 'filter', 'read', 'readAll', 'update', 'del'];

module.exports = {
	DocumentTypeRepo: function(impl) {
		linkImplementation(impl, this, crud);
	},

	DocumentRepo: function(impl) {
		linkImplementation(impl, this, crud);
	},

	TemplateRepo: function(impl) {
		linkImplementation(impl, this, crud);
	},

	SiteMapRepo: function(impl) {
		linkImplementation(impl, this, crud);
	}
};