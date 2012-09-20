'use strict';

var model = module.exports = {};

var enforceTypes = function(obj, definition) {
	var property;
	for (var key in definition) {
		property = definition[key];
		obj[key] = property.type(obj[key] || property.default);
	}

	return obj;
};

//Functions for enforcing serialization of primitive types on json payloads
model.String = String;
model.Number = Number;

//Javascript's default Boolean('false') returns true. Thus, the following
model.Boolean = function(value) {
	if (!Boolean(value) || (typeof value === 'string' && value.toLowerCase() === 'false')) 
		return false;

	return true;
}

model.DocumentProperty = function(obj) {
	return enforceTypes(obj, {
		type: {type: model.String, default: 'string'},
		required: {type: model.Boolean, default: false}
	});
};

model.DocumentType = function(obj) {
	for (var key in obj) {
		obj[key] = model.DocumentProperty(obj[key]);
	}

	return obj;
}