var cheerio = Meteor.npmRequire('cheerio');

Meteor.startup(function () {
    // code to run on server at startup
    console.log("starting currminer");
});

Meteor.methods({
    getCurrencyNames: function() {
	    var url = "http://coinmarketcap.com/currencies/views/all/";
	    response = Meteor.http.get(url);
	    
	    var doc = cheerio.load(response.content);
	    
	    Currencies.remove({});
	    doc(".currency-name a").each(function () {
	    	var currName = doc(this).text();
	    	var currLink = doc(this).attr('href');
	    	Currencies.insert({
	    		currencyName: currName, currencyLink: currLink
	    	}, function(err, id) {
	    		if (err === null) {
	    			console.log("INFO: added currency ", id);
	    		} else {
	    			console.log("ERROR: ", err);
	    		}
	    	});
	    });
    }
});