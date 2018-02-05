var http = require('http');
var url = require('url');
var request = require('request');

// Server
http.createServer(function (req, res) {

    res.writeHead(200, {'Content-Type': 'application/json'});
    
    // Parse URL and set blockAddress
    var path = url.parse(req.url).pathname;
    var blockAddress = path.split("/")[2];

    // Request to blockchain.info
    var blockchain_url = 'https://blockchain.info/unspent'
	var properties = { active: blockAddress };
	request({
		url:blockchain_url, 
		qs:properties
		}, function(err, response, body) {
		if(err) { 
	  		console.log(err); return; 
	  	}
	  	else {
		  	// List of unspent outputs from body
		  	var body_json = JSON.parse(body);
		  	var raw_unspent_outputs = body_json["unspent_outputs"];

			var response_object = buildResponse(raw_unspent_outputs);

			console.log("response_object: ");
			console.log(response_object);

	  		// Write new object to response
	  		res.write(JSON.stringify(response_object));
			
	  	}
	  	res.end();
	  
	});    

}).listen(8080);

// Inform console when app is running 
console.log("Server running at http://localhost:8080/");

// Create response object from raw unspent output transations
function buildResponse(unspent_outputs) { 
	var return_obj = {};
	var unspent_txs = [];
	return_obj.outputs = unspent_txs;
	for(var i=0; i<unspent_outputs.length; i++){
		old_tx = unspent_outputs[i];
		var new_tx = {};
		new_tx["value"] = old_tx["value"];
		new_tx["txhash"] = old_tx["tx_hash"];
		new_tx["outputidx"] = old_tx["tx_output_n"];
  		return_obj.outputs.push(new_tx);
	}
	return return_obj;
}


