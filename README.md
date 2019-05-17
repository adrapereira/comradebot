# comradebot
Slack bot to help manage Scrum ceremonies - DSM, Plan Poker, etc.

<a href="https://slack.com/oauth/authorize?client_id=398662978112.398824341985&scope=commands,chat:write:bot,channels:read,groups:read,users:read"><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"></a>

## Planning Poker
To start a planning poker call the command `/pp` or `/planpoker` followed by the title of the voting. 
This will trigger a message by the bot calling all users in the channel to vote on the topic.

![Planning poker voting](https://github.com/adrapereira/comradebot/raw/assets/readme_images/names_have_voted.PNG)

After each user has voted, their name will appear on the message, but the vote value will be hidden until the session creator finishes the voting.
Everyone can update their votes as many times as they want until the voting finishes, so don't worry if you make a mistake!

The creator is able to Finish the session, Cancel or even Reset it using his admin panel. 
This message is only visible to whoever called the command, and it's their responsibility to control the workflow in the best way possible.

![Creator panel](https://github.com/adrapereira/comradebot/raw/assets/readme_images/creator_panel.PNG)

Once the voting is finished, it's time to see the results!

![Voting results](https://github.com/adrapereira/comradebot/raw/assets/readme_images/vote_result.PNG)

If something went wrong and the creator prefers to cancel the voting, everyone would be notified.

![Voting canceled](https://github.com/adrapereira/comradebot/raw/assets/readme_images/voting_canceled.PNG)

## Daily Scrum Meeting - DSM
The `/dsm/` command starts a session for a daily scrum meeting with voice chat. Each user is invited to the meeting and forwared to the meeting link (if applicable).
Once the meeting starts, the list of users is randomized and the bot asks each user sequentially to talk about their work.

```Still in development - basic workflow started```

# Tech stack
This project was built using some of the latest libraries and frameworks available.

- [Node.js](https://nodejs.org/en/)
- [Express.js](https://expressjs.com/)
- [DynamoDB](https://aws.amazon.com/pt/dynamodb/)
- [PouchDb](https://github.com/pouchdb/pouchdb)
- [Handlebars.js](https://handlebarsjs.com/)
