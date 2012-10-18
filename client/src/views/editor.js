'use strict';

define(['jquery', 'knockout', 'knockback', 'ace', 'EventBus'], function($, ko, kb, ace, eventBus) {
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

		afterRender: function(elements) {
			cleanupEditor.apply(this);

			this.editor = ace.edit(elements[0]);
			this.editor.setTheme("ace/theme/monokai");
			this.editor.getSession().setMode("ace/mode/javascript");
		},

		beforeRemove: function() {
			cleanupEditor.apply(this);
		}
	});
});