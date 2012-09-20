'use strict';

var linkImplementation = function(source, target, expectedFuncs) {
	var i, funcName;
	
	for (i = 0; i < expectedFuncs.length; i++) {
		funcName = expectedFuncs[i];

		if (typeof source[funcName] !== 'function') {
			throw new Error(
				'Supplied documentType module implementation is ' +
				'missing required function ' + funcName);
		} else {
			target[funcName] = source[funcName];
		}
	}
}

var crud = ['create', 'read', 'update', 'delete'];

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