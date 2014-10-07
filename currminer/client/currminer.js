Template.download.events({
    'click #refreshData': function () {
        console.log("Refresh Button was clicked");
        Meteor.call("getCurrencyNames", function(err, response) {
            console.log("response: ", response);
            console.log("err: ", err);
        });
    }
});

Template.requestForm.currencyNames = function(){
	return Currencies.find({});
};

Template.download.currencyCount = function(){
	return Currencies.find({}).fetch().length;
};
