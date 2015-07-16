Alloy.Globals.currentWindow = "Incidents";
var obj = {
	name : "Incidents",
	ref : $.incidents,
};
Alloy.Globals.winStack.push(obj);

$.menu.changeBackgroundColor('Incidents');

Ti.Geolocation.purpose = 'Location based services for the app';
Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_NEAREST_TEN_METERS;
Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;


var _jsPDF = require('tiPDF');
var _isAndroid = Ti.Platform.osname === 'android';
var _tempFile = null;

//---------------------------------------------------------------------variable declaration
var incidentsArr = [];
var witnessArr = [];
var otherDriverArr = [];
var viewArr = [];
var viewArrayReal = [];
var showAddingScreen;
var userLat,
    userLong;
var anno3;
var Map = require('ti.map');
var mainMapView;
var mapShown = 0;
//---------------------------------------------------------------------initial Loading

loadList();

// -------------------------------------------------------------------------function body

function goPrevious() {
	if ($.backImage.touchEnabled == false) {
		return;
	}

	if ($.parentScrollableView1.currentPageIndex == 0) {
		return;
	}

	if (Alloy.Globals.userLocationChanged == 1) {
		Alloy.Globals.userLocationChanged = 0;
		// update location in both pages

		Titanium.Geolocation.reverseGeocoder(userLat, userLong, function(e) {
			try {
				$.actualLocation.text = e.places[0].address;
				var db = require('databaseinteractions');
				db.database.updateIncident($.actualLocation.text, userLat, userLong, $.actualDate.text);
				getDetailViewFor($.actualDate.text);
			} catch(e) {
				alert("There was a problen in getting your location\nPlease Try Again");
				var db = require('databaseinteractions');
				db.database.updateIncident("Location Not Found", userLat, userLong, $.actualDate.text);
				getDetailViewFor($.actualDate.text);
			}
		});
	}

	if (mapShown == 1) {
		mapShown = 0;
		var anim = Ti.UI.createAnimation();
		anim.left = "100%";
		anim.duartion = 400;
		$.mapBackground.animate(anim);
		if ($.mapBackground && $.mapBackground.children != undefined) {
			var removeData = [];
			for ( i = $.mapBackground.children.length; i > 0; i--) {
				removeData.push($.mapBackground.children[i - 1]);
			};
			for ( i = 0; i < removeData.length; i++) {
				$.mapBackground.remove(removeData[i]);
			}
			removeData = null;
		};
		return;
	}
	if ($.witnessViewReal.addingViewDisplayed12 == 1) {
		blurInputReal();
		resetWitness();
		$.witnessViewReal.addingViewDisplayed12 = 0;
		$.witnessViewReal.toEdit = 0;
		var anim = Ti.UI.createAnimation();
		anim.left = "100%";
		anim.duration = 300;
		$.witnessDataReal.animate(anim);
		showAddingScreen = 0;
		$.witnessViewReal.toEdit = 0;
		anim = null;
		return;
	}

	if ($.driverView.addingViewDisplayed == 1) {
		blurInput();
		resetOtherDriver();
		$.driverView.addingViewDisplayed = 0;
		var anim = Ti.UI.createAnimation();
		anim.left = "100%";
		anim.duration = 300;
		$.witnessData.animate(anim);
		$.witnessData.toEdit = 0;
		anim = null;
		return;
	}

	if (Alloy.Globals.chnageInOtherDriver == 1) {
		Alloy.Globals.chnageInOtherDriver = 0;
		var db = require('databaseinteractions');
		db.database.addOtherDriver(otherDriverArr, $.actualDate.text);
		getDetailViewFor($.actualDate.text);

		return;
	}

	if (Alloy.Globals.changeInWitness == 1) {
		Alloy.Globals.changeInWitness = 0;
		var db = require('databaseinteractions');
		db.database.addWitnesses(witnessArr, $.actualDate.text);
		getDetailViewFor($.actualDate.text);
		return;
	}
	$.parentScrollableView1.movePrevious();
}

function goNext() {

	if ($.nextButton.touchEnabled == false) {
		return;
	}
	if ($.parentScrollableView1.currentPageIndex == 1) {

		return;
	}
	$.parentScrollableView1.moveNext();
}

$.parentScrollableView1.addEventListener('scrollend', function(e) {
	$.parentScrollableView1.currentPageIndex = e.currentPage;
	if (e.currentPage == 0) {
		$.backImage.opacity = 0.0;
		$.backImage.touchEnabled = false;
		$.SendEmail.opacity = 0.0;
		$.SendEmail.touchEnabled = false;
	} else {
		$.backImage.opacity = 1.0;
		$.backImage.touchEnabled = true;
		$.SendEmail.opacity = 1.0;
		$.SendEmail.touchEnabled = true;
	}
});

$.driverWitnessScrollableView.addEventListener('scrollend', function(e) {
	$.driverWitnessScrollableView.currentPageIndex = e.currentPage;
});

function loadList() {

	if ($.listContainer && $.listContainer.children != undefined) {
		var removeData = [];
		for ( i = $.listContainer.children.length; i > 0; i--) {
			removeData.push($.listContainer.children[i - 1]);
		};
		for ( i = 0; i < removeData.length; i++) {
			$.listContainer.remove(removeData[i]);
		}
		removeData = null;
	};

	var db = require('databaseinteractions');
	incidentsArr = db.database.getIncidents();
	// for(i=0;i<incidentsArr.length;i++)
	// {
	// $.listContainer.add(getViewFor(incidentsArr[i],i));
	// }
	for ( i = 0; i < incidentsArr.length; i++) {
		$.listContainer.add(getViewFor(incidentsArr[i], i));
	}
	loadOtherDriversList();
}

function getViewFor(blob, index) {
	var calculatedTop = (index * 60) + 10;
	var containerView = Ti.UI.createView({
		top : calculatedTop,
		left : -5,
		right : -5,
		height : 60,
		backgroundColor : 'transparent',
		bubbleParent : false,
	});
	var deleteButton = Ti.UI.createImageView({
		left : 7,
		width : 40,
		height : 40,
		image : "/images/logo/delete.png",
		bubbleParent : false,
		opacity : 0.0,
		touchEnabled : false
	});
	var mainView = Ti.UI.createView({
		left : 10,
		right : 10,
		height : 50,
		backgroundColor : 'white',
		bubbleParent : false,
		borderRadius : 5,
		id : blob.time
	});
	var NameHeading = Ti.UI.createLabel({
		left : 10,
		height : 25,
		font : {
			fontSize : 18,
			fontWeight : 'bold',
		},
		text : blob.time,
		bubbleParent : true,
		textAlign : Titanium.UI.TEXT_ALIGNMENT_LEFT
	});
	var detailView = Ti.UI.createImageView({
		right : 3,
		width : 25,
		height : 25,
		image : "/images/logo/detail.png",
		bubbleParent : true,
	});

	mainView.addEventListener('click', function(e) {
		witnessArr = [];
		otherDriverArr = [];
		userLat = parseFloat(blob.lat);
		userLong = parseFloat(blob.lon);
		getDetailViewFor(mainView.id);
		$.parentScrollableView1.moveNext();
	});

	mainView.addEventListener('swipe', function(e) {
		if (e.direction == 'right') {
			deleteButton.opacity = 1.0;
			deleteButton.touchEnabled = true;
			var anim = Ti.UI.createAnimation();
			anim.duration = 500;
			anim.left = 70;
			anim.right = -50;
			mainView.animate(anim);
			anim.addEventListener('complete', function(e) {
				var animComplete = Ti.UI.createAnimation();
				animComplete.duration = 300;
				animComplete.left = 60;
				anim.right = -40;
				mainView.animate(animComplete);
				animComplete = null;
			});
		} else {
			if (e.direction = 'left') {
				deleteButton.opacity = 0.0;
				deleteButton.touchEnabled = false;
				var anim = Ti.UI.createAnimation();
				anim.duration = 500;
				anim.left = 10;
				anim.right = 10;
				mainView.animate(anim);
				anim = null;
			}
		}
	});

	deleteButton.addEventListener('click', function(e) {
		// alert(mainView.id);
		if (deleteButton.touchEnabled == false) {
			return;
		}
		// witnessSource
		var temp = [];
		for ( i = 0; i < incidentsArr.length; i++) {
			if (incidentsArr[i].time == mainView.id) {

			} else {
				temp.push(incidentsArr[i]);
			}
		}
		incidentsArr = [];
		incidentsArr = temp;
		var db = require('databaseinteractions');
		db.database.deleteIncident(mainView.id);
		db.database.deleteDriversForIncident(mainView.id);
		db.database.deleteWitnessForIncident(mainView.id);
		loadList();

	});

	mainView.add(NameHeading);
	mainView.add(detailView);
	containerView.add(deleteButton);
	containerView.add(mainView);
	return containerView;
}

function getDetailViewFor(id) {

	$.resImg1.image = "/images/dummy/placeholder.png";
	$.resImg2.image = "/images/dummy/placeholder.png";
	$.resImg3.image = "/images/dummy/placeholder.png";
	$.resImg4.image = "/images/dummy/placeholder.png";

	var selectedDetails;
	var db = require('databaseinteractions');
	otherDriverArr = db.database.getOtherDriversFor(id);
	witnessArr = db.database.getWitnessesFor(id);

	for ( i = 0; i < incidentsArr.length; i++) {
		if (incidentsArr[i].time == id) {
			selectedDetails = incidentsArr[i];
		}
	}

	$.actualDate.text = id;
	$.actualLocation.text = selectedDetails.location;

	switch(parseInt(selectedDetails.selectionTag)) {
	case 1 :
		$.resImg1.image = selectedDetails.img1;
		break;
	case 2 :
		$.resImg1.image = selectedDetails.img1;
		$.resImg2.image = selectedDetails.img2;
		break;
	case 3 :
		$.resImg1.image = selectedDetails.img1;
		$.resImg2.image = selectedDetails.img2;
		$.resImg3.image = selectedDetails.img3;
		break;
	case 4 :
		$.resImg1.image = selectedDetails.img1;
		$.resImg2.image = selectedDetails.img2;
		$.resImg3.image = selectedDetails.img3;
		$.resImg4.image = selectedDetails.img4;
		break;
	}

	$.numberOfDrivers.text = otherDriverArr.length + " Drivers";
	$.numberOfWitness.text = witnessArr.length + " Witnesses";
}

function showOtherDriverScreen() {
	if ($.driverWitnessScrollableView.currentPageIndex == 1) {
		$.driverWitnessScrollableView.movePrevious();
	}
	showingWhichScreen = 1;
	loadOtherDriversList();
	// $.driverWitnessScrollableView.movePrevious();
	$.parentScrollableView1.moveNext();
}

function showWitnessScreen() {
	showingWhichScreen = 2;
	createWitnessViewReal();
	$.driverWitnessScrollableView.moveNext();
	$.parentScrollableView1.moveNext();
}

function animateToShowAddingScreen() {
	$.driverView.addingViewDisplayed = 1;
	var anim = Ti.UI.createAnimation();
	anim.left = "0%";
	anim.duration = 300;
	$.witnessData.animate(anim);
	anim = null;
}

function clear1() {
	$.witnessNameTextField.value = "";
}

function clear2() {
	$.witnessPhoneTextField.value = "";
}

function clear3() {
	$.witnessEmailTextField.value = "";
}

function clear4() {
	$.witnessLastNameTextField.value = "";
}

function clear5() {
	$.witnessDescriptionTextArea.value = "";
}

function clear6() {
	$.injuriesTextArea.value = "";
}

function blurInput() {
	if (OS_IOS) {
		$.witnessNameTextField.blur();
		$.witnessLastNameTextField.blur();
		$.witnessEmailTextField.blur();
		$.witnessPhoneTextField.blur();
		$.witnessDescriptionTextArea.blur();
		$.injuriesTextArea.blur();
	} else {
		Ti.UI.Android.hideSoftKeyboard();
	}
}

function loadOtherDriversList() {
	if ($.ListCollectionScroller && $.ListCollectionScroller.children != undefined) {
		var removeData = [];
		for ( i = $.ListCollectionScroller.children.length; i > 0; i--) {
			removeData.push($.ListCollectionScroller.children[i - 1]);
		};
		for ( i = 0; i < removeData.length; i++) {
			$.ListCollectionScroller.remove(removeData[i]);
		}
		removeData = null;
	};

	viewArray = [];
	for ( i = 0; i < otherDriverArr.length; i++) {
		viewArray.push(createCustomView(otherDriverArr[i], i));
	}
	for ( i = 0; i < viewArray.length; i++) {
		$.ListCollectionScroller.add(viewArray[i]);
	}
}

function createCustomView(blob, index) {
	var identifier;
	setTimeout(function(e) {
		identifier = blob.name + blob.phone + blob.emailId + blob.carRegistration;
		blob.id = identifier;
	}, 0);
	// alert(blob.name);

	var calculatedTop = (index * 80) + 80;
	var containerView = Ti.UI.createView({
		top : calculatedTop,
		left : -5,
		right : -5,
		height : 80,
		backgroundColor : 'transparent',
		bubbleParent : false,
	});
	var deleteButton = Ti.UI.createImageView({
		left : 7,
		width : 40,
		height : 40,
		image : "/images/logo/delete.png",
		bubbleParent : false,
		opacity : 0.0,
		touchEnabled : false
	});
	var mainView = Ti.UI.createView({
		left : 10,
		right : 10,
		height : 70,
		backgroundColor : 'white',
		bubbleParent : false,
		borderRadius : 5,
		id : blob.id
	});
	var NameHeading = Ti.UI.createLabel({
		top : 5,
		left : 10,
		height : 25,
		font : {
			fontSize : 16,
			fontWeight : 'bold',
		},
		text : "Name",
		bubbleParent : true,
	});
	var nameLabel = Ti.UI.createLabel({
		bottom : 5,
		left : 10,
		height : 25,
		font : {
			fontSize : 16,
		},
		attachedBlob : blob,
		text : blob.name,
		bubbleParent : true,
	});
	var detailView = Ti.UI.createImageView({
		right : 3,
		width : 25,
		height : 25,
		image : "/images/logo/detail.png",
		bubbleParent : true,
	});

	mainView.addEventListener('click', function(e) {
		$.witnessNameTextField.id = blob.name + blob.phone + blob.emailId + blob.carRegistration;
		$.witnessNameTextField.value = blob.name;
		$.witnessPhoneTextField.value = blob.phone;
		$.witnessEmailTextField.value = blob.emailId;
		$.witnessLastNameTextField.value = blob.carRegistration;
		$.witnessDescriptionTextArea.value = blob.description;
		$.injuriesTextArea.value = blob.injury;
		var anim = Ti.UI.createAnimation();
		anim.left = "0%";
		anim.duration = 300;
		$.witnessData.animate(anim);
		anim = null;
		$.witnessData.toEdit = 1;
		$.driverView.addingViewDisplayed = 1;
	});

	mainView.addEventListener('swipe', function(e) {
		if (e.direction == 'right') {
			deleteButton.opacity = 1.0;
			deleteButton.touchEnabled = true;
			var anim = Ti.UI.createAnimation();
			anim.duration = 500;
			anim.left = 70;
			anim.right = -50;
			mainView.animate(anim);
			anim.addEventListener('complete', function(e) {
				var animComplete = Ti.UI.createAnimation();
				animComplete.duration = 300;
				animComplete.left = 60;
				anim.right = -40;
				mainView.animate(animComplete);
				animComplete = null;
			});
		} else {
			if (e.direction = 'left') {
				deleteButton.opacity = 0.0;
				deleteButton.touchEnabled = false;
				var anim = Ti.UI.createAnimation();
				anim.duration = 500;
				anim.left = 10;
				anim.right = 10;
				mainView.animate(anim);
				anim = null;
			}
		}
	});

	deleteButton.addEventListener('click', function(e) {
		//otherDriverArr
		// alert(mainView.id);
		if (deleteButton.touchEnabled == false) {
			return;
		}
		// witnessSource
		var temp = [];
		for ( i = 0; i < otherDriverArr.length; i++) {
			if (otherDriverArr[i].id == mainView.id) {

			} else {
				temp.push(otherDriverArr[i]);
			}
		}
		otherDriverArr = temp;
		loadOtherDriversList();
		Alloy.Globals.chnageInOtherDriver = 1;
	});

	mainView.add(NameHeading);
	mainView.add(nameLabel);
	mainView.add(detailView);
	containerView.add(deleteButton);
	containerView.add(mainView);
	return containerView;
}

function resetOtherDriver() {
	$.witnessNameTextField.id = "";
	$.witnessNameTextField.value = "";
	$.witnessPhoneTextField.value = "";
	$.witnessEmailTextField.value = "";
	$.witnessLastNameTextField.value = "";
	$.witnessDescriptionTextArea.value = "";
	$.injuriesTextArea.value = "";
}

function validateAndSave() {
	var name = $.witnessNameTextField.value;
	name.replace(' ', '');
	if (name.length == 0) {
		alert("Please enter a Name");
		return;
	}
	if (parseFloat($.witnessPhoneTextField.value) == 'NaN' || $.witnessPhoneTextField.value.length != 10) {
		alert("Phone Number is Invalid");
		return;
	}
	if (!$.witnessEmailTextField.value.match(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/)) {
		alert("Email Id is Invalid");
		return;
	}
	if ($.witnessLastNameTextField.value.length == 0) {
		alert("Please Enter Car Registration");
		return;
	}
	var blob = {
		id : $.witnessNameTextField.id,
		name : $.witnessNameTextField.value,
		phone : $.witnessPhoneTextField.value,
		emailId : $.witnessEmailTextField.value,
		carRegistration : $.witnessLastNameTextField.value,
		description : $.witnessDescriptionTextArea.value,
		injury : $.injuriesTextArea.value
	};
	if ($.witnessData.toEdit == 1) {
		var temp = [];
		for ( i = 0; i < otherDriverArr.length; i++) {
			if (otherDriverArr[i].id == $.witnessNameTextField.id) {
				Alloy.Globals.chnageInOtherDriver = 1;
				temp.push(blob);
			} else {
				temp.push(otherDriverArr[i]);
			}
		}
		otherDriverArr = [];
		otherDriverArr = temp;
		temp = [];
	} else {
		Alloy.Globals.chnageInOtherDriver = 1;
		otherDriverArr.push(blob);
	}
	$.witnessNameTextField.id = "";
	$.witnessNameTextField.value = "";
	$.witnessPhoneTextField.value = "";
	$.witnessEmailTextField.value = "";
	$.witnessLastNameTextField.value = "";
	$.witnessDescriptionTextArea.value = "";
	$.injuriesTextArea.value = "";
	$.witnessData.toEdit = 0;

	loadOtherDriversList();
	hideWitnessAddingScreen();

}

function hideWitnessAddingScreen() {
	var anim = Ti.UI.createAnimation();
	anim.duration = 400;
	anim.left = "100%";
	$.witnessData.animate(anim);
	anim = null;
	$.driverView.addingViewDisplayed = 0;
}

//-----------------------------------------------------------------Witness View Real

function animateToShowAddingScreenWitnessReal() {

	setTimeout(function(e) {
		$.witnessViewReal.addingViewDisplayed12 = 1;
	}, 0);
	$.witnessViewReal.toEdit = 0;
	resetWitness();
	$.witnessNameTextFieldReal.id = "";
	$.witnessViewReal.toEdit = 0;
	var anim = Ti.UI.createAnimation();
	anim.left = "0%";
	anim.duration = 300;
	$.witnessDataReal.animate(anim);
	showAddingScreen = 1;
	anim = null;
	showAddingScreen = 1;
	$.witnessNameTextFieldReal.value = "";
	$.witnessPhoneReal.value = "";
	$.witnessEmailTextFieldReal.value = "";
}

function hideWitnessAddingScreenReal() {
	var anim = Ti.UI.createAnimation();
	anim.duration = 400;
	anim.left = "100%";
	$.witnessDataReal.animate(anim);
	showAddingScreen = 0;
	anim = null;
	$.witnessViewReal.addingViewDisplayed12 = 0;
}

function validateAndSaveWitnessReal() {
	var name = $.witnessNameTextFieldReal.value;
	name.replace(' ', '');
	if (name.length == 0) {
		alert("Please enter a Name");
		return;
	}
	if ((parseFloat($.witnessPhoneReal.value) == 'NaN') || $.witnessPhoneReal.value.length != 10) {
		alert("Phone Number is Invalid");
		return;
	}
	if (!$.witnessEmailTextFieldReal.value.match(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/)) {
		alert("Email Id is Invalid");
		return;
	}
	var blob = {
		id : $.witnessNameTextFieldReal.id,
		name : $.witnessNameTextFieldReal.value,
		phone : $.witnessPhoneReal.value,
		emailId : $.witnessEmailTextFieldReal.value,
	};
	if ($.witnessViewReal.toEdit == 1) {
		var temp = [];
		for ( i = 0; i < witnessArr.length; i++) {
			if (witnessArr[i].id == $.witnessNameTextFieldReal.id) {
				Alloy.Globals.changeInWitness = 1;
				temp.push(blob);
			} else {
				temp.push(witnessArr[i]);
			}
		}
		witnessArr = [];
		witnessArr = temp;
		temp = [];
	} else {
		Alloy.Globals.changeInWitness = 1;
		witnessArr.push(blob);
	}

	$.witnessNameTextFieldReal.id = "";
	$.witnessNameTextFieldReal.value = "";
	$.witnessPhoneReal.value = "";
	$.witnessEmailTextFieldReal.value = "";

	createWitnessViewReal();
	hideWitnessAddingScreenReal();

}

function createWitnessViewReal() {
	if ($.ListCollectionScrollerWitnessReal && $.ListCollectionScrollerWitnessReal.children != undefined) {
		var removeData = [];
		for ( i = $.ListCollectionScrollerWitnessReal.children.length; i > 0; i--) {
			removeData.push($.ListCollectionScrollerWitnessReal.children[i - 1]);
		};
		for ( i = 0; i < removeData.length; i++) {
			$.ListCollectionScrollerWitnessReal.remove(removeData[i]);
		}
		removeData = null;
	};
	viewArrayReal = [];
	for ( i = 0; i < witnessArr.length; i++) {
		viewArrayReal.push(createCustomViewReal(witnessArr[i], i));
	}
	for ( i = 0; i < viewArrayReal.length; i++) {
		$.ListCollectionScrollerWitnessReal.add(viewArrayReal[i]);
	}
}

function createCustomViewReal(blob, index) {
	var calculatedTop = (index * 80) + 10;
	var containerView = Ti.UI.createView({
		top : calculatedTop,
		left : -5,
		right : -5,
		height : 80,
		backgroundColor : 'transparent',
		bubbleParent : false,
	});
	var deleteButton = Ti.UI.createImageView({
		left : 7,
		width : 40,
		height : 40,
		image : "/images/logo/delete.png",
		bubbleParent : false,
		opacity : 0.0,
		touchEnabled : false
	});
	var mainView = Ti.UI.createView({
		left : 10,
		right : 10,
		height : 70,
		backgroundColor : 'white',
		bubbleParent : false,
		borderRadius : 5,
		id : blob.id
	});
	var NameHeading = Ti.UI.createLabel({
		top : 5,
		left : 10,
		height : 25,
		font : {
			fontSize : 16,
			fontWeight : 'bold',
		},
		text : "Name",
		bubbleParent : true,
	});
	var nameLabel = Ti.UI.createLabel({
		bottom : 5,
		left : 10,
		height : 25,
		font : {
			fontSize : 16,
		},
		attachedBlob : blob,
		text : blob.name,
		bubbleParent : true,
	});
	var detailView = Ti.UI.createImageView({
		right : 3,
		width : 25,
		height : 25,
		image : "/images/logo/detail.png",
		bubbleParent : true,
	});

	mainView.addEventListener('click', function(e) {
		$.witnessNameTextFieldReal.id = blob.name + blob.phone + blob.emailId;
		$.witnessNameTextFieldReal.value = blob.name;
		$.witnessPhoneReal.value = blob.phone;
		$.witnessEmailTextFieldReal.value = blob.emailId;

		var anim = Ti.UI.createAnimation();
		anim.left = "0%";
		anim.duration = 300;
		$.witnessDataReal.animate(anim);
		showAddingScreen = 1;
		anim = null;
		$.witnessViewReal.toEdit = 1;

		setTimeout(function(e) {
			$.witnessViewReal.addingViewDisplayed12 = 1;
		}, 0);

	});

	mainView.addEventListener('swipe', function(e) {
		if (e.direction == 'right') {
			deleteButton.opacity = 1.0;
			deleteButton.touchEnabled = true;
			var anim = Ti.UI.createAnimation();
			anim.duration = 500;
			anim.left = 70;
			anim.right = -50;
			mainView.animate(anim);
			anim.addEventListener('complete', function(e) {
				var animComplete = Ti.UI.createAnimation();
				animComplete.duration = 300;
				animComplete.left = 60;
				anim.right = -40;
				mainView.animate(animComplete);
				animComplete = null;
			});
		} else {
			if (e.direction = 'left') {
				deleteButton.opacity = 0.0;
				deleteButton.touchEnabled = false;
				var anim = Ti.UI.createAnimation();
				anim.duration = 500;
				anim.left = 10;
				anim.right = 10;
				mainView.animate(anim);
				anim = null;
			}
		}
	});

	deleteButton.addEventListener('click', function(e) {
		if (deleteButton.touchEnabled == false) {
			return;
		}
		// witnessArr
		var temp = [];
		for ( i = 0; i < witnessArr.length; i++) {
			alert(witnessArr[i].id);
			alert(witnessArr.id);
			if (witnessArr[i].id == mainView.id) {

			} else {
				temp.push(witnessArr[i]);
			}
		}
		witnessArr = [];
		witnessArr = temp;
		createWitnessViewReal();
		Alloy.Globals.changeInWitness = 1;
	});

	mainView.add(NameHeading);
	mainView.add(nameLabel);
	mainView.add(detailView);
	containerView.add(deleteButton);
	containerView.add(mainView);
	return containerView;
}

function resetWitness() {
	$.witnessNameTextFieldReal.id = "";
	$.witnessNameTextFieldReal.value = "";
	$.witnessPhoneReal.value = "";
	$.witnessEmailTextFieldReal.value = "";
}

function clear1Real() {
	$.witnessNameTextFieldReal.value = "";
}

function clear2Real() {
	$.witnessPhoneReal.value = "";
}

function clear3Real() {
	$.witnessEmailTextFieldReal.value = "";
}

function blurInputReal() {
	if (OS_IOS) {
		$.witnessNameTextFieldReal.blur();
		$.witnessPhoneReal.blur();
		$.witnessEmailTextFieldReal.blur();
	} else {
		Ti.UI.Android.hideSoftKeyboard();
	}
}

//----------------------------------------------

function showMap() {
	anno3 = Map.createAnnotation({
		latitude : parseFloat(userLat).toFixed(4),
		longitude : parseFloat(userLong).toFixed(4),
		title : "Location",
		subtitle : "This is Location of Incident",
		draggable : true
	});

	mapShown = 1;

	mainMapView = Map.createView({
		mapType : Map.NORMAL_TYPE,
		animate : true,
		regionFit : true,
		userLocation : true,
		enableZoomControls : false,
		width : "100%",
		height : "100%",
		top : '0',
		left : '0',
	});

	mainMapView.addEventListener('pinchangedragstate', function(e) {
		Ti.API.info(e.title + ": newState=" + e.newState + ", lat=" + e.annotation.latitude + ", lon=" + e.annotation.longitude);
		userLat = e.annotation.latitude;
		userLong = e.annotation.longitude;
		Alloy.Globals.userLocationChanged = 1;
	});

	$.mapBackground.add(mainMapView);

	Titanium.Geolocation.getCurrentPosition(function(e) {
		try {
			var region = {
				latitude : e.coords.latitude,
				longitude : e.coords.longitude,
				animate : true,
				latitudeDelta : 0.01,
				longitudeDelta : 0.01
			};
			mainMapView.setLocation(region);
		} catch(e) {
			var region = {
				latitude : 18.97,
				longitude : 72.82,
				animate : true,
				latitudeDelta : 0.01,
				longitudeDelta : 0.01
			};
			mainMapView.setLocation(region);
			alert("User Location Not Found");
		}
	});
	mainMapView.addAnnotation(anno3);
	$.mapBackground.add(mainMapView);
	var anim = Ti.UI.createAnimation();
	anim.left = "0%", anim.duration = 400;
	$.mapBackground.animate(anim);

}



function saveAndSendEmail() {
	generatePdfToShow();
	setTimeout(function(e) {
		var emailDialog = Ti.UI.createEmailDialog();
		emailDialog.subject = "Incident Report";
		emailDialog.toRecipients = ['repairs@incidentsupportgroup.co.uk'];
		// emailDialog.toRecipients = ['moin.6192@gmail.com'];
		emailDialog.messageBody = 'Attached is an incident report from ISG helpline App ';

		var file = Ti.Filesystem.getFile(Ti.Filesystem.getTempDirectory(), 'sendingPdf1.pdf');
		if (file.exists()) {
			emailDialog.addAttachment(file.read());
		} else {
			Ti.API.error('file does not exists');
		}

		emailDialog.addEventListener('complete', function(e) {

			if (e.result == emailDialog.SENT) {
				if (Ti.Platform.osname != 'android') {
					// android doesn't give us useful result codes.
					// it anyway shows a toast.
					alert("email sent successfully");
				}
			} else {
				alert("message was not sent. result = " + e.result);
			}
		});
		emailDialog.open();
	}, 100);
}



function generatePdfToShow() {
	var index = 0;
	var index_2 = 0;
	var yposition;
	var doc = new _jsPDF();
	doc.setProperties({
		title : 'Title',
		subject : 'This is the subject',
		author : 'Moin',
		keywords : 'one, two, three',
		creator : 'Moin'
	});

	// var imgSample1 = Ti.Filesystem.resourcesDirectory + 'image1.jpg';
	// doc.addImage(imgSample1, 'JPEG', 10, 20, 128, 96);

	doc.setFont("helvetica");
	doc.setFontType("bold");
	doc.setFontSize(15);
	doc.text(5, 10, 'Date Selected');
	doc.text(5, 20, $.actualDate.text.toString());

	doc.text(5, 30, 'Location');
	doc.text(5, 40, $.actualLocation.text.toString());

	yposition = 40;

	for ( i = 0; i < otherDriverArr.length; i++) {
		if (yposition + 80 < 270) {

		} else {
			index = 0;
			doc.addPage();
		}
		doc.text(5, (40 + (70 * index) + (10 + 10)), 'Other Driver');
		doc.text(5, (40 + (70 * index) + (20 + 10)), ('Name : ' + otherDriverArr[i].name.toString()));
		doc.text(5, (40 + (70 * index) + (30 + 10)), ('Phone : ' + otherDriverArr[i].phone.toString()));
		doc.text(5, (40 + (70 * index) + (40 + 10)), ('Email : ' + otherDriverArr[i].emailId.toString()));
		doc.text(5, (40 + (70 * index) + (50 + 10)), ('Car Registration : ' + otherDriverArr[i].carRegistration));
		doc.text(5, (40 + (70 * index) + (60 + 10)), ('Description : ' + otherDriverArr[i].description));
		doc.text(5, (40 + (70 * index) + (70 + 10)), ('Injury : ' + otherDriverArr[i].injury));
		yposition = (40 + (70 * index) + (70 + 10));
		index++;
	}

	for ( i = 0; i < witnessArr.length; i++) {
		if (yposition + 50 < 270) {

		} else {
			index_2 = 0;
			doc.addPage();
		}
		doc.text(5, (yposition + (40 * index_2) + (10 + 10)), 'Witness');
		doc.text(5, (yposition + (40 * index_2) + (20 + 10)), ('Name : ' + witnessArr[i].name.toString()));
		doc.text(5, (yposition + (40 * index_2) + (30 + 10)), ('Phone : ' + witnessArr[i].phone.toString()));
		doc.text(5, (yposition + (40 * index_2) + (40 + 10)), ('Email : ' + witnessArr[i].emailId.toString()));
		yposition = (yposition + (40 * index_2) + (40 + 10));
		index_2 = 0;
	}
	
	if (_tempFile != null) {
		_tempFile.deleteFile();
	}
	_tempFile = Ti.Filesystem.getFile(Ti.Filesystem.getTempDirectory(), 'sendingPdf1.pdf');
	doc.save(_tempFile);

}