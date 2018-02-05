/* Corey Garvey - Feb 5 2018
*	Controller */

const request = require('request');

/**
 * GET /address/:address
 * Unspent Transactions
 */
exports.getUnspentTxs = (req, res, next) => {

	// Set parameters
  	const address = req.params.address
  	const blockchain_url = 'https://blockchain.info/unspent'

	const query = {
		'active': address
	};

	// Call Blockchain.info API
	request.get({ url: blockchain_url, qs: query }, (err, request, body) => {
		if (err) { return next(err); }
		// Handle bad address or no outputs
		if (request.statusCode === 500) {
			if(body == 'No free outputs to spend'){
				return next('No free outputs to spend');	
			} else{
				return next('Invalid Bitcoin Address');
			}
		}

		// Parse return and set response object
		const raw_unspent_outputs = JSON.parse(body).unspent_outputs;
		const response_object = buildResponse(raw_unspent_outputs);
		// Send JSON response
		res.send(JSON.stringify(response_object));
	});
};

// Create response object from raw unspent output transations
function buildResponse(unspent_outputs) { 
	const return_obj = {};
	const unspent_txs = [];
	return_obj.outputs = unspent_txs;
	for(var i=0; i<unspent_outputs.length; i++){
		old_tx = unspent_outputs[i];
		const new_tx = {};
		new_tx["value"] = old_tx["value"];
		new_tx["txhash"] = old_tx["tx_hash"];
		new_tx["outputidx"] = old_tx["tx_output_n"];
  		return_obj.outputs.push(new_tx);
	}
	return return_obj;
}