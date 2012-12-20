'use strict';

define(['backbone', '../views/shell'], function (backbone, ShellViewModel) {

	var ApplicationController = backbone.Model.extend({
		initialize: function () {
		},

		start: function (e) {
			ShellViewModel.start(e.element);
		}
	});

	return new ApplicationController();
});