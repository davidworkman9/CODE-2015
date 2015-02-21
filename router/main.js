Router.configure({
    layoutTemplate: 'layout'
});

Router.route('/', {
    template: 'main',
    name: 'main',
    waitOn: function () {
        return Meteor.subscribe('industries');
    },
    data: function () {
        return {
            industries: Industries.find()
        };
    }
});

Router.route('/industry-graph/:industry', {
    template: 'industryGraph',
    name: 'industryGraph',
    waitOn: function () {
        return [
            Meteor.subscribe('industries'),
            Meteor.subscribe('industry-data', this.params.industry)
        ];
    },
    data: function () {
        return LabourForceSurveyEstimates.find({ NORTH_lc: this.params.industry.toLowerCase() });
    }
});