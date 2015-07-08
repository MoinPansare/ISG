$.rootWin.open();
Alloy.Globals.navWindow = $.navwindow;
var win1 = Alloy.createController('win1').getView();


if (OS_IOS) {
	Alloy.Globals.navWindow.openWindow(win1);
} else {
	win1.open();
}

