let showingAggregated = false;
let [modifiedTweets, mostTweetedActivities] = [];

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
	let mostTweeted = getTop3MostTweetedActivity();
	[modifiedTweets, mostTweetedActivities] = getModifiedTweets(mostTweeted);
	graphActivityAmount(modifiedTweets)

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
	graphDistanceByDay(mostTweetedActivities);
	document.getElementById("aggregate").addEventListener("click", onAggregateClick);
	updateLastInfo();
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
			time: tweet.time.toLocaleDateString("en-US", {
				weekday: "short"
			}),
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

function graphActivityAmount(modifiedTweets)
{
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

function graphDistanceByDay(mostTweetedActivities)
{
	let distance_vis_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A graph of the the distance mentioned in the most tweeted activities by day of the week.",
		"width": 300,
		"height": 200,
		"data": {
			"values": mostTweetedActivities
		},
		"mark": "point",
		"encoding": {
			"x":{
				"field": "time",
				"type": "nominal",
				"title": "time (day)",
				"sort": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
			},
			"y":{
				"field": "distance",
				"type": "quantitative",
				"title": "distance",
			},
			"color": {
				"field": "activityType",
				"type": "nominal",
				"title": "activity type",
			}
		},
		//TODO: Add mark and encoding
	};
	vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});
}

function graphDistanceMeanByDay(mostTweetedActivities)
{
	let distance_vis_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A graph of the the distance mentioned in the most tweeted activities by day of the week.",
		"width": 300,
		"height": 200,
		"data": {
			"values": mostTweetedActivities
		},
		"mark": "point",
		"encoding": {
			"x":{
				"field": "time",
				"type": "nominal",
				"title": "time (day)",
				"sort": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
			},
			"y":{
				"field": "distance",
				"type": "quantitative",
				"title": "Mean of distance",
				"aggregate": "mean",
			},
			"color": {
				"field": "activityType",
				"type": "nominal",
				"title": "activity type",
			}
		},
		//TODO: Add mark and encoding
	};
	vegaEmbed('#distanceVisAggregated', distance_vis_spec, {actions:false});
}

function onAggregateClick()
{
	if (showingAggregated)
	{
		graphDistanceByDay(mostTweetedActivities);
		document.getElementById("distanceVisAggregated").innerHTML = "";
		document.getElementById("aggregate").innerHTML = "Show means";
		showingAggregated = false;
		return;
	}

	document.getElementById("distanceVis").innerHTML = "";
	graphDistanceMeanByDay(mostTweetedActivities);
	document.getElementById("aggregate").innerHTML = "Show all activities";
	showingAggregated = true;
}

function updateLastInfo()
{
	document.getElementById("longestActivityType").innerHTML = "bike";
	document.getElementById("shortestActivityType").innerHTML = "walk";
	document.getElementById("weekdayOrWeekendLonger").innerHTML = "the Weekend";
}