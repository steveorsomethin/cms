'use strict';

//TODO: Make this sniff and populate from an environment variable/path instead
var config = module.exports = {
	port: 8088,
	mongoConnection: 'mongodb://dbadmin:!Sm3llf4rts@ds041177.mongolab.com:41177/GutenbergMongoLab'
};

config.persistence = require('./persistence/mongoose').call(this, config.mongoConnection);
config.domain = require('./domain').call(this, config.persistence);

module.exports = config;