var http = require('http');
var https = require('https');
var url = require('url');
var request = require('request');


http.createServer(function (req, res) {
    
    // Control favicon requests
	if (req.url === '/favicon.ico') {
	    res.writeHead(200, {'Content-Type': 'image/x-icon'} );
	    res.end();
	    console.log('favicon requested');
	    return;
	}

    res.writeHead(200, {'Content-Type': 'application/json'});
    
    // Parse URL and set blockAddress variable
    var q = url.parse(req.url).pathname;
    var blockAddress = q.split("/")[2];

    // Request to blockchain.info
    var blockchain_url = 'https://blockchain.info/unspent'
	var propertiesObject = { active: blockAddress };

	var unspentTxs;

	request({
		url:blockchain_url, 
		qs:propertiesObject
		}, function(err, response, body) {
		if(err) { 
	  		console.log(err); return; 
	  	}
	  	else {
		  	var json = JSON.parse(body);
		  	var unspent_outputs = json["unspent_outputs"];

		  	// Create object to return
		  	var return_obj = {};
	 		// Create transactions list
	 		var unspent_txs = [];

	 		return_obj.outputs = unspent_txs;
	 		for(var i=0; i<unspent_outputs.length; i++){
		  		
		  		// For each transaction, create object w/ proper names
		  		old_tx = unspent_outputs[i];
		  		var new_tx = {};
		  		new_tx["value"] = old_tx["value"];
		  		new_tx["txhash"] = old_tx["tx_hash"];
		  		new_tx["outputidx"] = old_tx["tx_output_n"];
		  		
		  		// Push transaction into object
		  		return_obj.outputs.push(new_tx);
			}
			
			console.log("return_obj: ");
			console.log(return_obj);

	  		// Write new object to response
	  		res.write(JSON.stringify(return_obj));
			
	  	}
	  	res.end();
	  
	});    

}).listen(8080);

// Inform console when app is running 
console.log("Server running at http://localhost:8080/");




