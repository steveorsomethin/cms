'use strict';

define(['../core/commandMap', '../context/templateModule', '../models/templateModule', 'underscore', 'dispatcher'], function (CommandMap, context, model, _, dispatcher) {

	return CommandMap.extend({
		events: {
			'templates:load': 'loadTemplates',

			'layoutTemplate:select': 'selectLayoutTemplate',
			'layoutTemplate:create': 'createLayoutTemplate',

			'dataTemplate:select': 'selectDataTemplate',
			'dataTemplate:create': 'createDataTemplate'
		},

		loadTemplates: function () {
			context.get('templates').fetch({
				success: function (collection) {
					dispatcher.trigger('layoutTemplate:select', { 'template': _.first(collection.where({ isLayout: true })) });
					dispatcher.trigger('dataTemplate:select', { 'template': _.first(collection.where({ isLayout: false })) });
				}
			});
		},

		selectDataTemplate: function (e) {
			context.set('template', e.template);
			context.set('dataTemplate', e.template);
		},

		createDataTemplate: function (e) {
			context.get('templates').add(new model.Template(e.defaults));
		},

		selectLayoutTemplate: function (e) {
			context.set('template', e.template);
			context.set('layoutTemplate', e.template);
		},

		createLayoutTemplate: function (e) {
			context.get('templates').add(new model.Template(e.defaults));
		}
	})
});