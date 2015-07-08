Alloy.Globals.currentWindow = "Home";
var obj = {
	name : "Home",
	ref : $.index,
};
Alloy.Globals.winStack.push(obj);
var objOfColorChange = {
	id : 'Home'
};
Ti.App.fireEvent('markSelected',objOfColorChange);

$.bodyLabel.text = 'Welcome to the Incident Support Group\naccident helpline application for Android.\n\nIf you are ever unfortunate enough to be\ninvolved in a road traffic accident you will\nfind this App invaluable in guiding you\nthrough the best process to ensure you\nprotect your own interests.\n\nIf you are shaken up or simply feel more\ncomfortable speaking to someone,\ncontact us directly and we will assist.\nSimply press the "Call" button on the next\ntab and we will personally guide you\nthrough the steps required to make\ncertain you gather all the information\nrequired following a road traffic accident\n\nWe really hope you never have cause to\nuse this application, but if you do we can\nassure you that you will be glad you had\nIncident Support Group on your side!!!';
$.bodyLabel.text = $.bodyLabel.text + $.bodyLabel.text;
$.index.open();