Alloy.Globals.currentWindow = "Home";
var obj = {
	name : "Home",
	ref : $.index,
};
Alloy.Globals.winStack.push(obj);

$.menu.changeBackgroundColor('Home');

$.bodyLabel.text = 'Welcome to the Incident Support Group accident helpline application for Android.\n\nIf you are ever unfortunate enough to be involved in a road traffic accident you will find this App invaluable in guiding you through the best process to ensure you protect your own interests.\n\nIf you are shaken up or simply feel more comfortable speaking to someone, contact us directly and we will assist. Simply press the "Call" button on the next tab and we will personally guide you through the steps required to make certain you gather all the information required following a road traffic accident\n\nWe really hope you never have cause to use this application, but if you do we can assure you that you will be glad you had Incident Support Group on your side!!!';
// $.bodyLabel.text = $.bodyLabel.text + $.bodyLabel.text;
$.index.open();