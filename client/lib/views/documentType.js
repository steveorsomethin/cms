'use strict';

define([
	'backbone',
	'dust',
	'text!./documentType.dust',
	'EventBus',
	'./propertyList',
	'../model'],
	function(backbone, dust, template, eventBus, propertyListView, model) {
	    if (!dust.cache.documentType) dust.loadSource(dust.compile(template, 'documentType'));

	    return backbone.View.extend({
	    	events: {
	    		'click .add-property-button': 'addProperty',
	    		'click .save-button': 'save'
	    	},

	    	initialize: function() {
	    		this.propertyListView = new propertyListView({model: this.model.propertyList});
	    	},

	    	addProperty: function(event) {
	    		eventBus.trigger('addProperty', this.model.propertyList);
	    	},

	    	save: function(event) {
	    		console.log('Would have saved' + JSON.stringify(this.model.toJSON()));
	    	},

			render: function() {
				var self = this;
				dust.render('documentType', this.model.toJSON(), function(error, rendered) {
				    self.$el.html(rendered);
				    self.$el.find('div').append(self.propertyListView.render().el);
				});

				return this;
			}
	    });
	}
);