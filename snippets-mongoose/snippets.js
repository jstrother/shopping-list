var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/');

mongoose.connection.on('error', function(err) {
    console.error('Could not connect.  Error:', err);
});

mongoose.connection.once('open', function() {
   var snippetSchema = mongoose.Schema({
       name: {type: String, unique: true},
       content: String
    });

    var Snippet = mongoose.model('Snippet', snippetSchema);
});
var create = function(name, content) {
    var snippet = {
        name: name,
        content: content
    };
    Snippet.create(snippet, function(err, snippet) {
        if (err || !snippet) {
            console.error("Could not create snippet", name);
            mongoose.disconnect();
            return;
        }
        console.log("Created snippet", snippet.name);
        mongoose.disconnect();
    });
};
var read = function(name) {
    Snippet.findOne({name: name}, function(err, snippet) {
        if (err || !snippet) {
            console.error("Could not read snippet", name);
            mongoose.disconnect();
            return;
        }
        console.log("Read snippet", snippet.name);
        console.log(snippet.content);
        mongoose.disconnect();
    });
};
var update = function(name, content) {
    Snippet.findOneAndUpdate({name: name}, {content: content}, function(err, snippet) {
        if (err || !snippet) {
            console.error("Could not update snippet", name);
            mongoose.disconnect();
            return;
        }
        console.log("Updated snippet", snippet.name);
        mongoose.disconnect();
    });
};
var del = function(name, content) {
    Snippet.findOneAndRemove({name: name}, function(err, snippet) {
        if (err || !snippet) {
            console.error("Could not delete snippet", name);
            mongoose.disconnect();
            return;
        }
        console.log("Deleted snippet", snippet.name);
        mongoose.disconnect();
    });
};