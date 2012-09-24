'use strict';

var model = module.exports = {};

var enforceTypes = function(obj, definition) {
	var key, property;
	for (key in definition) {
		if (definition.hasOwnProperty(key)) {
			property = definition[key];
			obj[key] = property.type(obj[key] || property.defaultValue);
		}
	}

	return obj;
};

//Functions for enforcing serialization of primitive types on json payloads
model.String = String;
model.Number = Number;

//Javascript's default Boolean('false') returns true. Thus, the following
model.Boolean = function(value) {
	return !(!Boolean(value) || (typeof value === 'string' && value.toLowerCase() === 'false'));
};

model.DocumentProperty = function(obj) {
	return enforceTypes(obj, {
		type: {type: model.String, defaultValue: 'string'},
		required: {type: model.Boolean, defaultValue: false}
	});
};

model.DocumentType = function(obj) {
	var key;
	for (key in obj) {
		if (obj.hasOwnProperty(key)) {
			obj[key] = model.DocumentProperty(obj[key]);
		}
	}

	return obj;
};