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
    if (!':id') {
        return res.sendStatus(400);
    } else {
        storage.items.splice(req.params.id, 1);
        res.json(true);
        storage.id -= 1; //need a way to subtract 1 from all id's past the item being deleted, otherwise those "after" items won't delete
    }
});

app.listen(process.env.PORT || 8080);