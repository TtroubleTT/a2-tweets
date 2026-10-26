class Tweet {
	private text:string;
	time:Date;

    private activies: string[] = [
        "walk",
        "swim",
        "ski",
        "bike",
        "elliptical workout",
        "row",
        "activity",
        "freestyle",
        "hike",
        "chair ride",
        "skate",
        "snowboard",
        "run",
    ];

    private distances: string[] = [
        "mi",
        "miles",
        "km",
        "kilometres",
    ];

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.

        let lowerCase:string = this.text.toLocaleLowerCase();
        if (lowerCase.includes("achieved") || lowerCase.includes("pb") || lowerCase.includes("personal best") || lowerCase.includes("personal record"))
        {
            return "achievement";
        }

        if (lowerCase.includes("completed") || lowerCase.includes("just posted"))
        {
            return "completed_event";
        }

        if (lowerCase.includes("right now") || lowerCase.includes("live"))
        {
            return "live_event";
        }

        return "miscellaneous";
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        //TODO: identify whether the tweet is written
        let trimmedText:string = this.getTrimmedText();

        let index = trimmedText.indexOf("-");
        if (index === -1)
        {
            return false;
        }

        if (index + 1 >= trimmedText.length)
        {
            return false;
        }

        let substring = trimmedText.substring(index + 1);
        substring = substring.trim();

        return substring.length !== 0;
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }

        //TODO: parse the written text from the tweet
        let trimmedText:string = this.getTrimmedText();
        let index = trimmedText.indexOf("-");
        if (index === -1)
        {
            return "";
        }

        if (index + 1 >= trimmedText.length)
        {
            return "";
        }

        return trimmedText.substring(index + 1);
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }

        let lowerCaseText = this.text.toLocaleLowerCase();
        //TODO: parse the activity type from the text of the tweet
        for (let i = 0; i < this.activies.length; i++)
        {
            let wordToMatch = this.activies[i];
            if (lowerCaseText.search(`\\b${wordToMatch}\\b`) !== -1)
            {
                return wordToMatch;
            }
        }

        return "unknown";
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return -1;
        }

        let lowerCaseText = this.text.toLocaleLowerCase();

        //TODO: prase the distance from the text of the tweet
        for (let i = 0; i < this.distances.length; i++)
        {
            let targetWord = this.distances[i];
            const regex = new RegExp(`([\\d.]+)\\s+${targetWord}\\b`);
            const match = lowerCaseText.match(regex);
            if (match)
            {
                let distance = parseFloat(match[1]);
                if (targetWord === "km" || targetWord === "kilometres")
                {
                    distance = distance / 1.609;
                }

                return distance;
            }
        }

        return -1;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        let match = this.text.match(/https?:\/\/\S+/);
        let updatedTweet = this.text;
        if (match)
        {
            updatedTweet = updatedTweet.replace(/https?:\/\/\S+/, `<a href="${match[0]}">${match[0]}</a>`)
        }

        return `<tr><td>${rowNumber}</td><td>${this.activityType}</td><td>${updatedTweet}</td></tr>`;
    }

    getTrimmedText():string {
        let trimmedText:string = this.text.replace("#RunKeeper", "");
        trimmedText = trimmedText.replace("#Runkeeper", "");
        trimmedText = trimmedText.replace("Check it out!", "");
        trimmedText = trimmedText.replace("Watch!", "");
        trimmedText = trimmedText.replace(/https?:\/\/\S+/g, "").trim();
        return trimmedText;
    }
}