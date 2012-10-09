'use strict';

define([
	'backbone',
	'dust',
	'text!./propertyList.dust'], 
	function(backbone, dust, template, eventBus) {
	    if (!dust.cache.documentType) dust.loadSource(dust.compile(template, 'propertyList'));

	    return backbone.View.extend({
			tagName: "ul",

	    	initialize: function() {
	    		this.model.on('add', this.render, this);
	    	},

			render: function() {
				var self = this;
				dust.render('propertyList', this.model.toJSON(), function(error, rendered) {
				    self.$el.html(rendered);
				});

				return this;
			}
	    });
	}
);