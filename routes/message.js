var express = require('express')
var router = express.Router()

/* Function which returns a new connection object */
function connectionObject() {
    /* MySQL Setup */
    var mysql      = require('mysql');
    var connection = mysql.createConnection({
      host     : 'host',
      user     : 'username',
      password : 'password',
      database : 'database-name'
    });

    return connection;
}

/**
 * Route for adding a message to MySQL database
 * @param message string: message which is send with the request body
 * @param author string: author of message
 */
router.post('/add', function(req, res) {
    let connection = connectionObject();
    connection.connect();
    
    /* Prepared insert statement */
    connection.query('INSERT INTO messages VALUES (?, ?)', [req.body.message, req.body.author], function (err, results, fields) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred with adding object to MySQL',
                error: err
            });
        } else {
            return res.status(200).json({
                title: 'Successful added'
            });
        }
    });
 
    /* Close connection */
    connection.end();
})

/**
 * Route for finding all Message Objects for a particular author
 * @param author string: name of author
 */
router.get('/findByName/:author', function(req, res) {
    let connection = connectionObject();
    connection.connect();
 
    /* Prepared insert statement */
    connection.query('SELECT * FROM messages where author like ?', [req.params.author], function (err, results, fields) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred with finding object in database',
                error: err
            });
        } else {
            return res.status(200).json({
                title: 'Found message(s)',
                messages: results
            });
        }
    });
 
    /* Close connection */
    connection.end();
});

/* Export router so it can be injected in app.js for adding the route */
module.exports = router;