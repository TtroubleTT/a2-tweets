class Tweet {
	private text:string;
	time:Date;

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
        //TODO: parse the activity type from the text of the tweet
        return "";
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
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