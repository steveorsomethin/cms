var redisPersistence = module.exports = {}

//Data Types
redisPersistence.createDataType = function(name, dataType, callback) {
	callback(null, 'createDataType');
};

redisPersistence.readDataType = function(name, callback) {
	callback(null, 'readDataType');
};

redisPersistence.updateDataType = function(name, dataType, callback) {
	callback(null, 'updateDataType');
};

redisPersistence.deleteDataType = function(name, callback) {
	callback(null, 'deleteDataType');
};

//Entities
redisPersistence.createEntity = function(name, entity, callback) {
	callback(null, 'createEntity');
};

redisPersistence.readEntity = function(name, callback) {
	callback(null, 'readEntity');
};

redisPersistence.updateEntity = function(name, entity, callback) {
	callback(null, 'updateEntity');
};

redisPersistence.deleteEntity = function(name, callback) {
	callback(null, 'deleteEntity');
};

//Templates
redisPersistence.createTemplate = function(name, template, callback) {
	callback(null, 'createTemplate');
};

redisPersistence.readTemplate = function(name, callback) {
	callback(null, 'readTemplate');
};

redisPersistence.updateTemplate = function(name, template, callback) {
	callback(null, 'updateTemplate');
};

redisPersistence.deleteTemplate = function(name, callback) {
	callback(null, 'deleteTemplate');
};