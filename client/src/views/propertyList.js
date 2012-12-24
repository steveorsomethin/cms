'use strict';

define(['knockout', 'knockback', './editor.js', 'EventBus'], function(ko, kb, EditorViewModel, eventBus) {
	return kb.ViewModel.extend({
		//TODO: Make this dynamic/configurable
		types: ko.observableArray(['string', 'integer', 'float', 'boolean']),

		removeProperty: function(propertyViewModel) {
			eventBus.trigger('removeProperty', propertyViewModel.model());
		},

		toggleRequired: function(propertyViewModel) {
			var model = propertyViewModel.model(),
				required = model.get('required');

			model.set('required', !required);
		}
	});
});