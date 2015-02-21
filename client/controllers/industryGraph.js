Template.industryGraph.created = function () {
    this.autorun(function () {
        this.subIndustries = Meteor.subscribe('industries');
        this.subData = Meteor.subscribe('industry-data', Router.current().params.industry);
    }.bind(this));
};

Template.industryGraph.helpers({
    industry : function () {
        var ind = Router.current().params.industry;
        var doc = LabourForceSurveyEstimates.findOne({NORTH_lc: ind});
        return doc && doc.NORTH;
    }
});

Template.industryGraph.rendered = function () {
    var shown = false;
    this.autorun(function () {
        if (this.subIndustries.ready() && this.subData.ready()) {
            IonLoading.hide();
            shown = false;
        } else {
            if (!shown) {
                IonLoading.show();
                shown = true;
            }
        }
    }.bind(this));

    this.autorun(function () {
        var data = Blaze.getData();
        var industry = Router.current().params.industry;
        if (!(this.subIndustries.ready() && this.subData.ready()))
            return;

        var columns = [
            ['x'].concat(_.map(data.fetch(), function (x) {
                return x.Ref_Date;
            }))
        ];
        var forces = _.pluck(data.fetch(), 'FORCE');
        forces = _.uniq(forces);
        _.each(forces, function (x) {
            columns.push([x].concat(_.map(LabourForceSurveyEstimates.find({
                FORCE: x
            }).fetch(), function (x) { return x.Value; })));
        });
        var chart = c3.generate({
            data: {
                x: 'x',
                columns: columns
            },
            axis: {
                y: {
                    label: 'Persons (x 1000)'
                },
                x: {
                    label: 'Time',
                    type: 'timeseries',
                    tick: {
                        count: 12,
                        format: function (x) { return (x.getMonth()+1) + '/' + x.getYear(); }
                        //format: '%Y' // format string is also available for timeseries data
                    }
                }
            }
        });
    }.bind(this));
};
