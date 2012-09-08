'use strict';

var linkImplementation = function(source, target, expectedFuncs) {
	var i, funcName;
	
	for (i = 0; i < expectedFuncs.length; i++) {
		funcName = expectedFuncs[i];

		if (typeof source[funcName] !== 'function') {
			throw new Error(
				'Supplied datatype module implementation is ' +
				'missing required function ' + funcName);
		} else {
			target[funcName] = source[funcName];
		}
	}
}

module.exports = {
	DataTypeRepo: function(impl) {
		linkImplementation(impl, this, 
			['createDataType', 'readDataType', 'updateDataType', 'deleteDataType']);
	},

	EntityRepo: function(impl) {
		linkImplementation(impl, this, 
			['createEntity', 'readEntity', 'updateEntity', 'deleteEntity']);
	},

	TemplateRepo: function(impl) {
		linkImplementation(impl, this, 
			['createTemplate', 'readTemplate', 'updateTemplate', 'deleteTemplate']);
	}
};