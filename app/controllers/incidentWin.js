Alloy.Globals.currentWindow = "IncidentWin";
var obj = {
	name : "IncidentWin",
	ref : $.incidentWin,
};
Alloy.Globals.winStack.push(obj);

$.menu.changeBackgroundColor('IncidentWin');

Ti.Geolocation.purpose = 'Location based services for the app';
Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_NEAREST_TEN_METERS;
Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;

//-----------------------------------------------------------------------------variable declaration

var Map = require('ti.map');
var mainMapView;
var witnessSource = [];
var viewArray = [];

var witnessSourceReal = [];
var viewArrayReal = [];

////----------------------------------------------------------------------------- dependency calling

var anno2 = Map.createAnnotation({latitude: 18.97, pincolor: Map.ANNOTATION_BLUE, longitude: 72.82, title: "Drag Me 2", subtitle: "This is anno2", draggable: true});
var anno3 = Map.createAnnotation({latitude: 18.97, longitude: 72.82, title: "anno3", subtitle: "This is anno3", draggable: true});
//----------------------------------------------------------------------------- function Body



function goPrevious() {
	if ($.witnessView.addingViewDisplayed == 1) {
		$.witnessView.addingViewDisplayed = 0;
		hideWitnessAddingScreen();
		resetOtherDriver();
		return;
	}
	if ($.witnessViewReal.addingViewDisplayed == 1) {
		$.witnessViewReal.addingViewDisplayed = 0;
		hideWitnessAddingScreenReal();
		resetWitness();
		return;
	}
	if ($.parentScrollableView.currentPageIndex == 0) {
		return;
	} else {
		if ($.parentScrollableView.currentPageIndex == 3) {
			closeOverlay();
		}
		$.parentScrollableView.movePrevious();
	}
}



function goNext() {
	if ($.parentScrollableView.currentPageIndex == 6) {
		return;
	} else {
		if($.parentScrollableView.currentPageIndex == 6)
		{
			loadFinalData();
		}
		$.parentScrollableView.moveNext();
	}
}


$.parentScrollableView.addEventListener('scrollend', function(e) {
	$.parentScrollableView.currentPageIndex = e.currentPage;

	if ($.parentScrollableView.currentPageIndex == 2 && $.mapBackground.mapLoaded == 0) {
		$.mapBackground.mapLoaded = 1;
		
		mainMapView = Map.createView({
			mapType : Map.NORMAL_TYPE,
			animate : true,
			regionFit : true,
			userLocation : true,
			enableZoomControls : false,
			annotations: [anno3],
			width : "100%",
			height : "100%",
			top : '0',
			left : '0'
		}); 
		
		
		mainMapView.addEventListener('pinchangedragstate', function(e) {
			Ti.API.info(e.title + ": newState=" + e.newState + ", lat=" + e.annotation.latitude + ", lon=" + e.annotation.longitude);
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
	}
	else
	{
		if(Alloy.Globals.switchValue == -1 && $.parentScrollableView.currentPageIndex == 3)
		{
			var anim = Ti.UI.createAnimation();
			anim.duration = 400;
			anim.top = "0%";
			$.overlayBackground.animate(anim);
			$.overlayView.animate(anim);
			anim = null;
		}
	}

});


function captureImageFromCamera() {
	Ti.Media.showCamera({
		showControls : true,
		mediaTypes : Ti.Media.MEDIA_TYPE_PHOTO,
		autohide : true,
		allowEditing : true,
		success : function(event) {
			var imageView = Ti.UI.createImageView({
				image : event.media,
				width : 320,
				height : 480
			});
			switch($.imageSelection.selcectorTag)
			{
				case 0 : $.img1.image = imageView.image;$.imageSelection.selcectorTag = 1;break;
				case 1 : $.img2.image = imageView.image;$.imageSelection.selcectorTag = 2;break;
				case 2 : $.img3.image = imageView.image;$.imageSelection.selcectorTag = 3;break;
				case 3 : $.img4.image = imageView.image;$.imageSelection.selcectorTag = 4;break;
			}
		},
		cancel : function() {
		},
		error : function(error) {
			Ti.API.error('Delfos Mobile', JSON.stringify(error));
		}
	});
}

function getPicFromGallery () {
  Titanium.Media.openPhotoGallery({
		mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO],

		success : function(event) {
			var imageG = event.media;

			Ti.API.info("before" + imageG.height + " x " + imageG.width);
			Ti.API.info("before" + imageG.length);
			var imageView = Titanium.UI.createImageView({
				image : imageG,
				width : 200,
				height : 200
			});

			var imageN = imageView.toImage();

			switch($.imageSelection.selcectorTag)
			{
				case 0 : $.img1.image = imageN;$.imageSelection.selcectorTag = 1;break;
				case 1 : $.img2.image = imageN;$.imageSelection.selcectorTag = 2;break;
				case 2 : $.img3.image = imageN;$.imageSelection.selcectorTag = 3;break;
				case 3 : $.img4.image = imageN;$.imageSelection.selcectorTag = 4;break;
			}

		}
	});
}

function changeToggle () {
  Alloy.Globals.switchValue = -(Alloy.Globals.switchValue);
}


function closeOverlay() {
	var anim = Ti.UI.createAnimation();
	anim.duration = 400;
	anim.top = "100%";
	$.overlayBackground.animate(anim);
	$.overlayView.animate(anim);
	anim = null;
}

function hideWitnessAddingScreen() {
	var anim = Ti.UI.createAnimation();
	anim.duration = 400;
	anim.left = "100%";
	$.witnessData.animate(anim);
	anim = null;
	$.witnessView.addingViewDisplayed = 0;
}


function animateToShowAddingScreen() {
	$.witnessNameTextField.id = "";
	$.witnessView.toEdit = 0;
	var anim = Ti.UI.createAnimation();
	anim.left = "0%";
	anim.duration = 300;
	$.witnessData.animate(anim);
	anim = null;
	$.witnessView.addingViewDisplayed = 1;
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

function validateAndSave () {

	var name = $.witnessNameTextField.value;
	name.replace(' ', '');
	if(name.length == 0)
	{
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
	if($.witnessLastNameTextField.value.length == 0)
	{
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
	
	if($.witnessView.toEdit == 1)
	{
		var temp = [];
		for(i=0;i<witnessSource.length;i++)
		{
			if(blob.id == $.witnessNameTextField.id)
			{
				temp.push(blob);
				alert("replacing with name "+blob.name);
			}
			else
			{
				alert('no replacement');
				temp.push(witnessSource[i]);
			}
		}
		witnessSource = [];
		witnessSource = temp;
		temp = [];
	}
	else
	{
		witnessSource.push(blob);
	}
	
	$.witnessNameTextField.id = "";
	$.witnessNameTextField.value = "";
	$.witnessPhoneTextField.value = "";
	$.witnessEmailTextField.value = "";
	$.witnessLastNameTextField.value = "";
	$.witnessDescriptionTextArea.value = "";
	$.injuriesTextArea.value = "";
	
	createWitnessView();
	hideWitnessAddingScreen();
}

function clear1 () {
  $.witnessNameTextField.value = "";
}

function clear2 () {
  $.witnessPhoneTextField.value = "";
}

function clear3 () {
  $.witnessEmailTextField.value = "";
}

function clear4 () {
  $.witnessLastNameTextField.value = "";
}

function clear5 () {
  $.witnessDescriptionTextArea.value = "";
}

function clear6 () {
  $.injuriesTextArea.value = "";
}

function createWitnessView () {
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
	for(i=0;i<witnessSource.length;i++)
	{
		viewArray.push(createCustomView(witnessSource[i],i));
	}
	for(i=0;i<viewArray.length;i++)
	{
		$.ListCollectionScroller.add(viewArray[i]);
	}
}

function createCustomView(blob, index) {
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
		id : blob.name+blob.phone+blob.emailId+blob.carRegistration
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
		$.witnessNameTextField.id = blob.name+blob.phone+blob.emailId+blob.carRegistration,
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
		$.witnessView.toEdit = 1;
		$.witnessView.addingViewDisplayed = 1;
	}); 

	mainView.addEventListener('swipe',function(e){
		if(e.direction == 'right')
		{
			deleteButton.opacity = 1.0;
			deleteButton.touchEnabled = true;
			var anim = Ti.UI.createAnimation();
			anim.duration = 500;
			anim.left = 70;
			anim.right = -50;
			mainView.animate(anim);
			anim.addEventListener('complete',function(e){
				var animComplete = Ti.UI.createAnimation();
				animComplete.duration = 300;
				animComplete.left = 60;
				anim.right = -40;
				mainView.animate(animComplete);
				animComplete = null;
			});
		}else
		{
			if(e.direction = 'left')
			{
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

	deleteButton.addEventListener('click',function(e){
		if(deleteButton.touchEnabled == false)
		{
			return;
		}
		// witnessSource
		var temp = [];
		for(i=0;i<witnessSource.length;i++)
		{
			if(witnessSource[i].id == mainView.id)
			{
				
			}
			else
			{
				temp.push(witnessSource[i]);
			}
		}
		witnessSource = temp;
		createWitnessView();
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

//--------------------------------------------------------------------------------------------
function resetWitness() {
	$.witnessNameTextFieldReal.id = "";
	$.witnessNameTextFieldReal.value = "";
	$.witnessPhoneReal.value = "";
	$.witnessEmailTextFieldReal.value = "";
}

function clear1Real () {
  $.witnessNameTextFieldReal.value = "";
}
function clear2Real () {
  $.witnessPhoneReal.value = "";
}
function clear3Real () {
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
function animateToShowAddingScreenWitnessReal () {
  $.witnessNameTextFieldReal.id = "";
	$.witnessViewReal.toEdit = 0;
	var anim = Ti.UI.createAnimation();
	anim.left = "0%";
	anim.duration = 300;
	$.witnessDataReal.animate(anim);
	anim = null;
	$.witnessViewReal.addingViewDisplayed = 1;
}
function hideWitnessAddingScreenReal() {
	var anim = Ti.UI.createAnimation();
	anim.duration = 400;
	anim.left = "100%";
	$.witnessDataReal.animate(anim);
	anim = null;
	$.witnessViewReal.addingViewDisplayed = 0;
}
function validateAndSaveWitnessReal () {
  var name = $.witnessNameTextFieldReal.value;
	name.replace(' ', '');
	if(name.length == 0)
	{
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
	
	if($.witnessViewReal.toEdit == 1)
	{
		var temp = [];
		for(i=0;i<witnessSourceReal.length;i++)
		{
			if(blob.id == $.witnessNameTextFieldReal.id)
			{
				temp.push(blob);
			}
			else
			{
				temp.push(witnessSourceReal[i]);
			}
		}
		witnessSourceReal = [];
		witnessSourceReal = temp;
		temp = [];
	}
	else
	{
		witnessSourceReal.push(blob);
	}
	
	$.witnessNameTextFieldReal.id = "";
	$.witnessNameTextFieldReal.value = "";
	$.witnessPhoneReal.value = "";
	$.witnessEmailTextFieldReal.value = "";
	
	// alert("all data is valid");
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
	for ( i = 0; i < witnessSourceReal.length; i++) {
		viewArrayReal.push(createCustomViewReal(witnessSourceReal[i], i));
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
		id : blob.name+blob.phone+blob.emailId
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
		$.witnessNameTextFieldReal.id = blob.name+blob.phone+blob.emailId,
		$.witnessNameTextFieldReal.value = blob.name;
		$.witnessPhoneReal.value = blob.phone;
		$.witnessEmailTextFieldReal.value = blob.emailId;
		
		var anim = Ti.UI.createAnimation();
		anim.left = "0%";
		anim.duration = 300;
		$.witnessDataReal.animate(anim);
		anim = null;
		$.witnessViewReal.toEdit = 1;
		$.witnessViewReal.addingViewDisplayed = 1;
	}); 

	mainView.addEventListener('swipe',function(e){
		if(e.direction == 'right')
		{
			deleteButton.opacity = 1.0;
			deleteButton.touchEnabled = true;
			var anim = Ti.UI.createAnimation();
			anim.duration = 500;
			anim.left = 70;
			anim.right = -50;
			mainView.animate(anim);
			anim.addEventListener('complete',function(e){
				var animComplete = Ti.UI.createAnimation();
				animComplete.duration = 300;
				animComplete.left = 60;
				anim.right = -40;
				mainView.animate(animComplete);
				animComplete = null;
			});
		}else
		{
			if(e.direction = 'left')
			{
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

	deleteButton.addEventListener('click',function(e){
		if(deleteButton.touchEnabled == false)
		{
			return;
		}
		// witnessSource
		var temp = [];
		for(i=0;i<witnessSourceReal.length;i++)
		{
			if(witnessSourceReal[i].id == mainView.id)
			{
				
			}
			else
			{
				temp.push(witnessSourceReal[i]);
			}
		}
		witnessSourceReal = [];
		witnessSourceReal = temp;
		createWitnessViewReal();
	});
	
	mainView.add(NameHeading);
	mainView.add(nameLabel);
	mainView.add(detailView);
	containerView.add(deleteButton);
	containerView.add(mainView);
	return containerView;
}

//----------------------------------------------------------------------------------------------


// load the data to email

function loadFinalData () {
	 
  
}
