'use strict';

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
	console.debug('navAllStories', evt);
	hidePageComponents();
	$storyForm.hide();
	putStoriesOnPage();
	$('.star').show();
	const starList = Array.from(document.querySelectorAll('.star'));

	starList.forEach(
		(star) =>
			localStorage.favorites.includes(star.parentElement.id) ? (star.checked = true) : (star.checked = false)
	);
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
	$storyForm.hide();
	$allStoriesList.show();
	Array.from($('.star')).forEach(
		(star) =>
			star.checked === false
				? star.parentElement.classList.add('hidden')
				: star.parentElement.classList.remove('hidden')
	);
	Array.from($('.star')).forEach(function(star) {
		star.addEventListener('click', function() {
			star.parentElement.classList.add('hidden');
			localStorage.removeItem('favorites');
			favoritesList = favoritesList.filter(function(favorite) {
				favorite !== star.parentElement;
				localStorage.removeItem('favorites');
				localStorage.setItem('favorites', favorite);
			});
		});
		// localStorage.favorites.includes(star.parentElement.id) ? (star.checked = true) : (star.checked = false);
	});
}
$('#fav-link').on('click', navFavoritesClick);
// Generate favorites list

function navMyStoriesClick() {
	putStoriesOnPage();
	$myStoriesList.removeClass('hidden');
	let li = document.querySelectorAll('li');
	li.forEach(function(story) {
		let storyUser = story.children[5];
		if (storyUser.innerText.indexOf(currentUser.username) !== -1) {
			let trash = story.querySelector('.trash');
			trash.classList.remove('hidden');
		}
		else {
			storyUser.parentElement.classList.add('hidden');
		}
	});
	hidePageComponents();

	$myStoriesList.show();
}

$('#my-stories-link').on('click', navMyStoriesClick);
