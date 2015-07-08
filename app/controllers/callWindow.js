Alloy.Globals.currentWindow = "CallWin";


function initiateCall() {
	// var dialog = Ti.UI.createAlertDialog({
		// cancel : 1,
		// buttonNames : ['Confirm', 'Cancel'],
		// message : 'Would you like to call this number?',
	// });
	// dialog.addEventListener('click', function(e) {
		// if (e.index === e.source.cancel) {
			// Ti.API.info('The cancel button was clicked');
		// } else {
			var the_number = "9730823580";
			Ti.Platform.openURL('tel:' + the_number);
		// }
	// });
	// dialog.show();
}
