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
    	var curr = inputjson["name"];
    	var freq = inputjson["frequency"]
    	var path = "{0}{1}-{2}.json".format(dataUrl, curr, freq);
    	console.log(path);
    	response = Meteor.http.get(path);
    	console.log(JSON.stringify(response));
    }
});