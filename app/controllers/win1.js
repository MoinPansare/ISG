Ti.Geolocation.purpose = 'Location based services for the app';
Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_NEAREST_TEN_METERS;
Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;

var backOverlay;

var mainMapView,
    mainMapViewParent;

mainMapViewParent = Ti.UI.createView({
	left : 0,
	right : 0,
	top : 0,
	bottom : 0
});
loadMap();

var view1;
view1 = Ti.UI.createView({
	left : 0,
	right : 0,
	top : 0,
	bottom : 0,
	backgroundColor : 'red'
});

var imageEditView = Ti.UI.createView({
	left : 0,
	right : 0,
	top : 0,
	bottom : 0,
	backgroundColor : '#E0E0E0'
});

var selectionImage1,selectionImage2,selectionImage3,selectionImage4;
var labelAddPic;

getDataForImageSelectionView();

var ViewArr = [view1, mainMapView,imageEditView];
$.parentScrollableView.setViews(ViewArr);

function goPrevious() {
	if ($.parentScrollableView.currentPageIndex == 0) {
		return;
	} else {
		$.parentScrollableView.movePrevious();
	}
}

function goNext() {
	if ($.parentScrollableView.currentPageIndex == 2) {
		return;
	} else {
		$.parentScrollableView.moveNext();
	}
}

$.parentScrollableView.addEventListener('scrollend', function(e) {
	$.parentScrollableView.currentPageIndex = e.currentPage;

	if ($.parentScrollableView.currentPageIndex == 1) {
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

});

function loadMap() {
	var Map = require('ti.map');

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

	mainMapViewParent.add(mainMapView);
}

$.imageView1.addEventListener('pinch', function(e) {
	$.imageView1.height = $.imageView1.baseHeight * e.scale;
	$.imageView1.width = $.imageView1.baseWidth * e.scale;
});

$.imageView2.addEventListener('pinch', function(e) {
	$.imageView2.height = $.imageView2.baseHeight * e.scale;
	$.imageView2.width = $.imageView2.baseWidth * e.scale;
});

$.imageView3.addEventListener('pinch', function(e) {
	$.imageView3.height = $.imageView3.baseHeight * e.scale;
	$.imageView3.width = $.imageView3.baseWidth * e.scale;
});

$.imageView4.addEventListener('pinch', function(e) {
	$.imageView4.height = $.imageView4.baseHeight * e.scale;
	$.imageView4.width = $.imageView4.baseWidth * e.scale;
});

$.imageView1.addEventListener('touchstart', function(e) {
    $.imageView1.baseHeight = $.imageView1.height;
    $.imageView1.baseWidth = $.imageView1.width;
});
$.imageView2.addEventListener('touchstart', function(e) {
    $.imageView2.baseHeight = $.imageView2.height;
    $.imageView2.baseWidth = $.imageView2.width;
});
$.imageView3.addEventListener('touchstart', function(e) {
    $.imageView3.baseHeight = $.imageView3.height;
    $.imageView3.baseWidth = $.imageView3.width;
});
$.imageView4.addEventListener('touchstart', function(e) {
    $.imageView4.baseHeight = $.imageView4.height;
    $.imageView4.baseWidth = $.imageView4.width;
});

function showOverlay() {

	var anim = Ti.UI.createAnimation();
	anim.duration = 200;
	anim.top = 0;
	$.bottomOverlay.animate(anim);
	anim = null;
}

function hideTheBottomOverlay() {
	var anim = Ti.UI.createAnimation();
	anim.duration = 200;
	anim.top = "100%";
	$.bottomOverlay.animate(anim);
	anim = null;
}

function getDataForImageSelectionView () {
	
	var butForCamera = Ti.UI.createLabel({
		left : "7%",
		right : "7%",
		top : "15%",
		backgroundColor : 'white',
		borderWidth : 4,
		borderColor : 'red',
		text : "CAMERA"
	});
	
	butForCamera.addEventListener('click',function(e){
		getPicFromCamera();
	});
	
	var containerForImages = Ti.UI.createView({
		left : "7%",
		right : "7%",
		top : "35%",
		bottom : "10%",
		backgroundColor : '#E0E0E0',
		borderWidth : 4,
		borderColor : 'transparent'
	});
	for(i=1;i<=4;i++)
	{
		containerForImages.add(getSelectionImage(i));
	}
	imageEditView.add(containerForImages);
	imageEditView.add(butForCamera);
}


function getSelectionImage(index) {
	var img = Ti.UI.createImageView({
		width : "37.5%",
		height : "35%",
		image : "/images/dummy/placeholder.png",
		borderRadius : 4,
		borderColor : 'black'
	});
	switch(index) {
	case 1 :
		img.left = "10%";
		img.top = "10%";
		break;
	case 2 :
		img.right = "10%";
		img.top = "10%";
		break;
	case 3 :
		img.left = "10%";
		img.top = "50%";
		break;
	case 4 :
		img.right = "10%";
		img.top = "50%";
		break;
	}
	img.addEventListener('click',function(e){
		chosePic(index,img);
	});
	return img;
}

function chosePic(index,img) {
	
	
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
			Ti.API.info("after" + imageN.height + " x " + imageN.width);
			Ti.API.info("after" + imageN.length);

			
			img.visible = true;
			img.image = imageN;
/*
			if (event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
				var filename = Titanium.Filesystem.applicationDataDirectory + "/" + 'camera_photo' + new Date().getTime() + ".png";
				var f = Titanium.Filesystem.getFile(filename);
				if (f.exists()) {
					//Ti.API.info('The file exist , trying to delete it before using it :' + f.deleteFile());
					f = Titanium.Filesystem.getFile(filename);
				}
				f.write(imageG);

				pathfromgallery = f.nativePath;
			}*/
		}
	});
}



function getPicFromCamera() {
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
			$.temp.image = imageView.image;
		},
		cancel : function() {
		},
		error : function(error) {
			Ti.API.error('Delfos Mobile', JSON.stringify(error));
		}
	});
}



//$.rootWin.open();



/*
 * 
//Define the current window
var myWin = Titanium.UI.currentWindow;
 
//Define the button to activate camera
var cameraBtn = Ti.UI.createButton({
   title   : 'Click to activate Camera',
   top    : 10      //Set the button position on the screen
});
 
cameraBtn.addEventListener('click', function(){
   
   //Activate camera
   Titanium.Media.showCamera({
success : function(event) {
              
              //Holds the captured image
          var capturedImg= event.media;
 
               // Condition to check the selected media
              if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
 
//Define an image view with captured image
                   var imgView = Titanium.UI.createImageView({
                   left       : 10,
                   width    : 250,
                   height   : 250,
                   image   : capturedImg   //Set captured image
});
 
                        //Add the image to window for displaying
myWin.add(imgView);
}
},
cancel : function() {
//While cancellation of the process
},
error : function(error) {
               // If any error occurs during the process
 
}
}); 
 */
