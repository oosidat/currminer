Kadira.connect('CQhGeb2rDge544iHS', '6f3b2590-22f7-4b80-9b07-8487ee0e2499');

var cheerio = Meteor.npmRequire('cheerio');
dataUrl = "http://coinmarketcap.com/static/generated_pages/currencies/datapoints/"


Meteor.startup(function () {
    // code to run on server at startup
    console.log("starting currminer");
});

Meteor.publish("currencyList", function() {
	return Currencies.find({});
})

Meteor.methods({
    getCurrencyNames: function() {
	    var url = "http://coinmarketcap.com/currencies/views/all/";
	    response = Meteor.http.get(url);
	    
	    var doc = cheerio.load(response.content);
	    
	    Currencies.remove({});
		var i = 1;
	    doc(".currency-name a").each(function () {
	    	var currName = doc(this).text();
	    	var currLink = doc(this).attr('href').replace("/currencies/", "").replace("/","");
	    	Currencies.insert({
	    		currencyName: currName, 
	    		currencyLink: currLink,
	    		currencyOrder: i
	    	}, function(err, id) {
	    		if (err === null) {
	    			console.log("INFO: added currency ", id);
	    		} else {
	    			console.log("ERROR: ", err);
	    		}
	    	});
	    	i++;
	    });
    },

    getValues: function(inputjson) {
    	Future = Npm.require('fibers/future');
      	var myFuture = new Future();

    	var response;
    	var curr = inputjson["name"];
    	var freq = inputjson["frequency"]
    	var path = "{0}{1}-{2}.json".format(dataUrl, curr, freq);
    	var today = new Date();
    	
    	console.log("INFO: Calling ", path);
    	
    	Meteor.http.call("GET", path, function(error, result) {
    		if (error) {
    			myFuture.throw(error);
    		} else {
	    		var data = JSON.parse(result.content);
	    		response = parseForCsv(data, "{0}-{1}".format(curr, freq), today, path);
	    		myFuture.return(response);
    		}
    	});
    	return myFuture.wait();
    }
});

function parseForCsv(data, name, dateToday, path) {
	allData = [];
	allData.push({
		"item" : name, 
		"date" : dateToday, 
		"value" : path
	});
	for(var key in data) {
		var val = data[key]
		if (val instanceof Array) {
			for (var i=0; i < val.length; i++) {
				var record = val[i];
				var date = new Date(record[0]);
				var dollarValue = record[1];
				csvRecord = {
					"item"	: key,
					"date"	: date,
					"value"	: dollarValue
				};
				allData.push(csvRecord);
			}
		} else {
			var date = new Date(val);
			csvRecord = {
				"item"	: key,
				"date"	: date,
				"value"	: ""
			};
			allData.push(csvRecord);
		}
	}
	return allData;
}