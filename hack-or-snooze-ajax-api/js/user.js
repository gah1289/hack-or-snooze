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
// const starList = Array.from(document.querySelectorAll('.star'));

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
					favoritesList.push(e.target.parentElement.id);
					$favStoriesList.append(favListItem);
					localStorage.setItem('favorites', JSON.stringify(favoritesList));
				}
				else {
					localStorage.removeItem('favorites');
					favoritesList = favoritesList.filter((li) => li !== e.target.parentElement.id);
					localStorage.setItem('favorites', JSON.stringify(favoritesList));
				}
				localStorage.setItem('list', JSON.stringify(localStorageStories));
			}
		});

		localStorage.favorites.includes(starList[i].parentElement.id)
			? (starList[i].checked = true)
			: (starList[i].checked = false);
	}
}
