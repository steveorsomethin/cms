'use strict';

define([
		'knockback',
		'./documentManagement',
		'./templateManagement'
	], function (kb, DocumentManagementViewModel, TemplateManagementViewModel) {

	var factory = new kb.Factory();

	factory.addPathMapping('documentManagement', DocumentManagementViewModel);
	factory.addPathMapping('templateManagement', TemplateManagementViewModel);

	return factory;
});