'use strict';

define(['backbone', 'dispatcher', '../models/templateModule'], function (backbone, dispatcher, model) {

	var TemplateManagementContext = backbone.Model.extend({
		initialize: function () {
			this.set('dataTemplate', new model.Template());
			this.set('layoutTemplate', new model.Template());
			
			this.set('templates', new model.TemplateCollection());

			return this;
		}
	});

	return new TemplateManagementContext();
});