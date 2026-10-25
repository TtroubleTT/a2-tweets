function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	updateActivityText();

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
	graphActivityAmount()

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});

function updateActivityText()
{
	const activitiesToAmounts = getActivitiesAmounts();
	const descendingKeys = getDescendingKeys(activitiesToAmounts);

	document.getElementById('numberActivities').innerText = Object.keys(activitiesToAmounts).length.toString();
	document.getElementById('firstMost').innerText = descendingKeys[0];
	document.getElementById('secondMost').innerText = descendingKeys[1];
	document.getElementById('thirdMost').innerText = descendingKeys[2];
}

function getActivitiesAmounts()
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

	return activitiesToAmounts;
}

function getDescendingKeys(activitiesToAmounts)
{
	return Object.keys(activitiesToAmounts).sort((itemA, itemB) => activitiesToAmounts[itemB] - activitiesToAmounts[itemA]);
}

function getModifiedTweets(mostTweeted)
{
	let modifiedTweets = [];
	let mostTweetedActivities = [];
	for (let i = 0; i < tweet_array.length; i++)
	{
		let tweet = tweet_array[i];
		let activityType = tweet.activityType;
		if (activityType === "unknown")
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

		if (!mostTweeted.includes(activityType))
		{
			continue;
		}

		mostTweetedActivities.push({
			activityType: tweet.activityType,
			distance: tweet.distance,
			time: tweet.time,
		});
	}

	return [modifiedTweets, mostTweetedActivities];
}

function getTop3MostTweetedActivity()
{
	const activitiesToAmounts = getActivitiesAmounts();
	const descendingKeys = getDescendingKeys(activitiesToAmounts);
	let mostTweeted = [];
	for (let i = 0; i < 3; i++)
	{
		mostTweeted.push(descendingKeys[i]);
	}

	return mostTweeted;
}

function graphActivityAmount()
{
	let mostTweeted = getTop3MostTweetedActivity();
	const [modifiedTweets, mostTweetedActivities]= getModifiedTweets(mostTweeted);

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
}