const AWS = require("aws-sdk");

AWS.config.update({
    region: "eu-central-1"
});

const ddb = new AWS.DynamoDB.DocumentClient();

module.exports = {
    updateItem: function (item) {
        var params = {
            TableName: "sb_teams",
            Item: item
        };

        ddb.put(params, function(err, data) {
            if (err) {
                console.error("Unable to add/update team", item.name, ". Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Add/update succeeded: ", item.name);
            }
        });
    },

    getItem: function(id, callback){
        var params = {
            TableName: 'sb_teams',
            Key: {
                'id' : id,
            }
        };
        ddb.get(params, function(err, data) {
            if (err) {
                console.log("Error", err);
            } else {
                callback(data.Item);
            }
        });
    }
};

