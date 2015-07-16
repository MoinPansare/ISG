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

//-----------------------------------------------------------------------------pdf generation
// works for snapshot


//Require the securely module into your project
// var pdf = require('bencoding.pdf');
//Create a new properties object
// var converters = pdf.createConverters();
// var webView;


var _jsPDF = require('tiPDF');
var _isAndroid = Ti.Platform.osname === 'android';
var _tempFile = null;

// -----------------------------------------------------------------------------variable declaration

var userLat,UserLong;
var dateSelected = "";
var Map = require('ti.map');
var mainMapView;
var witnessSource = [];
var viewArray = [];

var witnessSourceReal = [];
var viewArrayReal = [];

////----------------------------------------------------------------------------- dependency calling

var anno3;
//----------------------------------------------------------------------------- function Body





function saveAndSendEmail() {
	saveDataToDB();
	generatePdfToShow();

	setTimeout(function(e) {
		var emailDialog = Ti.UI.createEmailDialog();
		emailDialog.subject = "Incident Report";
		emailDialog.toRecipients = ['repairs@incidentsupportgroup.co.uk'];
		// emailDialog.toRecipients = ['moin.6192@gmail.com'];
		emailDialog.messageBody = 'Attached is an incident report from ISG helpline App ';
		
		/*
		if (Ti.Platform.osname == 'android') {
			switch($.imageSelection.selcectorTag) {
			case 1 :
			var f = Titanium.Filesystem.getFile(Titanium.Filesystem.getTempDirectory,'img1x.jpg');
			emailDialog.addAttachment(f.read());
				// emailDialog.addAttachment($.img1.toImage().media);
				break;
			case 2 :
			var f = Titanium.Filesystem.getFile(Titanium.Filesystem.getTempDirectory,'img1x.jpg');
			var f1 = Titanium.Filesystem.getFile(Titanium.Filesystem.getTempDirectory,'img2x.jpg');
			emailDialog.addAttachment(f.read());
			emailDialog.addAttachment(f1.read());
				// emailDialog.addAttachment($.img1.toImage().media);
				// emailDialog.addAttachment($.img2.toImage().media);
				break;
			case 3 :
				emailDialog.addAttachment($.img1.toImage().media);
				emailDialog.addAttachment($.img2.toImage().media);
				emailDialog.addAttachment($.img3.toImage().media);
				break;
			case 4 :
				emailDialog.addAttachment($.img1.toImage().media);
				emailDialog.addAttachment($.img2.toImage().media);
				emailDialog.addAttachment($.img3.toImage().media);
				emailDialog.addAttachment($.img4.toImage().media);
				break;
			}
		} else {
			switch($.imageSelection.selcectorTag) {
			case 1 :
				emailDialog.addAttachment($.img1.toImage());
				break;
			case 2 :
				emailDialog.addAttachment($.img1.toImage());
				emailDialog.addAttachment($.img2.toImage());
				break;
			case 3 :
				emailDialog.addAttachment($.img1.toImage());
				emailDialog.addAttachment($.img2.toImage());
				emailDialog.addAttachment($.img3.toImage());
				break;
			case 4 :
				emailDialog.addAttachment($.img1.toImage());
				emailDialog.addAttachment($.img2.toImage());
				emailDialog.addAttachment($.img3.toImage());
				emailDialog.addAttachment($.img4.toImage());
				break;
			}
		}
		*/
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





function goPrevious() {
	$.nextButton.left = "80%";
	$.SendEmail.right = "-50%";
	$.restartButton.left = "60%";
	if($.statusPointer.tag == 1)
	{
		return;
	}
	else
	{
		$.statusPointer.tag--;
		switch($.statusPointer.tag){
			case 1 : $.statusPointer.backgroundImage = "/images/headers/top1.png";break;
			case 2 : $.statusPointer.backgroundImage = "/images/headers/top2.png";break;
			case 3 : $.statusPointer.backgroundImage = "/images/headers/top3.png";break;
			case 4 : $.statusPointer.backgroundImage = "/images/headers/top4.png";break;
			case 5 : $.statusPointer.backgroundImage = "/images/headers/top5.png";break;
			case 6 : $.statusPointer.backgroundImage = "/images/headers/top6.png";break;
			case 7 : $.statusPointer.backgroundImage = "/images/headers/top7.png";break;
		}
		if($.statusPointer.tag < 6 && $.statusPointer.animateRight != 0){
			var anim = Ti.UI.createAnimation();
			anim.duration = 400;
			anim.left = -4;
			$.statusPointer.animate(anim);
			anim = null;
			$.statusPointer.animateRight = 0;
		}
		
	}
	
	
	if ($.witnessView.addingViewDisplayed == 1) {
		$.witnessView.addingViewDisplayed = 0;
		blurInput();
		hideWitnessAddingScreen();
		resetOtherDriver();
		
		return;
	}
	if ($.witnessViewReal.addingViewDisplayed == 1) {
		$.witnessViewReal.addingViewDisplayed = 0;
		blurInputReal();
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
	
	$.backImage.opacity = 1.0;
	$.backImage.touchEnabled = true;
	
	$.restartButton.initiated = 0;
	
	if($.parentScrollableView.currentPageIndex == 5){
		$.nextButton.left = "100%";
		$.SendEmail.right = "2%";
		$.restartButton.left = "55%";
	}
	
	if ($.parentScrollableView.currentPageIndex == 6) {
		
		return;
	} else {
		if($.statusPointer.tag == 2){
			if(dateSelected == "")
			{
				alert("Please Select Incident Date");
				return;
			}
		}
		$.parentScrollableView.moveNext();
	}
	if($.statusPointer.tag == 7)
	{
		return;
	}
	else
	{
		$.statusPointer.tag++;
		switch($.statusPointer.tag){
			case 1 : $.statusPointer.backgroundImage = "/images/headers/top1.png";break;
			case 2 : $.statusPointer.backgroundImage = "/images/headers/top2.png";break;
			case 3 : $.statusPointer.backgroundImage = "/images/headers/top3.png";break;
			case 4 : $.statusPointer.backgroundImage = "/images/headers/top4.png";break;
			case 5 : $.statusPointer.backgroundImage = "/images/headers/top5.png";break;
			case 6 : $.statusPointer.backgroundImage = "/images/headers/top6.png";break;
			case 7 : $.statusPointer.backgroundImage = "/images/headers/top7.png";break;
		}
		if($.statusPointer.tag == 6){
			var anim = Ti.UI.createAnimation();
			anim.duration = 400;
			anim.left = "-43%";
			$.statusPointer.animate(anim);
			anim = null;
			$.statusPointer.animateRight = 1;
		}
	}
	
}



$.parentScrollableView.addEventListener('scrollend', function(e) {
	$.parentScrollableView.currentPageIndex = e.currentPage;
	
	
	if (e.currentPage == 0) {
		$.backImage.opacity = 0.0;
		$.backImage.touchEnabled = false;
	}

	
	if ($.parentScrollableView.currentPageIndex == 2 && $.mapBackground.mapLoaded == 0) {
		
		
		if ($.restartButton.initiated != 1) {
			$.mapBackground.mapLoaded = 1;

			mainMapView = Map.createView({
				mapType : Map.NORMAL_TYPE,
				animate : true,
				regionFit : true,
				userLocation : true,
				enableZoomControls : false,
				width : "100%",
				height : "100%",
				top : '0',
				left : '0'
			});

			mainMapView.addEventListener('pinchangedragstate', function(e) {
				Ti.API.info(e.title + ": newState=" + e.newState + ", lat=" + e.annotation.latitude + ", lon=" + e.annotation.longitude);
				userLat = e.annotation.latitude;
				UserLong = e.annotation.longitude;
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
					userLat = e.coords.latitude;
					UserLong = e.coords.longitude;
					mainMapView.setLocation(region);
				} catch(e) {
					var region = {
						latitude : 18.97,
						longitude : 72.82,
						animate : true,
						latitudeDelta : 0.01,
						longitudeDelta : 0.01
					};
					userLat = 18.97;
					UserLong = 72.82;
					mainMapView.setLocation(region);
					alert("User Location Not Found");
				}

			});
		}
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
	
	if($.parentScrollableView.currentPageIndex == 6)
	{
		loadEnteredDate();
	}
	
	if ($.parentScrollableView.currentPageIndex == 7) {
		alert("loading pdf");
		/*
		var doc = new _jsPDF();
        doc.setProperties({
            title: 'Title',
            subject: 'This is the subject',		
            author: 'Moin',
            keywords: 'one, two, three',
            creator: 'Moin'
        });
        
        var imgSample1 = Ti.Filesystem.resourcesDirectory + 'image1.jpg';
        doc.addImage(imgSample1, 'JPEG', 10, 20, 128, 96);

        doc.setFont("helvetica");
        doc.setFontType("bold");
        doc.setFontSize(24);
        doc.text(20, 180, ' Moin');
        doc.text(20, 190, 'Code with image \nusing Appcelerator studio..');

        doc.addPage();
        doc.rect(20, 120, 10, 10); // empty square
        doc.rect(40, 120, 10, 10, 'F'); // filled square

        var imgSample2 = Ti.Filesystem.resourcesDirectory + 'image2.jpg';
        doc.addImage(imgSample2, 'JPEG', 70, 10, 100, 120);

        doc.setFont("helvetica");
        doc.setFontType("normal");
        doc.setFontSize(24);
        doc.text(20, 180, 'This is what I looked like trying to get');
        doc.text(20, 190, 'the save function into the plugin system.');
        doc.text(20, 200, 'It works now so all of you who doubt me fuck you -- Moin ');

        doc.text(20, 240, (new Date()).toString());

        var timeStampName = new Date().getTime();
        if (_tempFile != null) {
            _tempFile.deleteFile();
        }
        _tempFile = Ti.Filesystem.getFile(Ti.Filesystem.getTempDirectory(), timeStampName + '.pdf');			
        doc.save(_tempFile);
				
		if (_isAndroid) {
			var intent = Ti.Android.createIntent({
				action: Ti.Android.ACTION_VIEW,
				type: "application/pdf",
				data: _tempFile.nativePath
			});
			
			try {
				Ti.Android.currentActivity.startActivity(intent);
			} catch(e) {
				Ti.API.debug(e);
				alert('You have no apps on your device that can open PDFs. Please download one from the marketplace.');
			}
		} else {

            var pdfview = Ti.UI.createWebView({
                backgroundColor: '#eee',
                url: _tempFile.nativePath,
                height: Ti.UI.FILL,
                width: Ti.UI.FILL
            });
            $.PDF_View_1.add(pdfview);
		}*/
		
		generatePdfToShow();
	}
});


function getImageFromCamera() {
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
			switch($.imageSelection.selcectorTag) {
			case 0 :
				$.img1.image = imageView.image;
				$.imageSelection.selcectorTag = 1;
				break;
			case 1 :
				$.img2.image = imageView.image;
				$.imageSelection.selcectorTag = 2;
				break;
			case 2 :
				$.img3.image = imageView.image;
				$.imageSelection.selcectorTag = 3;
				break;
			case 3 :
				$.img4.image = imageView.image;
				$.imageSelection.selcectorTag = 4;
				break;
			}
		},
		cancel : function() {
		},
		error : function(error) {
			Ti.API.error('Delfos Mobile', JSON.stringify(error));
		}
	});
}

function showOptionsToGetImages() {
	
	var initialDialog = Ti.UI.createAlertDialog({
		cancel : 1,
		buttonNames : ['Camera', 'Album',],
		message : 'Please Select The Source To Get Images ',
		title : 'Select Source'
	});
	initialDialog.addEventListener('click', function(e) {
		if (e.index === e.source.cancel) {
			// Ti.API.info('The cancel button was clicked');
			getPicFromGallery();
		} else {
			getImageFromCamera();
		}

	});
	initialDialog.show(); 
}


function getPicFromGallery() {

	if (OS_IOS) {
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

				switch($.imageSelection.selcectorTag) {
				case 0 :
					$.img1.image = imageN;
					$.imageSelection.selcectorTag = 1;
					break;
				case 1 :
					$.img2.image = imageN;
					$.imageSelection.selcectorTag = 2;
					break;
				case 2 :
					$.img3.image = imageN;
					$.imageSelection.selcectorTag = 3;
					break;
				case 3 :
					$.img4.image = imageN;
					$.imageSelection.selcectorTag = 4;
					break;
				}

			}
		});
	} else {
		Titanium.Media.openPhotoGallery({
			success : function(event) {

				//Holds the captured image
				var selectedImg = event.media;

				// Condition to check the selected media
				if (event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {

					//Define an image view with selected image from gallery
					var imgView = Titanium.UI.createImageView({
						left : 10,
						width : 250,
						height : 250,
						image : selectedImg //Set selected image from gallery
					});

					//Add the image to window for displaying
					
					switch($.imageSelection.selcectorTag) {
					case 0 :
						$.img1.image = imgView.image;
						$.imageSelection.selcectorTag = 1;
						break;
					case 1 :
						$.img2.image = imgView.image;
						$.imageSelection.selcectorTag = 2;
						break;
					case 2 :
						$.img3.image = imgView.image;
						$.imageSelection.selcectorTag = 3;
						break;
					case 3 :
						$.img4.image = imgView.image;
						$.imageSelection.selcectorTag = 4;
						break;
					}

				}
			},
			cancel : function() {
				//While cancellation of the process
				
			},
			error : function(error) {
				// If any error occurs during the process
				alert("error on selecting image");
			}
		});
	}

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
		id : $.witnessNameTextField.value+$.witnessPhoneTextField.value+$.witnessEmailTextField.value+$.witnessLastNameTextField.value,
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
			}
			else
			{
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
		color : 'black'
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
		color : 'black'
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
	$.witnessNameTextFieldReal.value = "";
	$.witnessPhoneReal.value = "";
	$.witnessEmailTextFieldReal.value = "";
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
		id : $.witnessNameTextFieldReal.value+$.witnessPhoneReal.value+$.witnessEmailTextFieldReal.value,
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
		color : 'black'
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
		color : 'black'
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
			// alert(witnessSourceReal[i].id);
			// alert(mainView.id);
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



function generatePdf() {
	Ti.Media.takeScreenshot(function(event) {
		// set blob on image view
		var image = event.media;
		var pdfBlob = converters.convertImageToPDF(image, 100);
		var pdfFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'text_moin2.pdf');
		pdfFile.write(pdfBlob);
	});
	
	setTimeout(function(e) {
		
	}, 3000); 
}


function getDatePicker() {
	
	var datepicker = Titanium.UI.createPicker({
		type : Titanium.UI.PICKER_TYPE_DATE,
		useSpinner : true,
		value : new Date(),
		font : {
			fontSize : 33
		},
		left : 0,
		top : "50%",
		width : "65%",
		height : 'auto',
		// height : "40%",
		value : new Date()
	});
	var timepicker = Titanium.UI.createPicker({
		type : Titanium.UI.PICKER_TYPE_TIME,
		format24 : false,
		useSpinner : true,
		timeFormat : 'hh:mm z',
		top : 10,
		font : {
			fontSize : 33
		},
		top : '50%',
		right : '-3%',
		width : '38%',
		height : '40%'
	});
	
	if(OS_IOS)
	{
		datepicker.width = "65%";
		timepicker.right = "-3%";
		timepicker.width = "38%";
	}
	else
	{
		datepicker.width = "53%";
		timepicker.right = "0%";
		timepicker.width = "48%";
	}
	
	var datelabel = "";

	// var cur_date_ref = new Date();
	// var def = cur_date_ref.getUTCFullYear() + "-0" + cur_date_ref.getMonth() + '-' + cur_date_ref.getDate();
	// def = def + "T"+cur_date_ref.getHours() + ":" + cur_date_ref.getMinutes() + ":00";
	// alert(def);
	// datepicker.value = def;
	
	// var timepicker = Titanium.UI.createPicker({
		// type : Titanium.UI.PICKER_TYPE_TIME,
		// format24 : false,
		// useSpinner : true,
		// timeFormat : 'hh:mm z',
		// top : 10,
		// font : {
			// fontSize : 33
		// },
		// top : '-50%',
		// left : '50%',
		// width : '50%',
		// height : '50%'
	// });

	var done = Ti.UI.createImageView({
		backgroundColor : 'transparent',
		color : '#003366',
		// title : 'Done',
		top : '40%',
		right : '0%',
		height : "50",
		width : '80',
		image : "/images/toolbarImages/done1.png",
		borderRadius : 5
	});
	
	

	
	done.addEventListener('click', function(e) {
		$.dateSelectionLabel.tag = 0;
		// var AmPm = "AM";
		// var hours = datepicker.value.getHours();
		// if(hours>=12){
		// AmPm = "PM";
		// if(hours != 12){
		// hours = hours - 12;
		// }
		// }
		// var min = datepicker.value.getMinutes();
		// if(min<10)
		// {
		// min = "0" + min;
		// if(min == 0)
		// {
		// min = "00";
		// }
		// }
		// var time = hours + ":" + min + " " + AmPm;
		// var dateSelected = datepicker.value.getDate() + "-" + (datepicker.value.getMonth() + 1) + "-" + datepicker.value.getFullYear();

		if (timepicker.value.getHours() >= 12) {
			if (timepicker.value.getMinutes() < 10) {
				if (timepicker.value.getHours() == 12) {
					datelabel = ('      ' + datepicker.value.getDate() + '/' + (datepicker.value.getMonth() + 1) + '/' + datepicker.value.getFullYear() + '    ' + 12 + ':0' + timepicker.value.getMinutes() + ' PM');
				} else {
					datelabel = ('      ' + datepicker.value.getDate() + '/' + (datepicker.value.getMonth() + 1) + '/' + datepicker.value.getFullYear() + '    ' + (timepicker.value.getHours() - 12) + ':0' + timepicker.value.getMinutes() + ' PM');
				}
			} else {
				if (timepicker.value.getHours() == 12) {
					datelabel = ('      ' + datepicker.value.getDate() + '/' + (datepicker.value.getMonth() + 1) + '/' + datepicker.value.getFullYear() + '    ' + 12 + ':' + timepicker.value.getMinutes() + ' PM');
				} else {
					datelabel = ('      ' + datepicker.value.getDate() + '/' + (datepicker.value.getMonth() + 1) + '/' + datepicker.value.getFullYear() + '    ' + (timepicker.value.getHours() - 12) + ':' + timepicker.value.getMinutes() + ' PM');
				}
			}
		} else {
			if (timepicker.value.getMinutes() < 10) {
				datelabel = ('      ' + datepicker.value.getDate() + '/' + (datepicker.value.getMonth() + 1) + '/' + datepicker.value.getFullYear() + '    ' + timepicker.value.getHours() + ':0' + timepicker.value.getMinutes() + ' AM');
			} else {
				datelabel = ('      ' + datepicker.value.getDate() + '/' + (datepicker.value.getMonth() + 1) + '/' + datepicker.value.getFullYear() + '    ' + timepicker.value.getHours() + ':' + timepicker.value.getMinutes() + ' AM');
			}
		}
		$.dateSelectionLabel.text = datelabel;
		dateSelected = $.dateSelectionLabel.text;
		datepicker.hide();
		timepicker.hide();
		done.hide();
	}); 

	
	// datepicker.addEventListener('change',function(e){
		// var AmPm = "AM";
		// var hours = datepicker.value.getHours();
		// if(hours>=12){
			// AmPm = "PM";
			// if(hours != 12){
				// hours = hours - 12;
			// }
		// }
		// var min = datepicker.value.getMinutes();
		// if(min<10)
		// {
			// min = "0" + min;
			// if(min == 0)
			// {
				// min = "00";
			// }
		// }
		// var time = hours + ":" + min + " " + AmPm;
		// var dateSelected = datepicker.value.getDate() + "-" + (datepicker.value.getMonth() + 1) + "-" + datepicker.value.getFullYear();
		// dateSelected = dateSelected + " " + time;
		// $.dateSelectionLabel.text = dateSelected;
	// });
	
	if($.dateSelectionLabel.tag == 0){
		$.dateSelectionLabel.tag = 1;
		$.dateSelection.add(datepicker);
		$.dateSelection.add(timepicker);
		$.dateSelection.add(done);
	}
}

function addAnnotationPin () {
	if($.addPin.tag == 0)
	{
		$.addPin.tag = 1;
	}
	ann03 = Map.createAnnotation({latitude: userLat, longitude: UserLong, title: "anno3", subtitle: "This is anno3", draggable: true});
  	var arr = [];
  	arr.push(ann03);
  	mainMapView.addAnnotation(ann03);
}



function loadEnteredDate() {
	$.actualDate.text = $.dateSelectionLabel.text;
	Titanium.Geolocation.reverseGeocoder(userLat, UserLong, function(e) {
		// var arr = e.places[0].address.split(",");
		 // $.actualLocation.text = arr[0] + "," + arr[1] + "," + arr[2] + "," + arr[3] + "," + arr[4];
		 try{
		 $.actualLocation.text = e.places[0].address;
		 }catch(e){
		 	alert("There was a problen in getting your location\nPlease Try Again");
		 }
	});
	
	switch($.imageSelection.selcectorTag) {
	case 1 :
		$.resImg1.image = $.img1.image;
		var img = $.resImg1.toBlob();
		// var resizedImage = img.imageAsResized(160,120);
		// var compression_level = 0.75; 
		var imageFactory = require('ti.imagefactory');
		// resizedImage = imageFactory.compress(resizedImage, compression_level);
		// var destFile = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, 'destination.jpg');
		// destFile.write(resizedImage);
		
		var blobObj = $.img1.toBlob(); 
		var b01 = imageFactory.compress(blobObj,0.0);
 		var f = Titanium.Filesystem.getFile(Titanium.Filesystem.getTempDirectory,'img1x.jpg');
 		f.write(b01);
		break;
	case 2 :
		$.resImg1.image = $.img1.image;
		blobObj = $.img1.toBlob(); 
 		var f = Titanium.Filesystem.getFile(Titanium.Filesystem.getTempDirectory,'img1x.jpg');
 		f.write(blobObj);
 		
		$.resImg2.image = $.img2.image;
		blobObj2 = $.img2.toBlob(); 
 		var f1 = Titanium.Filesystem.getFile(Titanium.Filesystem.getTempDirectory,'img2x.jpg');
 		f1.write(blobObj2);
		break;
	case 3 :
		$.resImg1.image = $.img1.image;
		blobObj = $.img1.toBlob(); 
 		var f = Titanium.Filesystem.getFile(Titanium.Filesystem.getTempDirectory,'img1x.jpg');
 		f.write(blobObj);
 		
 		$.resImg2.image = $.img2.image;
		blobObj2 = $.img2.toBlob(); 
 		var f1 = Titanium.Filesystem.getFile(Titanium.Filesystem.getTempDirectory,'img2x.jpg');
 		f1.write(blobObj2);
 		
 		$.resImg2.image = $.img3.image;
		blobObj3 = $.img3.toBlob(); 
 		var f3 = Titanium.Filesystem.getFile(Titanium.Filesystem.getTempDirectory,'img3x.jpg');
 		f3.write(blobObj3);
 		
		break;
	case 4 :
		$.resImg1.image = $.img1.image;
		blobObj = $.img1.toBlob(); 
 		var f = Titanium.Filesystem.getFile(Titanium.Filesystem.getTempDirectory,'img1x.jpg');
 		f.write(blobObj);
 		
 		$.resImg2.image = $.img2.image;
		blobObj2 = $.img2.toBlob(); 
 		var f1 = Titanium.Filesystem.getFile(Titanium.Filesystem.getTempDirectory,'img2x.jpg');
 		f1.write(blobObj2);
 		
 		$.resImg3.image = $.img3.image;
		blobObj3 = $.img3.toBlob(); 
 		var f3 = Titanium.Filesystem.getFile(Titanium.Filesystem.getTempDirectory,'img3x.jpg');
 		f3.write(blobObj3);
 		
		$.resImg4.image = $.img4.image;
		blobObj4 = $.img4.toBlob(); 
 		var f4 = Titanium.Filesystem.getFile(Titanium.Filesystem.getTempDirectory,'img4x.jpg');
 		f4.write(blobObj4);
		break;
	}

	
	$.numberOfDrivers.text = witnessSource.length + " Drivers";
	$.numberOfWitness.text = witnessSourceReal.length + " Witnesses";
	
	// generatePdfToShow();
}


function generatePdfToShow() {
	var index=0;
	var index_2=0;
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
	
	doc.text(5,30,'Location');
	doc.text(5,40,$.actualLocation.text.toString());
	
	yposition = 40;
	
	for(i=0;i<witnessSource.length;i++)
	{
		if(yposition+80<270)
		{
			
		}
		else
		{
			index = 0;
			doc.addPage();
		}
		doc.text(5,(40+(70*index)+(10+10)),'Other Driver');
		doc.text(5,(40+(70*index)+(20+10)),('Name : '+witnessSource[i].name.toString()));
		doc.text(5,(40+(70*index)+(30+10)),('Phone : '+witnessSource[i].phone.toString()));
		doc.text(5,(40+(70*index)+(40+10)),('Email : '+witnessSource[i].emailId.toString()));
		doc.text(5,(40+(70*index)+(50+10)),('Car Registration : '+witnessSource[i].carRegistration));
		doc.text(5,(40+(70*index)+(60+10)),('Description : '+witnessSource[i].description));
		doc.text(5,(40+(70*index)+(70+10)),('Injury : '+witnessSource[i].injury));
		yposition = (40+(70*index)+(70+10));
		index++;
	}
	
	for(i=0;i<witnessSourceReal.length;i++)
	{
		if(yposition+50<270)
		{
			
		}
		else
		{
			index_2 = 0;
			doc.addPage();
		}
		doc.text(5,(yposition+(40*index_2)+(10+10)),'Witness');
		doc.text(5,(yposition+(40*index_2)+(20+10)),('Name : '+witnessSourceReal[i].name.toString()));
		doc.text(5,(yposition+(40*index_2)+(30+10)),('Phone : '+witnessSourceReal[i].phone.toString()));
		doc.text(5,(yposition+(40*index_2)+(40+10)),('Email : '+witnessSourceReal[i].emailId.toString()));
		yposition = (yposition+(40*index_2)+(40+10));
		index_2 = 0;
	}
	
	// doc.addPage();
	
	// var image=$.img1.toBlob();
    // var str = Ti.Utils.base64encode(image);
 
    // var image2=Ti.Utils.base64decode(str);
    // alert(image2.toString());
	// var imgSample2 = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory,'img1x.jpg');
	// var imgSample2 = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, 'destination.jpg');
	// var imgSample2 = $.resImg1.image;
	// var imgView1 = {
		// width : 'auto',
		// heigth : 'auto',
		// image : imgSample2,
	// };
	// doc.addImage(imgSample2, 'JPEG', 10, 20, 128, 96, 160, 120, 120);	
	
	// doc.rect(20, 120, 10, 10);
	// empty square
	// doc.rect(40, 120, 10, 10, 'F');
	// filled square

	// var imgSample2 = Ti.Filesystem.resourcesDirectory + 'image2.jpg';
	// doc.addImage(imgSample2, 'JPEG', 70, 10, 100, 120);

	// doc.setFont("helvetica");
	// doc.setFontType("normal");
	// doc.setFontSize(24);
	// doc.text(20, 180, 'This is what I looked like trying to get');
	// doc.text(20, 190, 'the save function into the plugin system.');
	// doc.text(20, 200, 'It works now so all of you who doubt me fuck you -- Moin ');
// 
	// doc.text(20, 240, (new Date()).toString());

	// var timeStampName = new Date().getTime();
	if (_tempFile != null) {
		_tempFile.deleteFile();
	}
	_tempFile = Ti.Filesystem.getFile(Ti.Filesystem.getTempDirectory(), 'sendingPdf1.pdf');
	doc.save(_tempFile);

	/*if (_isAndroid) {
		var intent = Ti.Android.createIntent({
			action : Ti.Android.ACTION_VIEW,
			type : "application/pdf",
			data : _tempFile.nativePath
		});

		try {
			Ti.Android.currentActivity.startActivity(intent);
		} catch(e) {
			Ti.API.debug(e);
			alert('You have no apps on your device that can open PDFs. Please download one from the marketplace.');
		}
	} else {

		var pdfview = Ti.UI.createWebView({
			backgroundColor : '#eee',
			url : _tempFile.nativePath,
			height : Ti.UI.FILL,
			width : Ti.UI.FILL
		});
		$.PDF_View_1.add(pdfview);
	}*/
}



function saveDataToDB() {
	var db = require('databaseinteractions');
	var imgView1 = Ti.UI.createImageView({
		image : $.resImg1.image,
		width : 'auto',
		height : 'auto'
	});
	var imgBlob1 = imgView1.toBlob();

	var imgView2 = Ti.UI.createImageView({
		image : $.resImg2.image,
		width : 'auto',
		height : 'auto'
	});
	var imgBlob2 = imgView2.toBlob();

	var imgView3 = Ti.UI.createImageView({
		image : $.resImg3.image,
		width : 'auto',
		height : 'auto'
	});
	var imgBlob3 = imgView3.toBlob();

	var imgView4 = Ti.UI.createImageView({
		image : $.resImg4.image,
		width : 'auto',
		height : 'auto'
	});
	var imgBlob4 = imgView4.toBlob();

	var blobIncident = {
		time : dateSelected,
		location : $.actualLocation.text,
		img1 : imgBlob1,
		img2 : imgBlob2,
		img3 : imgBlob3,
		img4 : imgBlob4,
		imgSelectorTag : $.imageSelection.selcectorTag,
		lat : userLat,
		lon : UserLong,
	};
	// alert(UserLong);

	var otherDriverArr = [];
	for ( i = 0; i < witnessSource.length; i++) {
		var blob = {
			id : witnessSource[i].id,
			name : witnessSource[i].name,
			phone : witnessSource[i].phone,
			emailId : witnessSource[i].emailId,
			carRegistration : witnessSource[i].carRegistration,
			description : witnessSource[i].description,
			injury : witnessSource[i].injury,
		};
		otherDriverArr.push(blob);
	}

	var witnessArr = [];
	for ( i = 0; i < witnessSourceReal.length; i++) {
		var blob = {
			id : witnessSourceReal[i].id,
			name : witnessSourceReal[i].name,
			phone : witnessSourceReal[i].phone,
			emailId : witnessSourceReal[i].emailId,
		};
		witnessArr.push(blob);
	}
	
	db.database.AddIncident(blobIncident);
	db.database.addOtherDriver(otherDriverArr,dateSelected);
	db.database.addWitnesses(witnessArr,dateSelected);
	
	// alert("all success now fetch");
}


function restartProcedure() {
	
	if($.restartButton.touchEnabled == false)
	{
		return;
	}
	
	$.restartButton.initiated = 1;
	
	userLat = "";
	UserLong = "";
	witnessSourceReal = [];
	witnessSource = [];
	dateSelected = "";
	
	var counter = 0;
	while (counter < 8) {
		alert("going back :" + counter);
		goPrevious();
		counter++;
	}

	$.dateSelectionLabel.text = "Select A Date";
}



