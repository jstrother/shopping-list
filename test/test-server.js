var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');

var should = chai.should();
var app = server.app;
var storage = server.storage;

chai.use(chaiHttp);

describe('Shopping List', function() {
    it('should list items on GET', function(done) {
        chai.request(app)
            .get('/items')
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.have.length(3);
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('id');
                res.body[0].should.have.property('name');
                res.body[0].id.should.be.a('number');
                res.body[0].name.should.be.a('string');
                res.body[0].name.should.equal('Broad beans');
                res.body[1].name.should.equal('Tomatoes');
                res.body[2].name.should.equal('Peppers');
                done();
            });
    });
    it('should add an item on POST', function(done) {
        chai.request(app)
            .post('/items')
            .send({'name': 'Kale'})
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('id');
                res.body.name.should.be.a('string');
                res.body.id.should.be.a('number');
                res.body.name.should.equal('Kale');
                storage.items.should.be.a('array');
                storage.items.should.have.length(4);
                storage.items[3].should.be.a('object');
                storage.items[3].should.have.property('id');
                storage.items[3].should.have.property('name');
                storage.items[3].id.should.be.a('number');
                storage.items[3].name.should.be.a('string');
                storage.items[3].name.should.equal('Kale');
                done();
            });
    });
    it('should edit an item on PUT', function(done) {
        chai.request(app)
            .put('/items/0')
            .send({'name': 'Black beans'})
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('id');
                res.body.name.should.be.a('string');
                res.body.id.should.be.a('number');
                res.body.id.should.equal(0);
                res.body.name.should.equal('Black beans');
                storage.items.should.be.a('array');
                storage.items[0].name.should.equal('Black beans');
                done();
            });
    });
    it('should return an error if there is nothing to edit', function(done) {
        chai.request(app)
        .put('/items/4')
        .send({'name': 'Green Beans'})
        .end(function(err, res) {
            should.equal(err, null);
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('name');
            res.body.should.have.property('id');
            res.body.name.should.be.a('string');
            res.body.id.should.be.a('number');
            res.body.id.should.equal(4);
            res.body.name.should.equal('Green Beans');
            storage.items.should.be.a('array');
            storage.items[4].name.should.equal('Green Beans');
            done();
        });
    });
    it('should remove an item on DELETE', function(done) {
        chai.request(app)
            .delete('/items/0')
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                storage.items.should.be.a('array');
                storage.items[0].name.should.not.equal('Black beans');
                done();
            });
    });
    it('should return an error if there is nothing to remove', function(done) {
        chai.request(app)
        .delete('/items/6')
        .end(function(err, res) {
            should.equal(err.status, 400);
            res.should.have.status(400);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.error.should.equal('That item could not be found.');
            done();
        });
    });
});

exports.app = app;
exports.storage = storage;