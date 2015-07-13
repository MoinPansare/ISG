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
	
	$.tabImage1.image = "/images/created/home.png";
	$.tabImage2.image = "/images/created/call.png";
	$.tabImage3.image = "/images/created/add_incident.png";
	$.tabImage4.image = "/images/created/incident.png";
	$.tabImage5.image = "/images/created/more.png";
	
	$.tabLabel1.color = "#949494";
	$.tabLabel2.color = "#949494";
	$.tabLabel3.color = "#949494";
	$.tabLabel4.color = "#949494";
	$.tabLabel5.color = "#949494";
	
	switch(id) {
	case 'Home' :
		$.tabImage1.image = "/images/created/home_hover.png";$.tabLabel1.color = "white";
		break;
	case 'CallWin' :
		$.tabImage2.image = "/images/created/call_hover.png";$.tabLabel2.color = "white";
		break;
	case 'IncidentWin' :
		$.tabImage3.image = "/images/created/add_incident_hover.png";$.tabLabel3.color = "white";
		break;
	}
};

