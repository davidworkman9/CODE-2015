Router.configure({
    layoutTemplate: 'layout'
});


Router.route('/', {
    template: 'home',
    name: 'home'
});

Router.route('/industry-selector', {
    template: 'industrySelector',
    name: 'industrySelector'
});

Router.route('/industry-graph/:parentId', {
    template: 'industryGraph',
    name: 'industryGraph',
    //waitOn: function () {
    //    return [
    //        Meteor.subscribe('industries'),
    //        Meteor.subscribe('industry-data', this.params.industry)
    //    ];
    //},
    data: function () {
        return { lfd: LabourForceSurveyEstimates.find({ NORTH_lc: this.params.parentId.toLowerCase() }),
            ahw: ActualHoursWorked.find({ industry_lc: this.params.parentId.toLowerCase() }),
            tenure: TenureByIndustry.find({ INDUSTRY: this.params.parentId.toLowerCase(), GEOGRAPHY: 'Canada', JOBTENURE: 'average tenure (months)' })
        };
    }
});