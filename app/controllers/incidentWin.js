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


////----------------------------------------------------------------------------- dependency calling


//----------------------------------------------------------------------------- function Body


function goPrevious () {
  if ($.parentScrollableView.currentPageIndex == 0) {
		return;
	} else {
		$.parentScrollableView.movePrevious();
	}
}


function goNext() {
	if ($.parentScrollableView.currentPageIndex == 3) {
		return;
	} else {
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
			width : "100%",
			height : "100%",
			top : '0',
			left : '0'
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


