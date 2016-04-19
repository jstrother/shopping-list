var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var Storage = function() {
    this.items = [];
    this.id = 0;
};

Storage.prototype.add = function(name) {
    var item = {name: name, id: this.id};
    this.items.push(item);
    this.id += 1;
    return item;
};

Storage.prototype.delete = function(name) {
    var item = {name: name, id: this.id};
    this.items.delete(item);
    this.id -= 1;
};

Storage.prototype.update = function(name, id) {
    this.items.forEach(function(item) {
        if (item.id == id) {
            item.name = name;
        }
    });
    
};

var storage = new Storage();
storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var app = express();
app.use(express.static('public'));

app.get('/items', function(req, res) {
    res.json(storage.items);
});

app.post('/items', jsonParser, function(req, res) {
    if (!req.body) {
        return res.sendStatus(400);
    }
    var item = storage.add(req.body.name);
    res.status(201).json(item);
});

app.delete('/items/:id', function(req, res) {
    if (req.params.id == undefined || req.params.id == null) {
        return res.sendStatus(400);
    } else {
        for (var i = 0; i < storage.items.length; i++) {
            if (storage.items[i].id == req.params.id) {
                storage.items.splice(i, 1);
                break;
            }
        }
        res.json(true);
    }
});

app.put('/items/:id', function(req, res) {
    if (req.params.id == undefined || req.params.id == null) {
        return res.sendStatus(400);
    } else {
        storage.items.forEach(function(item) {
            if (item.id == req.params.id) {
                console.log(req.body);
                // storage.update(req.body.name, req.params.id);
                storage.update(storage.items[req.params.id].name, req.params.id);
            }    
        });
        res.json(storage.items[req.params.id]);
    }
});

app.listen(process.env.PORT || 8080);

exports.app = app;
exports.storage = storage;


