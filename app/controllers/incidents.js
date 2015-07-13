
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

//---------------------------------------------------------------------variable declaration
var incidentsArr = [];
var witnessArr = [];
var otherDriverArr = [];
var viewArr = [];
var ViewArrReal = [];




//---------------------------------------------------------------------initial Loading

loadList();












// -------------------------------------------------------------------------function body


function goPrevious() {
	if ($.parentScrollableView.currentPageIndex == 0) {
		return;
	}
	if($.parentScrollableView.currentPageIndex == 2 && $.driverView.addingViewDisplayed == 1)
	{
		blurInput();
		resetOtherDriver();
		$.driverView.addingViewDisplayed = 0;
		var anim = Ti.UI.createAnimation();
		anim.left = "100%";
		anim.duration = 300;
		$.witnessData.animate(anim);
		anim = null; 
		return;
	}
	$.parentScrollableView.movePrevious();
}

function goNext() {
	if ($.parentScrollableView.currentPageIndex == 1) {
		return;
	}
	$.parentScrollableView.moveNext();
}

$.parentScrollableView.addEventListener('scrollend', function(e) {
	$.parentScrollableView.currentPageIndex = e.currentPage;

}); 

function loadList() {
	var db = require('databaseinteractions');
	incidentsArr = db.database.getIncidents();
	// for(i=0;i<incidentsArr.length;i++)
	// {
		// $.listContainer.add(getViewFor(incidentsArr[i],i));
	// }
		for(i=0;i<20;i++)
	{
		$.listContainer.add(getViewFor(incidentsArr[0],i));
	}
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
		getDetailViewFor(mainView.id);
		$.parentScrollableView.moveNext();
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
		/*if(deleteButton.touchEnabled == false)
		{
			return;
		}
		// witnessSource
		var temp = [];
		for(i=0;i<witnessSourceReal.length;i++)
		{
			alert(witnessSourceReal[i].id);
			alert(mainView.id);
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
		*/
	});
	
	mainView.add(NameHeading);
	mainView.add(detailView);
	containerView.add(deleteButton);
	containerView.add(mainView);
	return containerView;
}


function getDetailViewFor(id) {
	
	var selectedDetails;
	var db = require('databaseinteractions');
	otherDriverArr = db.database.getOtherDriversFor(id);
	witnessArr = db.database.getWitnessesFor(id);
	
	for(i=0;i<incidentsArr.length;i++)
	{
		if(incidentsArr[i].time == id)
		{
			selectedDetails = incidentsArr[i];
		}
	}
	
	$.actualDate.text = id;
	$.actualLocation.text = selectedDetails.location;
	
	switch(parseInt(selectedDetails.selectionTag))
	{
		case 1 : $.resImg1.image = selectedDetails.img1;break;
		case 2 : $.resImg1.image = selectedDetails.img1;
			$.resImg2.image = selectedDetails.img2;
			break;
		case 3 : $.resImg1.image = selectedDetails.img1;
			$.resImg2.image = selectedDetails.img2;
			$.resImg3.image = selectedDetails.img3;
			break;
		case 4 : $.resImg1.image = selectedDetails.img1;
			$.resImg2.image = selectedDetails.img2;
			$.resImg3.image = selectedDetails.img3;
			$.resImg4.image = selectedDetails.img4;
			break;
	}
	
	$.numberOfDrivers.text = otherDriverArr.length + " Drivers";
	$.numberOfWitness.text = witnessArr.length + " Witnesses";
}


function showOtherDriverScreen() {
	loadOtherDriversList();
	$.driverWitnessScrollableView.movePrevious();
	$.parentScrollableView.moveNext();
}


function animateToShowAddingScreen() {
	$.driverView.addingViewDisplayed = 1;
	var anim = Ti.UI.createAnimation();
	anim.left = "0%";
	anim.duration = 300;
	$.witnessData.animate(anim);
	anim = null;
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
		$.witnessNameTextField.id = blob.id;
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
		$.driverView.toEdit = 1;
		$.driverView.addingViewDisplayed = 1;
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
		/*if(deleteButton.touchEnabled == false)
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
		createWitnessView();*/
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

function validateAndSave () {
  
}




