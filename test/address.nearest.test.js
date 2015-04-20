var fs = require('fs');
var address = require('../lib/pure/applyaddress.js');
var addressCluster = require('../lib/pure/addresscluster.js');
var test = require('tape');

test('nearest', function(t) {
    t.deepEqual(address({
        _rangetype:'tiger',
        _lfromhn: '1000',
        _ltohn: '1100',
        _geometry: {
            type:'LineString',
            coordinates:[[0,0],[0,100]]
        }
    }, 900), {
        coordinates: [ 0, 0 ],
        omitted: true, // because nearest endpoint match
        type: 'Point'
    }, 'nearest startpoint');

    t.deepEqual(address({
        _rangetype:'tiger',
        _lfromhn: '1000',
        _ltohn: '1100',
        _geometry: {
            type:'LineString',
            coordinates:[[0,0],[0,100]]
        }
    }, 1200), {
        coordinates: [ 0, 100 ],
        omitted: true, // because nearest endpoint match
        type: 'Point'
    }, 'nearest endpoint');

    t.deepEqual(address({
        _rangetype:'tiger',
        _lfromhn: '1000',
        _ltohn: '1100',
        _geometry: {
            type:'LineString',
            coordinates:[[0,0],[0,100]]
        }
    }, 2000),
    undefined,
    'outside threshold');
    t.end();
});

test('nearest stability', function(assert) {
    var a = require('./fixtures/range-feature-1a.json');
    var b = require('./fixtures/range-feature-1b.json');
    assert.deepEqual(address(a, 25), address(b, 25));
    assert.end();
});

