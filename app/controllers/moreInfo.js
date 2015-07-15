Alloy.Globals.currentWindow = "MoreInfo";
var obj = {
	name : "MoreInfo",
	ref : $.moreInfo,
};
Alloy.Globals.winStack.push(obj);

$.menu.changeBackgroundColor('MoreInfo');

if (Alloy.Globals.switchValue > 0) {
	$.switchImage.image = "/images/created/switch_ON.png";
} else {
	$.switchImage.image = "/images/created/switch_OFF.png";
}

getUserDetail();

function toggleSwitch() {
	Alloy.Globals.switchValue = -(Alloy.Globals.switchValue);
	if (Alloy.Globals.switchValue > 0) {
		$.switchImage.image = "/images/created/switch_ON.png";
	} else {
		$.switchImage.image = "/images/created/switch_OFF.png";
	}
}

function showUserInfo() {
	$.backImage.opacity = 1.0;
	$.backImage.touchEnabled = true;
	$.userView.isDisplayed = 1;
	var anim = Ti.UI.createAnimation();
	anim.opacity = 1.0;
	anim.duration = 400;
	anim.left = "0%";
	$.userView.animate(anim);
	anim = null;
}

function showSettings() {
	$.backImage.opacity = 1.0;
	$.backImage.touchEnabled = true;
	$.settingsView.isDisplayed = 1;
	var anim = Ti.UI.createAnimation();
	anim.opacity = 1.0;
	anim.duration = 400;
	anim.left = "0%";
	$.settingsView.animate(anim);
	anim = null;
}

function goBack() {
	if ($.backImage.touchEnabled == false) {
		return;
	}
	var anim = Ti.UI.createAnimation();
	anim.duration = 400;
	anim.left = "99%";
	anim.opacity = 0.0;
	if ($.settingsView.isDisplayed == 1) {
		$.settingsView.isDisplayed = 0;
		$.settingsView.animate(anim);
	}
	if ($.userView.isDisplayed == 1) {
		$.userView.isDisplayed = 0;
		$.userView.animate(anim);
	}
	$.backImage.opacity = 0.0;
	$.backImage.touchEnabled = false;
}

function saveUserInfo () {
  var name = $.userName.value;
	name.replace(' ', '');
	if(name.length == 0)
	{
		alert("Please enter a Name");
		return;
	}
	if (parseFloat($.phoneNumber.value) == 'NaN' || $.phoneNumber.value.length != 10) {
		alert("Telephone Number is Invalid");
		return;
	}
	if (parseFloat($.mobileNumber.value) == 'NaN' || $.mobileNumber.value.length != 10) {
		alert("Mobile Number is Invalid");
		return;
	}
	if (!$.emailId.value.match(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/)) {
		alert("Email Id is Invalid");
		return;
	} 
	var db = require('databaseinteractions');
	var blob = {
		name : $.userName.value,
		policyNumber : $.policyNumber.value,
		carRegistration : $.carRegistration.value,
		phone : $.phoneNumber.value,
		mobile : $.mobileNumber.value,
		emailId : $.emailId.value,
	};
	db.database.saveUser(blob);
}


function getUserDetail() {
	var db = require('databaseinteractions');
	var blob = db.database.getUserDetail();
	if (blob != null) {
		$.userName.value = blob.name;
		$.policyNumber.value = blob.policy;
		$.carRegistration.value = blob.carRegistration;
		$.phoneNumber.value = blob.phone;
		$.mobileNumber.value = blob.mobile;
		$.emailId.value = blob.emailId;
	}

}


