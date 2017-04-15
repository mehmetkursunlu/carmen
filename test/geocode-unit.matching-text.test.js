
var tape = require('tape');
var Carmen = require('..');
var mem = require('../lib/api-mem');
var context = require('../lib/context');
var queue = require('d3-queue').queue;
var addFeature = require('../lib/util/addfeature'),
    queueFeature = addFeature.queueFeature,
    buildQueued = addFeature.buildQueued;

(function() {
    var conf = {
        country: new mem({ maxzoom: 6, geocoder_name: 'country', geocoder_format: '{country._name}' }, function() {}),
        region: new mem({ maxzoom: 6, geocoder_name: 'region', geocoder_format: '{region._name} {country._name}' }, function() {})
    };
    var c = new Carmen(conf);
    tape('index country', function(t) {
        var country = {
            type: 'Feature',
            properties: {
                'carmen:center': [0,0],
                'carmen:zxy': ['6/32/32'],
                'carmen:text': 'United States,America'
            },
            id: 1,
            geometry: {
                type: 'MultiPolygon',
                coordinates: [
                    [[[0,-5.615985819155337],[0,0],[5.625,0],[5.625,-5.615985819155337],[0,-5.615985819155337]]]
                ]
            },
            bbox: [0,-5.615985819155337,5.625,0]
        };
        queueFeature(conf.country, country, t.end);
    });
    tape('index region', function(t) {
        var region = {
            type: 'Feature',
            properties: {
                'carmen:center': [0,0],
                'carmen:zxy': ['6/32/32'],
                'carmen:text': 'Kansas,Jayhawks'
            },
            id: 1,
            geometry: {
                type: 'MultiPolygon',
                coordinates: [
                    [[[0,-5.615985819155337],[0,0],[5.625,0],[5.625,-5.615985819155337],[0,-5.615985819155337]]]
                ]
            },
            bbox: [0,-5.615985819155337,5.625,0]
        };
        queueFeature(conf.region, region, t.end);
    });
    tape('build queued features', function(t) {
        var q = queue();
        Object.keys(conf).forEach(function(c) {
            q.defer(function(cb) {
                buildQueued(conf[c], cb);
            });
        });
        q.awaitAll(t.end);
    });
    tape('kansas america', function(assert) {
        c.geocode('kansas america', { limit_verify:1 }, function(err, res) {
            assert.ifError(err);
            assert.equal(res.features[0].place_name, 'Kansas United States');
            assert.equal(res.features[0].matching_text, undefined, 'feature.matching_text');
            assert.equal(res.features[0].matching_place_name, 'Kansas America');
            assert.end();
        });
    });
    tape('america', function(assert) {
        c.geocode('america', { limit_verify:1 }, function(err, res) {
            assert.ifError(err);
            assert.equal(res.features[0].place_name, 'United States');
            assert.equal(res.features[0].matching_text, 'America');
            assert.equal(res.features[0].matching_place_name, 'America');
            assert.end();
        });
    });
    tape('jayhawks', function(assert) {
        c.geocode('jayhawks', { limit_verify:1 }, function(err, res) {
            assert.ifError(err);
            assert.equal(res.features[0].place_name, 'Kansas United States');
            assert.equal(res.features[0].matching_text, 'Jayhawks');
            assert.equal(res.features[0].matching_place_name, 'Jayhawks United States');
            assert.end();
        });
    });
})();

tape('teardown', function(assert) {
    context.getTile.cache.reset();
    assert.end();
});