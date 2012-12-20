'use strict';

define(['backbone', '../context/shell'], function (backbone, context) {

	var ShellController = backbone.Model.extend({
		initialize: function () {
			// TODO: intentionally do nothing
		}
	}, {
		getModule: function () {
			return context.get('module');
		},

		getModules: function () {
			return context.get('modules');
		},

		setModule: function (module) {
			context.set('module', module);
		}
	});

	return ShellController;
});