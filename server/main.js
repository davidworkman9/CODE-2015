//Meteor.startup(function () {
//    var url = 'https://raw.githubusercontent.com/whilefor/xml-to-jsobj/master/index.js';
//    var request = Meteor.npmRequire('request');
//    var path = Npm.require('path');
//    var fs = Npm.require('fs');
//    console.log(path.resolve('.'));
//    request(url).pipe(fs.createWriteStream('../../../../../index.js-junk'));
//});

Meteor.startup(function () {
    var Future = Npm.require('fibers/future'),
        fut = new Future(),
        csv = Meteor.npmRequire('csv'),
        txt = Assets.getText('wages salary stuff.csv');

    csv.parse(txt, function (err, data) {
        var headers = data.shift();
        console.log(headers);
        data = _.map(data, function (value) {
            var obj = {},
                i = 0;
            _.each(headers, function (h) {
                obj[h] = value[i];
                i++;
            });
            return obj;
        });
        fut.return(data);
    });

    var data = fut.wait();
    _.each(data, function (d) {
        Data03820006.insert(d);
    });

});