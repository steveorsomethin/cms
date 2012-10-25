'use strict';

define([
		'backbone',
		'ApplicationContext',
		'EventBus',
		'../core/commandMap',
		'../model'
	], 
	function(backbone, applicationContext, eventBus, CommandMap, model) {
		return CommandMap.extend({
			events: {
				'loadTemplates': 'loadTemplates',
				'saveTemplate': 'saveTemplate',
				'selectTemplate': 'selectTemplate',
				'createTemplate': 'createTemplate'
			},

			loadTemplates: function() {
				var templates = applicationContext.get('templates');
				templates.url = '/templates';
				templates.fetch();
			},

			saveTemplate: function() {
				var template = applicationContext.get('template');
				backbone.sync('update', template, {url: '/documentTypes/' + template.get('documentType')
					+ '/templates/' + template.get('name')});
			},

			selectTemplate: function(template) {
				applicationContext.set('template', template);
			},

			createTemplate: function() {
				var newTemplate = new model.Template({name: 'New Template'});
				applicationContext.get('templates').add(newTemplate);
				eventBus.trigger('selectTemplate', newTemplate);
			}
		});
	}
);