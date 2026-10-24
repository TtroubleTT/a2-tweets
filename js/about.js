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