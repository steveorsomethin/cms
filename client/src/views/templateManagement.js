'use strict';

define(['knockback', '../context/templateManagement', './navigators/templateManagement'], function (kb, context, TemplateManagementNavigatorViewModel) {

	//
	// TemplateManagementViewModel

	var TemplateManagementViewModel = kb.ViewModel.extend({
		constructor: function () {
			//kb.ViewModel.prototype.constructor.apply(this, arguments);

			this.view = { name: 'templateManagement', src: 'src/views', model: this };
			this.navigator = new TemplateManagementNavigatorViewModel(context);

			//dispatcher.trigger('templateManagement:loaded');
			
			return this;
		}
	});

	return TemplateManagementViewModel;
});