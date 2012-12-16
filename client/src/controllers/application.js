'use strict';

define(['common', '../views/shell2'], function (common, ShellViewModel) {
	var kb = common.get('knockback');
	var backbone = common.get('backbone');

	return backbone.Model.extend({
		initialize: function () {
		}
	}, {
		start: function (element) {
			ShellViewModel.start(element);
		}
	})
});