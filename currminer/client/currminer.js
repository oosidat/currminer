Meteor.subscribe('currencyList');

Template.download.events({
    'click #refreshData': function () {
        console.log("Refresh Button was clicked");
        Meteor.call("getCurrencyNames", function(err, response) {
            console.log("response: ", response);
            console.log("err: ", err);
        });
    }
});

Template.requestForm.events({
	'submit form': function(event, template) {
		console.log('Submitting form!');
		var curr = template.find("#currencyNames").value;
		var freq = template.find("#dataFrequencies").value;
		var input = { "name" : curr, "frequency" : freq };
		
		Meteor.call('getValues', input, function(error, result) {
			data = JSON.stringify(result);
			csv = json2csv(data, true, true);
      		event.target.href = "data:text/csv;charset=utf-8," + escape(csv);
      		window.location.href = event.target.href;
		});
		return false;
	}
});

Template.requestForm.currencyNames = function(){
	return Currencies.find({}, {sort: {currencyOrder: 1}});
};

Template.download.currencyCount = function(){
	return Currencies.find({}).fetch().length;
};
