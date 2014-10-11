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
		event.preventDefault();
		event.stopPropagation();
		console.log('Submitting form!');
		var curr = template.find("#currencyNames").value;
		var freq = template.find("#dataFrequencies").value;
		var input = { "name" : curr, "frequency" : freq };
		
		Meteor.call('getValues', input, function(error, result) {
			console.log(JSON.stringify(result));
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
