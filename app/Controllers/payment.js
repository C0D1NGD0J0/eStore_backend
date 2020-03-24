const { BTGateway } = require("../Config/braintreeConfig");
const ErrorResponse = require("../Utils/errorsResponse");
const { asyncHandler } = require("../Utils/middlewares");

/*
	Desc: Generate token for braintree to initial payment process
	route: GET /api/v1/payments/generate_payment_token
	access: Private (Admin)
*/
exports.getBraintreeToken = asyncHandler(async (req, res, next) => {
  BTGateway.clientToken.generate({}, function (err, response) {
    if(err){
      return next(new ErrorResponse(err, 400));
    };

    return res.status(200).json({ success: true, clientToken: response.clientToken });
  });
});

/*
	Desc: Process payment via braintree
	route: POST /api/v1/payments/
	access: Private
*/
exports.handlePayment = asyncHandler(async (req, res, next) => {
  const nonceFromTheClient = req.body.nonce;
  const purchaseTotal = req.body.orderTotal;

  BTGateway.transaction.sale({
    amount: purchaseTotal.total,
    paymentMethodNonce: nonceFromTheClient,
    options: {
      submitForSettlement: true
    }
  }, function(err, result){
    if(err){
      return next(new ErrorResponse(err, 500));   
    };

    return res.status(200).json({ success: true, result });
  });
});