'use strict';

define(['knockback',
	    'dispatcher',
	    '../context/documentManagement',
	    './navigators/documentManagement',
	    './inspectors/documentManagement'
	   ], function (kb, dispatcher, context, DocumentManagementNavigator, DocumentManagementInspector) {

	//
	// DocumentManagementViewModel

	var DocumentManagementViewModel = kb.ViewModel.extend({
		constructor: function () {

			this.view = { name: 'documentManagement', src: 'src/views', model: this };
			this.navigator = new DocumentManagementNavigatorViewModel(context);

			dispatcher.trigger('documentManagement:loaded');
			
			return this;
		}
	});

	return DocumentManagementViewModel;
});