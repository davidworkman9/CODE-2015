Template.industryGraph.created = function () {
    this.autorun(function () {
        this.subIndustries = Meteor.subscribe('industries');
        this.subData = Meteor.subscribe('industry-data', Router.current().params.parentId);
    }.bind(this));
};

Template.industryGraph.helpers({
    industry : function () {
        var ind = Router.current().params.parentId;
        if (!ind)
            return;
        var doc = LabourForceSurveyEstimates.findOne({NORTH_lc: ind.toLowerCase()});
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
        var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
        var data = Blaze.getData().lfd;
        var industry = Router.current().params.parentId;
        if (!(this.subIndustries.ready() && this.subData.ready()))
            return;

        var columns = [
            ['x'].concat(_.uniq(_.map(data.fetch(), function (x) {
                return x.Ref_Date;
            }), function (x) { return x.getTime(); }))
        ];
        var forces = _.pluck(data.fetch(), 'FORCE');
        forces = _.uniq(forces);
        _.each(forces, function (x) {
            columns.push([x].concat(_.map(LabourForceSurveyEstimates.find({
                FORCE: x
            }).fetch(), function (x) { return x.Value; })));
        });

        c3.generate({
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
                        format: function (x) { return monthNames[x.getMonth()] + '-' + x.getFullYear().toString().substring(2); }
                        //format: '%Y' // format string is also available for timeseries data
                    }
                }
            },
            subchart: {
                show: true
            },
            zoom: {
                enabled: true
            }
        });

        var data = Blaze.getData().ahw;
        if (!(this.subIndustries.ready() && this.subData.ready()))
            return;

        var columns = [
            ['x'].concat(_.uniq(_.map(data.fetch(), function (x) {
                return x.Ref_Date;
            }), function (x) { return x.getTime(); }))
        ];
        
        columns.push(['Data'].concat(_.map(data.fetch(), function (x) { return x.averageHours; })));

        c3.generate({
            bindto: '#chart2',
            data: {
                x: 'x',
                columns: columns
            },
            axis: {
                y: {
                    label: 'Hours'
                },
                x: {
                    label: 'Time',
                    type: 'timeseries',
                    tick: {
                        count: 12,
                        format: function (x) { return monthNames[x.getMonth()] + '-' + x.getFullYear().toString().substring(2); }
                        //format: '%Y' // format string is also available for timeseries data
                    }
                }
            },
            subchart: {
                show: true
            },
            zoom: {
                enabled: true
            }
        });
    }.bind(this));
};
