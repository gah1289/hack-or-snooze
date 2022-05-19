'use strict';

// global to hold the User instance of the currently-logged-in user
let currentUser;
let loggedIn = false;
let localStorageStories = JSON.parse(localStorage.getItem('list')) || [];
let favoritesList = [];

/******************************************************************************
 * User login/signup/login
 */

/** Handle login form submission. If login ok, sets up the user instance */

async function login(evt) {
	console.debug('login', evt);
	evt.preventDefault();

	// grab the username and password
	const username = $('#login-username').val();
	const password = $('#login-password').val();

	// User.login retrieves user info from API and returns User instance
	// which we'll make the globally-available, logged-in user.
	currentUser = await User.login(username, password);

	$loginForm.trigger('reset');

	saveUserCredentialsInLocalStorage();
	updateUIOnUserLogin();
	loggedIn = true;
	for (let star of favStars) {
		star.classList.remove('hidden');
	}
}

$loginForm.on('submit', login);

/** Handle signup form submission. */

async function signup(evt) {
	console.debug('signup', evt);
	evt.preventDefault();

	const name = $('#signup-name').val();
	const username = $('#signup-username').val();
	const password = $('#signup-password').val();

	// User.signup retrieves user info from API and returns User instance
	// which we'll make the globally-available, logged-in user.
	currentUser = await User.signup(username, password, name);

	saveUserCredentialsInLocalStorage();
	updateUIOnUserLogin();

	$signupForm.trigger('reset');
}

$signupForm.on('submit', signup);

/** Handle click of logout button
 *
 * Remove their credentials from localStorage and refresh page
 */

function logout(evt) {
	console.debug('logout', evt);
	localStorage.clear();
	location.reload();
	loggedIn = false;
	for (let star of favStars) {
		star.classList.add('hidden');
	}
}

$navLogOut.on('click', logout);

/******************************************************************************
 * Storing/recalling previously-logged-in-user with localStorage
 */

/** If there are user credentials in local storage, use those to log in
 * that user. This is meant to be called on page load, just once.
 */

async function checkForRememberedUser() {
	console.debug('checkForRememberedUser');
	const token = localStorage.getItem('token');
	const username = localStorage.getItem('username');
	if (!token || !username) return false;

	// try to log in with these credentials (will be null if login failed)
	currentUser = await User.loginViaStoredCredentials(token, username);
	loggedIn = true;
}

/** Sync current user information to localStorage.
 *
 * We store the username/token in localStorage so when the page is refreshed
 * (or the user revisits the site later), they will still be logged in.
 */

function saveUserCredentialsInLocalStorage() {
	console.debug('saveUserCredentialsInLocalStorage');
	if (currentUser) {
		localStorage.setItem('token', currentUser.loginToken);
		localStorage.setItem('username', currentUser.username);
	}
}

/******************************************************************************
 * General UI stuff about users
 */

/** When a user signs up or registers, we want to set up the UI for them:
 *
 * - show the stories list
 * - update nav bar options for logged-in user
 * - generate the user profile part of the page
 */

if (currentUser === undefined) {
	$submitLink.hide();
	$favLink.hide();
}

function updateUIOnUserLogin() {
	console.debug('updateUIOnUserLogin');

	$allStoriesList.show();
	$loginForm.hide();
	$signupForm.hide();
	$submitLink.show();
	$favLink.show();
	showStars();
	updateNavOnLogin();
	saveFavorites();
	// removeFavorites();
}

function showStars(e) {
	for (let star of favStars) {
		star.classList.remove('hidden');
	}
}

function saveFavorites() {
	const starList = Array.from(document.querySelectorAll('.star'));
	const localList = JSON.parse(localStorage.getItem('list'));
	// get items from local storage

	for (let i = 0; i < starList.length; i++) {
		starList[i].addEventListener('click', (e) => {
			const targetTagToLowerCase = e.target.tagName.toLowerCase();
			if (targetTagToLowerCase === 'input') {
				let favListItem = e.target.parentElement.cloneNode(true); // https://gomakethings.com/how-to-copy-or-clone-an-element-with-vanilla-js/
				if (e.target.checked === true) {
					favoritesList.push(e.target.parentElement);
					// let favListItem = e.target.parentElement.cloneNode(true); // https://gomakethings.com/how-to-copy-or-clone-an-element-with-vanilla-js/
					$favStoriesList.append(favListItem);
				}
				else if (e.target.checked === false) {
					console.log(e);
					$favStoriesList.favListItem.remove();
					favoritesList = favoritesList.filter((li) => li !== e.target.parentElement);
					// $favStoriesList[0].children.forEach(
					// 	(li) => (li === e.target.ParentElement ? (li.innerHtml = '') : false)
					// );
				}
			}
		});
	}

	//
	// }
	// favoritesList.push(e.path[1]);
	// if (starList[i].checked === true || localStorageStories[i].isChecked === true) {
	// 	$('#favorites-list').append(`<li>${e.path[1].innerHTML}</li>`);
	// }

	// // $('#favorites-list').append(`<li>${e.path[1].innerHTML}</li>`);
	// let favs = document.querySelectorAll('#favorites-list .star');

	// for (let i = 0; i < favs.length; i++) {
	// 	favs[i].checked = true; // All items in #favorites-list should be checked by default. https://www.javascripttutorial.net/javascript-dom/javascript-get-child-element/
	// }
	// // pushes favorited items to favoritesList; all items sent to favoritesList are checked

	// if (!localStorageStories[i].isChecked) {
	// 	localStorageStories[i].isChecked = true;
	// 	starList[i].checked = true;
	// 	localStorage.setItem('favorites', JSON.stringify(favoritesList));
	// }
	// // else if (localStorageStories[i].isChecked) {
	// // 	localStorageStories[i].isChecked = false;
	// // }

	// localStorage.setItem('list', JSON.stringify(localStorageStories));
	// 	});
	// }

	// console.log(localList);

	// for (let i = 0; i < starList.length; i++) {
	// 	if (localList[i].isChecked === true) {
	// 		starList[i].checked = true;
	// 	}
	// 	// keep stars checked upon refresh
	// 	if (localList[i].isChecked === false) {
	// 		starList[i].checked = false;
	// 	}
	// 	// problem: resetting checked items to false after second refresh
	// }
	// console.log(localList);
}

//
