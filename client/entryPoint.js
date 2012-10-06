'use strict';

define('EventBus', ['backbone'], function(backbone) {

});

define('ApplicationContext', ['./lib/model'], function(model) {
	return {
		documentType: new model.DocumentType('test')
	};
});

define(['jquery'], function($) {
	$(function() {
		var listItemProto = $('#property-list li')[0],
	        typeListProto = $(listItemProto).find('select.type-list'),
	        propertyList = $('#property-list');

	    $(['string', 'integer', 'float', 'boolean']).each(function(index, value) {
	        typeListProto.append($('<option></option>').val(value).html(value));
	    });

	    $(listItemProto).remove();
	    $(listItemProto).removeAttr('style');

	    $('#document-name-text').change(function(event) {
	        $('#document-form').attr('action', '/dt/' + $(this).val());
	    });

	    $('#add-property-button').click(function(event) {
	        var newListItem = $(listItemProto).clone(),
	            fieldNameInput = $(newListItem).find('input.field-name-text'),
	            typeList = $(newListItem).find('select.type-list'),
	            requiredCheckbox = $(newListItem).find('input.required-checkbox');

	        $(propertyList).append(newListItem);

	        fieldNameInput.change(function(event) {
	            var name = event.target.value;

	            fieldNameInput.attr('name', name + ':field-name');
	            typeList.attr('name', name + ':type');
	            requiredCheckbox.attr('name', name + ':required');
	        });
	    });

		console.log('Application started');
	});
});
