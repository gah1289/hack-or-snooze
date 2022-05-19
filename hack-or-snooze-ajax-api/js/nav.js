'use strict';

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
	console.debug('navAllStories', evt);

	hidePageComponents();

	$storyForm.hide();
	// $favStoriesList.hide();
	// $myStoriesList.hide();
	putStoriesOnPage();
	$('.star').show();
}

$body.on('click', '#nav-all', navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
	console.debug('navLoginClick', evt);
	hidePageComponents();
	$loginForm.show();
	$signupForm.show();
}

$navLogin.on('click', navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
	console.debug('updateNavOnLogin');
	$('.main-nav-links').show();
	$navLogin.hide();
	$navLogOut.show();
	$navUserProfile.text(`${currentUser.username}`).show();
}

// users click navbar link
function navSubmitClick() {
	console.debug('navSubmitClick');
	hidePageComponents();
	$storyForm.show();
}

$('#submit-link').on('click', navSubmitClick);

function navFavoritesClick() {
	hidePageComponents();
	$favStoriesList.show();
	$('.star').hide();
	if ($('.star').checked === false) {
		$('.star').parentElement.hide();
	}
}
$('#fav-link').on('click', navFavoritesClick);

function navMyStoriesClick() {
	hidePageComponents();
	$myStoriesList.show();
}

$('#my-stories-link').on('click', navMyStoriesClick);
