function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;
	updateTweetTimes(tweet_array);
	updateCategories(tweet_array);
	updateUserWritten(tweet_array);
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});

function updateTweetTimes(tweet_array)
{
	let earlyTweet = tweet_array[0];
	let latestTweet = tweet_array[0];

	for (let i = 0; i < tweet_array.length; i++)
	{
		let tweet = tweet_array[i];
		if (tweet.time < earlyTweet.time)
		{
			earlyTweet = tweet;
		}

		if (tweet.time > latestTweet.time)
		{
			latestTweet = tweet;
		}
	}

	document.getElementById("firstDate").innerText = earlyTweet.time.toLocaleDateString();
	document.getElementById("lastDate").innerText = latestTweet.time.toLocaleDateString();
}

function updateCategories(tweet_array)
{
	let completedAmount = 0;
	let liveAmount = 0;
	let achievementAmount = 0;
	let miscellaneousAmount = 0;

	for (let i = 0; i < tweet_array.length; i++)
	{
		let tweet = tweet_array[i];
		let source = tweet.source;
		if (source === "live_event")
		{
			liveAmount++;
			continue;
		}

		if (source === "achievement")
		{
			achievementAmount++;
			continue;
		}

		if (source === "completed_event")
		{
			completedAmount++;
			continue;
		}

		miscellaneousAmount++;
	}

	let totalTweets = tweet_array.length;
	let completedPercentage = ((completedAmount / totalTweets) * 100).toFixed(2);
	let livePercentage = ((liveAmount / totalTweets) * 100).toFixed(2);
	let achievementPercentage = ((achievementAmount / totalTweets) * 100).toFixed(2);
	let miscellaneousPercentage = ((miscellaneousAmount / totalTweets) * 100).toFixed(2);

	updateAmount(document.getElementsByClassName("completedEvents"), completedAmount);
	updateAmount(document.getElementsByClassName("liveEvents"), liveAmount);
	updateAmount(document.getElementsByClassName("achievements"), achievementAmount);
	updateAmount(document.getElementsByClassName("miscellaneous"), miscellaneousAmount);

	updateAmount(document.getElementsByClassName("completedEventsPct"), completedPercentage + "%");
	updateAmount(document.getElementsByClassName("liveEventsPct"), livePercentage + "%");
	updateAmount(document.getElementsByClassName("achievementsPct"), achievementPercentage + "%");
	updateAmount(document.getElementsByClassName("miscellaneousPct"), miscellaneousPercentage + "%");
}

function updateAmount(elements, amount)
{
	for (let i = 0; i < elements.length; i++)
	{
		elements[i].innerHTML = amount;
	}
}

function updateUserWritten(tweet_array)
{
	let userWrittenAmount = 0;
	let completedEvents = 0;

	for (let i = 0; i < tweet_array.length; i++)
	{
		let tweet = tweet_array[i];

		if (tweet.source !== "completed_event")
		{
			continue;
		}

		completedEvents++;
		if (tweet.written)
		{
			userWrittenAmount++;
		}
	}

	let percentage = ((userWrittenAmount / completedEvents) * 100).toFixed(2);
	updateAmount(document.getElementsByClassName("written"), userWrittenAmount);
	updateAmount(document.getElementsByClassName("writtenPct"), percentage + "%");
}