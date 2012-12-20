'use strict';

define(['../core/commandMap', '../context/shell', 'dispatcher'], function (CommandMap, context, dispatcher) {

	return CommandMap.extend({
		events: {
			'module:selected': 'setSelectedModule'
		},

		setSelectedModule: function (e) {
			context.set('module', e.module);
		}
	})
});