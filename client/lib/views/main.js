'use strict';

define(['backbone', './documentType', '../model'], function(backbone, documentTypeView, model) {
    return backbone.View.extend({
		render: function() {
			this.$el.append(new documentTypeView({model: new model.DocumentType({name: 'butts'})}).render().el);
			return this;
		}
    });
});