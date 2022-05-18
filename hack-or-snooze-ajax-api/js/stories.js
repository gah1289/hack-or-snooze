'use strict';

// This is the global list of the stories, an instance of StoryList
let storyList;
let favStar = '<input class="star hidden" type="checkbox">';
let favStars = document.getElementsByClassName('star');

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
	storyList = await StoryList.getStories();
	$storiesLoadingMsg.remove();
	putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

// s

function generateStoryMarkup(story) {
	// console.debug("generateStoryMarkup", story);
	let isChecked = false;
	const hostName = story.getHostName();
	return $(`
      <li id="${story.storyId}">
	${favStar}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
	localStorageStories = [];
	console.debug('putStoriesOnPage');

	$allStoriesList.empty();

	// loop through all of our stories and generate HTML for them
	for (let story of storyList.stories) {
		const $story = generateStoryMarkup(story);
		$allStoriesList.append($story);
		localStorageStories.push({ listItem: $story.get()[0].innerText, isChecked: false });
	}

	$allStoriesList.show();
}

async function submitStory(e) {
	console.debug('submitStory');
	e.preventDefault();
	const author = $('#author-submit').val();
	const title = $('#title-submit').val();
	const url = $('#url-submit').val();
	let isChecked = false;
	const newStory = { title, author, url, isChecked };
	const story = await storyList.addStory(currentUser, newStory);
	const $story = generateStoryMarkup(story);
	$allStoriesList.prepend($story);
	$storyForm.trigger('reset');
}
$storyForm.on('submit', submitStory);

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
}

$loginForm.on('submit', login);
