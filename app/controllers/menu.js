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
	var foundAtIndex = -1;
	for ( i = 0,
	j = Alloy.Globals.winStack.length - 1; i < j; i++) {
		if (Alloy.Globals.winStack[i].name == id) {
			foundAtIndex = i;
			break;
		}
	}
	if (foundAtIndex != -1) {
		for ( i = Alloy.Globals.winStack.length - 1; i > foundAtIndex; i--) {
			Alloy.Globals.winStack[i].ref.close();
		}
		var temp = [];
		for(i=0;i<foundAtIndex;i++)
		{
			temp.push(Alloy.Globals.winStack[i]);
		}
		Alloy.Globals.winStack = [];
		Alloy.Globals.winStack = temp;
	}

	var win;
	switch(id) {
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
	case 'IncidentWin' :
		if (Alloy.Globals.currentWindow != 'IncidentWin') {
			win = Alloy.createController('incidentWin').getView();
		}
		break;
	default :
		win = null;
		break;
	}
	if (win != null) {
		win.open();
	}
}

exports.changeBackgroundColor = function(id) {
    $.tab1.backgroundColor = 'red';
	$.tab2.backgroundColor = 'green';
	$.tab3.backgroundColor = 'blue';
	$.tab4.backgroundColor = 'yellow';
	$.tab5.backgroundColor = 'red';
	switch(id) {
	case 'Home' :
		$.tab1.backgroundColor = 'black';
		break;
	case 'CallWin' :
		$.tab2.backgroundColor = 'black';
		break;
	case 'IncidentWin' :
		$.tab3.backgroundColor = 'black';
		break;
	}
};

