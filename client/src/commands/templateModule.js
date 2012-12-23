'use strict';

define(['../core/commandMap', '../context/templateModule', '../models/templateModule', 'dispatcher'], function (CommandMap, context, model, dispatcher) {

	return CommandMap.extend({
		events: {
			'templates:load': 'loadTemplates',

			'layoutTemplate:select': 'selectLayoutTemplate',
			'layoutTemplate:create': 'createLayoutTemplate',

			'dataTemplate:select': 'selectDataTemplate',
			'dataTemplate:create': 'createDataTemplate'
		},

		loadTemplates: function () {
			context.get('templates').fetch();
		},

		selectDataTemplate: function (e) {
			context.set('dataTemplate', e.template);
		},

		createDataTemplate: function (e) {
			context.get('templates').add(new model.Template(e.defaults));
		},

		selectLayoutTemplate: function (e) {
			context.set('layoutTemplate', e.template);
		},

		createLayoutTemplate: function (e) {
			context.get('templates').add(new model.Template(e.defaults));
		}
	})
});