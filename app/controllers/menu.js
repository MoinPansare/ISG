/*var win2 = Alloy.createController('win2').getView();
    // For Alloy projects, you can pass context
    // to the controller in the Alloy.createController method.
    // var win2 = Alloy.createController('win2', {foobar: 42}).getView();
    win2.open();
    
*/


function openWin1() {
	openWinFun($.tab1.identifier);
}

function openWin2() {
	openWinFun($.tab2.identifier);
}

function openWin3() {
	openWinFun($.tab3.identifier);
}

function openWin4() {
	openWinFun($.tab4.identifier);
}

function openWin5() {
	openWinFun($.tab5.identifier);
}



function openWinFun(id) {
	var win;
	switch(id) 
	{
		case 'Home' :
			if (Alloy.Globals.currentWindow != 'Home') {
				win = Alloy.createController('index').getView();
			}
			break;
		case 'CallWin' :
			if (Alloy.Globals.currentWindow != 'CallWin') {
				win = Alloy.createController('callWindow').getView();
			}
			break;
		default : win = null;break;
	}
	if(win != null)
	{
		win.open();
	}

}

