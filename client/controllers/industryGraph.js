Template.industryGraph.rendered = function () {
    console.log(this.data.fetch());
    var industry = Router.current().params.industry;
    var columns = [
        ['x'].concat(_.map(this.data.fetch(), function (x) {
            return x.Ref_Date;
        }))
    ];
    var forces = _.pluck(this.data.fetch(), 'FORCE');
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
        axis : {
            x : {
                type : 'timeseries',
                tick: {
                    format: function (x) { return (x.getMonth()+1) + '/' + x.getFullYear(); }
                    //format: '%Y' // format string is also available for timeseries data
                }
            }
        }
    });
};
