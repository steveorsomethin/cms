'use strict';

define(['backbone', '../views/shell'], function (backbone, ShellViewModel) {

	return backbone.Model.extend({
		initialize: function () {
		}
	}, {
		start: function (element) {
			ShellViewModel.start(element);
		}
	})
});