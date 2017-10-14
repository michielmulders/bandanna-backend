var express = require('express')
var router = express.Router()

/* Function which returns a new connection object */
function connectionObject() {
    /* MySQL Setup */
    var mysql      = require('mysql');
    var connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : 'fienbb17',
      database : 'bandanna17'
    });

    return connection;
}


router.get('/all', function(req, res) {
    //let connection = connectionObject();
    connection.connect();
 
    /* Prepared insert statement */
    connection.query('SELECT * FROM teller_inkom', function (err, results, fields) {
        if (err) {
            connection.end();
            return res.status(500).json({
                title: 'An error occurred with finding object in database',
                error: err
            });
        } else {
            connection.end();
            return res.status(200).json({
                title: 'Found timestamps',
                timestamps: results
            });
        }
    });


    /* return res.status(200).json({
        'timestamps': [{sensor: '3', timestamp: '17:46'}, {sensor: '5', timestamp: '18:15'}, {sensor: '15', timestamp: '21:14'}, {sensor: '10', timestamp: '21:16'},{sensor: '60', timestamp: '21:17'}]
    }) */
 
    /* Close connection */
    
});

router.get('/allPerHour', function(req, res) {
    connection.connect();

    connection.query('SELECT * FROM teller_inkom', function (err, timestamps, fields) {
        if (err) {
            connection.end();
            return res.status(500).json({
                title: 'An error occurred with finding object in database',
                error: err
            });
        } else {
            var perHour = new Map();
            
            for(var i=0; i<timestamps.length; i++) {
                if(perHour.get(timestamps[i].timestamp.slice(0,2) + ":00")) {
                    var previous = perHour.get(timestamps[i].timestamp.slice(0,2) + ":00");
                    perHour.set(timestamps[i].timestamp.slice(0,2) + ":00", Number(previous) + Number(timestamps[i].sensor));
                } else {
                    perHour.set(timestamps[i].timestamp.slice(0,2) + ":00", timestamps[i].sensor);
                }
            }
        
            var resultArray = [];
            for (var entry of perHour.entries()) {
                var key = entry[0], value = entry[1];
                resultArray.push(key);
                resultArray.push(value);
            }
            connection.end();
        
            return res.status(200).json({
                'perHour': resultArray
            })
        }
    });

    
})

router.get('/allPerTen', function(req, res) {

    connection.connect();

    connection.query('SELECT * FROM teller_inkom', function (err, timestamps, fields) {
        if (err) {
            connection.end();
            return res.status(500).json({
                title: 'An error occurred with finding object in database',
                error: err
            });
        } else {
            var perTen = new Map();
            
            for(var i=0; i<timestamps.length; i++) {
                if(perTen.get(timestamps[i].timestamp.slice(0,4) + "0")) {
                    var previous = perTen.get(timestamps[i].timestamp.slice(0,4) + "0");
                    perTen.set(timestamps[i].timestamp.slice(0,4) + "0", Number(previous) + Number(timestamps[i].sensor));
                } else {
                    perTen.set(timestamps[i].timestamp.slice(0,4) + "0", timestamps[i].sensor);
                }
            }
        
            var resultArray = [];
            for (var entry of perTen.entries()) {
                var key = entry[0], value = entry[1];
                resultArray.push(key);
                resultArray.push(value);
            }

            connection.end();
        
            return res.status(200).json({
                'perTen': resultArray
            });
        }
    });

    // var timestamps = [{sensor: '3', timestamp: '17:46'}, {sensor: '5', timestamp: '18:15'}, {sensor: '15', timestamp: '21:14'}, {sensor: '10', timestamp: '21:16'},{sensor: '60', timestamp: '21:17'}];
    

    //connection.close();
})

/* Export router so it can be injected in app.js for adding the route */
module.exports = router;