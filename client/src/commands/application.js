'use strict';

define(['../core/commandMap', '../controllers/application'], function (CommandMap, controller) {

	return CommandMap.extend({
		events: {
			'application:start': 'start'
		},

		start: function (e) {
			ApplicationController.start(e.element);
		}
	})
})