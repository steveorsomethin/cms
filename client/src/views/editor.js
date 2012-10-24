'use strict';

define([
		'jquery',
		'knockout',
		'knockback',
		'ace',
		'EventBus',
	], 
	function($, ko, kb, ace, eventBus) {
		var cleanupEditor = function() {
			if (this.editor) {
				this.editor.destroy();
				this.editor = null;
			}
		};

		return kb.ViewModel.extend({
			constructor: function(model) {
				kb.ViewModel.prototype.constructor.apply(this, arguments);
			},

			afterRender: function(elements, viewModel) {
				var jsonText = JSON.stringify(viewModel.model().toJSON(), undefined, 4);

				cleanupEditor.call(viewModel);

				viewModel.editor = ace.edit(elements[0]);
				viewModel.editor.setTheme("ace/theme/twilight");
				viewModel.editor.getSession().setMode("ace/mode/json");
				viewModel.editor.setValue(jsonText);
			},

			beforeRemove: function() {
				cleanupEditor.call(viewModel);
			}
		});
});