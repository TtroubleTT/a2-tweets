function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	updateActivityText(tweet_array);

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
	let modifiedTweets = [];
	for (let i = 0; i < tweet_array.length; i++)
	{
		let tweet = tweet_array[i];
		if (tweet.activityType === "unknown")
		{
			continue;
		}

		if (tweet.distance === -1)
		{
			continue;
		}

		modifiedTweets.push({
			activityType: tweet.activityType,
			distance: tweet.distance
		});
	}

	activity_vis_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A graph of the number of Tweets containing each type of activity.",
		"data": {
			"values": modifiedTweets
		},
		"mark": "bar",
		"encoding": {
			"x":{
				"field": "activityType",
				"type": "nominal",
				"title": "Activity Type",
			},
			"y":{
				"aggregate": "count",
				"type": "quantitative",
				"title": "Number of Tweets",
			}
		}
		//TODO: Add mark and encoding
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});

function updateActivityText(tweet_array)
{
	const activitiesToAmounts = {};
	for (let i = 0; i < tweet_array.length; i++)
	{
		let tweet = tweet_array[i];
		let activityType = tweet.activityType;
		if (activityType === "unknown")
		{
			continue;
		}

		let previousAmount = 0;
		if (activitiesToAmounts.hasOwnProperty(activityType))
		{
			previousAmount = activitiesToAmounts[activityType];
		}

		previousAmount++;
		activitiesToAmounts[activityType] = previousAmount;
	}

	document.getElementById('numberActivities').innerText = Object.keys(activitiesToAmounts).length.toString();

	const descendingKeys = Object.keys(activitiesToAmounts).sort((itemA, itemB) => activitiesToAmounts[itemB] - activitiesToAmounts[itemA]);
	document.getElementById('firstMost').innerText = descendingKeys[0];
	document.getElementById('secondMost').innerText = descendingKeys[1];
	document.getElementById('thirdMost').innerText = descendingKeys[2];
}