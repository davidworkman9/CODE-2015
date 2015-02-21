Router.route('/', {
    template: 'main'
});

Router.route('/industry-graph/:industry', {
    template: 'industryGraph',
    waitOn: function () {
        console.log(this.params.industry);
        return [
            Meteor.subscribe('industries'),
            Meteor.subscribe('industry-data', this.params.industry)
        ];
    },
    data: function () {
        return LabourForceSurveyEstimates.find({ NORTH: this.params.industry });
    }
});