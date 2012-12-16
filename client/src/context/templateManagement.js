'use strict';

define(['backbone', 'dispatcher', '../models/templateManagement'], function (backbone, dispatcher, model) {

	var TemplateManagementContext = backbone.Model.extend({
		initialize: function () {

			var defaultDataTemplate = new model.DataTemplate({ name: 'New Data Template'});
			var defaultDataTemplateCollection = new model.DataTemplateCollection([defaultDataTemplate]);

			var defaultLayoutTemplate = new model.LayoutTemplate({ name: 'New Layout Template'});
			var defaultLayoutTemplateCollection = new model.LayoutTemplateCollection([defaultLayoutTemplate]);

			this.set('dataTemplate', defaultDataTemplate);
			this.set('dataTemplates', defaultDataTemplateCollection);

			this.set('layoutTemplate', defaultLayoutTemplate);
			this.set('layoutTemplates', defaultLayoutTemplateCollection);

			return this;
		}
	});

	return new TemplateManagementContext();
});