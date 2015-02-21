if (Meteor.isClient) {
    Template.main.helpers({
        rows: function () {
            return LabourForceSurveyEstimates.find({ NORTH: 'Goods-producing sector'});
        }
    });
}