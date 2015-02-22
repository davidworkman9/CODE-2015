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
                $lte: new Date(),
                $gt: moment().subtract(5,'years')._d
            }
        }),
        ActualHoursWorked.find({
            industry_lc: industry.toLowerCase(),
            Ref_Date: {
                $lte: new Date(),
                $gt: moment().subtract(5,'years')._d
            }
        }),
        TenureByIndustry.find({
            GEOGRAPHY: 'Canada',
            JOBTENURE: 'average tenure (months)',
            INDUSTRY: industry.toLowerCase(),
            Ref_Date: {
                $lte: new Date(),
                $gt: moment().subtract(5,'years')._d
            }
        })
    ];
});
