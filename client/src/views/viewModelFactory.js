'use strict';

define([
		'knockback',
		'./documentModule',
		'./templateModule'
	], function (kb, DocumentModuleViewModel, TemplateModuleViewModel) {

	var factory = new kb.Factory();

	factory.addPathMapping('documentModule', DocumentModuleViewModel);
	factory.addPathMapping('templateModule', TemplateModuleViewModel);

	return factory;
});