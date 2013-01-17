'use strict';

define([
		'jquery',
		'knockout',
		'knockback',
		'ace',
		'dispatcher',
	], 
	function($, ko, kb, ace, eventBus) {
		var cleanupEditor = function() {
			if (this.editor) {
				this.editor.destroy();
				this.editor = null;
			}
		};

		var addHandlers = function() {
			var self = this;

			self.editor.on('blur', function() {
				self.editorText(self.editor.getValue());
			});
		};

		//TODO: These handlers are total hacks that know how they will be used. Fix this ASAP
		var jsonTextHandler = function() {
			return JSON.stringify(this.model().toJSON(), undefined, 4);
		};

		var htmlTextHandler = function() {
			return this.model().get('body');
		};

		return kb.ViewModel.extend({
			constructor: function(model) {
				kb.ViewModel.prototype.constructor.apply(this, arguments);

				this.template = { name: 'editor', src: 'src/views/shared', model: this };
				this.editorText = ko.observable();

				this.setMode('json');
			},

			setMode: function(mode) {
				switch (mode) {
					case 'html':
						this.textHandler = htmlTextHandler.bind(this);
						this.aceMode = 'ace/mode/html';
						break;
					case 'json':
					default:
						this.textHandler = jsonTextHandler.bind(this);
						this.aceMode = 'ace/mode/json';
						break;
				}
			},

			afterRender: function(elements, viewModel) {
				var text = viewModel.textHandler(),
					editor;

				cleanupEditor.call(viewModel);

				editor = viewModel.editor = ace.edit(elements[0]);
				editor.setTheme("ace/theme/textmate");
				editor.getSession().setMode(viewModel.aceMode);
				editor.setValue(text);
				editor.clearSelection();

				addHandlers.call(viewModel);
			},

			beforeRemove: function() {
				cleanupEditor.call(viewModel);
			}
		});
});