'use strict';

define(['jquery', 'knockout', 'ace'], function ($, ko, ace) {

	ko.bindingHandlers.ace = {
		init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
			$(element).data('editor', ace.edit(element));
		},

		update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
			$(element).data('editor').getSession().setValue(ko.utils.unwrapObservable(viewModel.body));
		}
	}
});