writtenTweets = [];

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//TODO: Filter to just the written tweets
	for (let i = 0; i < tweet_array.length; i++)
	{
		let tweet = tweet_array[i];
		if (tweet.source !== "completed_event")
		{
			continue;
		}

		if (!tweet.written)
		{
			continue;
		}

		writtenTweets.push(tweet);
	}
}

function addEventHandlerForSearch(event) {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	document.getElementById("textFilter").addEventListener("input", makeTable);
}

function makeTable(event)
{
	let input = event.target.value;
	let filteredTweets = [];
	let rows = "";

	if (input === "")
	{
		document.getElementById("tweetTable").innerHTML = "";
		document.getElementById("searchCount").innerHTML = "???";
		document.getElementById("searchText").innerHTML = "???";
		return;
	}

	for (let i = 0; i < writtenTweets.length; i++)
	{
		let tweet = writtenTweets[i];
		if (!tweet.writtenText.toLowerCase().includes(input))
		{
			continue;
		}

		filteredTweets.push(tweet);
	}

	for (let i = 0; i < filteredTweets.length; i++)
	{
		let tweet = filteredTweets[i];
		rows += `<tr><td>${i + 1}</td><td>${tweet.activityType}</td><td>${tweet.text}</td></tr>`;
	}

	document.getElementById("tweetTable").innerHTML = rows;
	document.getElementById("searchCount").innerHTML = filteredTweets.length.toString();
	document.getElementById("searchText").innerHTML = event.target.value;
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});