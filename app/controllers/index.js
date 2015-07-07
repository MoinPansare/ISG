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

var ViewArr = [view1, mainMapView];
$.parentScrollableView.setViews(ViewArr);

function goPrevious() {
	if ($.parentScrollableView.currentPageIndex == 0) {
		return;
	} else {
		$.parentScrollableView.movePrevious();
	}
}

function goNext() {
	if ($.parentScrollableView.currentPageIndex == 1) {
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
	backOverlay = Ti.UI.createView({
		top : 0,
		left : 0,
		right : 0,
		bottom : 0,
		backgroundColor : 'black',
		opacity : 0.2
	});

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

$.rootWin.open();
