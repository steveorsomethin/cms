'use strict';

define([
	'EventBus',
	'../core/commandMap',
	'../model'
	], 
	function(eventBus, CommandMap, model) {
		return CommandMap.extend({
			events: {
				"addProperty": "addProperty"
			},

			addProperty: function(propertyList) {
				propertyList.add(new model.Property());
			}
		});
	}
);