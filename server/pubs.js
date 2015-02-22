Meteor.publish('industries', function (skip, limit, filter) {
    var opts = {
        sort: { industry: 1 }
    };
    if (skip)
        opts.skip = skip;
    if (limit)
        opts.limit = limit;
    if (!filter)
        return Industries.find({}, opts);
    return Industries.find({industry: new RegExp(escapeRegExp(filter), 'i')}, opts);
});


Meteor.publish('industry-data', function (industry) {
    check(industry, String);
    return [
        LabourForceSurveyEstimates.find({
            NORTH_lc: industry.toLowerCase(),
            Ref_Date: {
                $lte: new Date(2012, 1, 1),
                $gt: new Date(2007, 1, 1)
            }
        }),
        ActualHoursWorked.find({
            industry_lc: industry.toLowerCase(),
            Ref_Date: {
                $lte: new Date(2012, 1, 1),
                $gt: new Date(2007, 1, 1)
            }
        })
    ];
});
