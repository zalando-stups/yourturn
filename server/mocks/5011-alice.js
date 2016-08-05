var express = require('express'),
    moment = require('moment'),
    server = express();

var applicationsAndVersions = [
    {application: 'kio', versions: ["1", "0.9", "0.9-beta", "0.9-alpha"]},
    {application: 'pierone', versions: ["3"]},
    {application: 'spilo', versions: []},
    {application: 'foobar', versions: []}
];

var testDataSpecs = [
    [
        {minus: 0, startOf: true, prop: 'days', amount: 2},
        {minus: 1, startOf: false, prop: 'days', amount: 3},
        {minus: 2, startOf: false, prop: 'hours', amount: 4},
        {minus: 2, startOf: false, prop: 'hours', amount: 5},
        {minus: 2, startOf: false, prop: 'hours', amount: 1},
        {minus: 2, startOf: false, prop: 'hours', amount: 0},
        {minus: 2, startOf: false, prop: 'hours', amount: 4},
        {minus: 1, startOf: false, prop: 'days', amount: 8},
        {minus: 2, startOf: false, prop: 'days', amount: 7},
        {minus: 3, startOf: false, prop: 'days', amount: 2},
        {minus: 10, startOf: false, prop: 'minutes', amount: 1},
        {minus: 13, startOf: false, prop: 'minutes', amount: 2},
        {minus: 17, startOf: false, prop: 'minutes', amount: 3},
        {minus: 24, startOf: false, prop: 'minutes', amount: 4},
        {minus: 1, startOf: false, prop: 'weeks', amount: 1},
        {minus: 2, startOf: false, prop: 'weeks', amount: 3},
        {minus: 1, startOf: false, prop: 'months', amount: 1},
        {minus: 1, startOf: false, prop: 'months', amount: 2}
    ],
    [
        {minus: 0, startOf: false, prop: 'minutes', amount: 2},
        {minus: 10, startOf: false, prop: 'minutes', amount: 3},
        {minus: 2, startOf: false, prop: 'hours', amount: 4},
        {minus: 1, startOf: false, prop: 'hours', amount: 5},
        {minus: 1, startOf: false, prop: 'hours', amount: 1},
        {minus: 3, startOf: false, prop: 'hours', amount: 0},
        {minus: 2, startOf: false, prop: 'hours', amount: 4},
        {minus: 19, startOf: false, prop: 'minutes', amount: 8},
        {minus: 29, startOf: false, prop: 'minutes', amount: 7},
        {minus: 39, startOf: false, prop: 'minutes', amount: 2},
        {minus: 20, startOf: false, prop: 'minutes', amount: 1},
        {minus: 13, startOf: false, prop: 'minutes', amount: 2},
        {minus: 17, startOf: false, prop: 'minutes', amount: 3},
        {minus: 42, startOf: false, prop: 'minutes', amount: 4},
        {minus: 1, startOf: false, prop: 'hours', amount: 1},
        {minus: 2, startOf: false, prop: 'hours', amount: 3},
        {minus: 1, startOf: false, prop: 'hours', amount: 1},
        {minus: 1, startOf: false, prop: 'hours', amount: 2}
    ]
];

var data = [];

function generateVersionEventData (k) {
    var dataToUse = testDataSpecs[k%2];

    var result = [];

    var currentMoment = moment();
    for (var i=0; i < dataToUse.length; i++) {
        var dataSpec = dataToUse[i];
        if (dataSpec.startOf) {
            currentMoment = moment(currentMoment).startOf('day');
        } else {
            currentMoment = moment(currentMoment).subtract(dataSpec.minus, dataSpec.prop);
        }
        var entry = {
            timestamp: currentMoment,
            count: dataSpec.amount,
            instances: [
                {
                    event_type: 'event_type',
                    ccount_type: "aws",
                    account_id: "123456789012",
                    region: "eu-west-1",
                    instance_id: "i-123456"
                }
            ]
        };
        result.push(entry);
    }

    return result.reverse();
}

(function() {
    for (var i=0; i<applicationsAndVersions.length; i++) {
        var genEntry = {
            application: applicationsAndVersions[i].application,
            versions: []
        };

        for (var k=0; k < applicationsAndVersions[i].versions.length; k++) {
            var genVersion = {
                version_id: applicationsAndVersions[i].versions[k],
                metadata: {
                    scm_source: {
                        repo_url: 'repo_url',
                        git_hash: 'git_hash',
                        committer: 'committer'
                    },
                    docker_source: 'docker_source',
                    pull_request: {
                        link: 'link'
                    }
                },
                events: generateVersionEventData(k)
            }
            genEntry.versions.push(genVersion);
        }

        data.push(genEntry);
    }
    console.log("I got called");
}());

function limitData(data, start, end) {
    if (!start && !end) {
        return data;
    }

    var result = [];
    var closestToStart = undefined;
    var closestToEnd = undefined;

    for (var i = 0; i < data.length; i++) {
        var currentTimeStamp = data[i].timestamp;
        if (start && moment(currentTimeStamp).isBefore(moment(start))) {
            closestToStart = data[i];
            continue;
        }

        if (end && !closestToEnd && moment(currentTimeStamp).isAfter(moment(start))) {
            closestToEnd = data[i];
            continue;
        }

        result.push(data[i])
    }

    if (closestToStart) {
        result.unshift(closestToStart);
    }

    if (closestToEnd) {
        result.push(closestToEnd);
    }

    return result;
}

function getData(appId, start, end) {
    var found = data.filter( d => d.application == appId)[0].versions;
    var result = [];

    for (var i = 0; i < found.length; i++) {
        result.push({
            version_id: found[i].version_id,
            metadata: found[i].metadata,
            events: limitData(found[i].events, start, end)
        });
    }

    return result;
}

/** enable cors */
server.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

server.get('/instance-count/:application_id', function(req,res) {
    var startDate = new Date(req.query.from);
    var endDate = new Date(req.query.to);
    var applicationId = req.params.application_id;
    var startDate = new Date(req.query.from);
    var endDate = new Date(req.query.to);

    if (isNaN(startDate)) {
        startDate = undefined;
    }
    if (isNaN(endDate)) {
        endDate = undefined;
    }

    console.log(applicationId);
    console.log(startDate);
    console.log(endDate);

    var foundApp = applicationsAndVersions.find((e) => e.application == applicationId);

    if (!foundApp) {
        res.status( 404 ).send( [] );
        return;
    }

    setTimeout( function() {
        res.status( 200 ).send( getData(applicationId, startDate, endDate) );
    }, 2000 + Math.random() * 8000 );
});

module.exports = server;
