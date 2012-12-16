'use strict';

define(['../core/commandMap', '../context/templateManagement', 'EventBus'], function (CommandMap, context, dispatcher) {

	return CommandMap.extend({
		events: {
			'dataTemplates:load': 'loadDataTemplates'
		},

		loadDataTemplates: function () {
			context.get('dataTemplates').fetch();
		}
	})
});