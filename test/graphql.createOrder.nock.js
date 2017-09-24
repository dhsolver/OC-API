import nock from 'nock';

export default function() {

  nock('https://api.stripe.com:443', {"encodedQueryParams":true})
  .post('/v1/tokens', "card%5Bnumber%5D=4242424242424242&card%5Bexp_month%5D=12&card%5Bexp_year%5D=2028&card%5Bcvc%5D=222")
  .reply(200, {"id":"tok_1B5j8xDjPFcHOcTm3ogdnq0K","object":"token","card":{"id":"card_1B5j8xDjPFcHOcTmDV3bGhAI","object":"card","address_city":null,"address_country":null,"address_line1":null,"address_line1_check":null,"address_line2":null,"address_state":null,"address_zip":null,"address_zip_check":null,"brand":"Visa","country":"US","cvc_check":"unchecked","dynamic_last4":null,"exp_month":12,"exp_year":2028,"fingerprint":"ftgJeBXvQSZ4HMCg","funding":"credit","last4":"4242","metadata":{},"name":null,"tokenization_method":null},"client_ip":"68.173.154.69","created":1506294251,"livemode":false,"type":"card","used":false}, [ 'Server',
   'X-Stripe-Privileged-Session-Required,stripe-manage-version,X-Stripe-External-Auth-Required',
  'Request-Id',
  'req_HnSajTDP4vmt6P']);

nock('http://api.fixer.io:80', {"encodedQueryParams":true})
  .get('/latest')
  .query({"base":"EUR","symbols":"USD"})
  .reply(200, {"base":"EUR","date":"2017-09-22","rates":{"USD":1.1961}}, [ 'Server',
   'nosniff' ]);

nock('https://api.stripe.com:443', {"encodedQueryParams":true})
  .post('/v1/customers', "source=tok_1B5j8xDjPFcHOcTm3ogdnq0K&description=https%3A%2F%2Fopencollective.com%2Fjohn-smith&email=jsmith%40email.com")
  .reply(200, {"id":"cus_BSeRpSPOYoLmLY","object":"customer","account_balance":0,"created":1506294253,"currency":null,"default_source":"card_1B5j8xDjPFcHOcTmDV3bGhAI","delinquent":false,"description":"https://opencollective.com/john-smith","discount":null,"email":"jsmith@email.com","livemode":false,"metadata":{},"shipping":null,"sources":{"object":"list","data":[{"id":"card_1B5j8xDjPFcHOcTmDV3bGhAI","object":"card","address_city":null,"address_country":null,"address_line1":null,"address_line1_check":null,"address_line2":null,"address_state":null,"address_zip":null,"address_zip_check":null,"brand":"Visa","country":"US","customer":"cus_BSeRpSPOYoLmLY","cvc_check":"pass","dynamic_last4":null,"exp_month":12,"exp_year":2028,"fingerprint":"ftgJeBXvQSZ4HMCg","funding":"credit","last4":"4242","metadata":{},"name":null,"tokenization_method":null}],"has_more":false,"total_count":1,"url":"/v1/customers/cus_BSeRpSPOYoLmLY/sources"},"subscriptions":{"object":"list","data":[],"has_more":false,"total_count":0,"url":"/v1/customers/cus_BSeRpSPOYoLmLY/subscriptions"}}, [ 'Server',
   'X-Stripe-Privileged-Session-Required,stripe-manage-version,X-Stripe-External-Auth-Required',
  'Request-Id',
  'req_IjXG74Fh3wsAXT']);

nock('https://api.stripe.com:443', {"encodedQueryParams":true})
  .post('/v1/tokens', "customer=cus_BSeRpSPOYoLmLY")
  .reply(200, {"id":"tok_1B5j90D8MNtzsDcgsUwmv6vS","object":"token","card":{"id":"card_1B5j90D8MNtzsDcgJLjwX3Ch","object":"card","address_city":null,"address_country":null,"address_line1":null,"address_line1_check":null,"address_line2":null,"address_state":null,"address_zip":null,"address_zip_check":null,"brand":"Visa","country":"US","cvc_check":"pass","dynamic_last4":null,"exp_month":12,"exp_year":2028,"fingerprint":"nt4eriIIhN3fiPZF","funding":"credit","last4":"4242","metadata":{},"name":null,"tokenization_method":null},"client_ip":"68.173.154.69","created":1506294254,"livemode":false,"type":"card","used":false}, [ 'Server',
   'X-Stripe-Privileged-Session-Required,stripe-manage-version,X-Stripe-External-Auth-Required',
  'Request-Id',
  'req_7jpxo4tPWiIvKM',
  'Stripe-Version',
  '2015-04-07']);

nock('https://api.stripe.com:443', {"encodedQueryParams":true})
  .post('/v1/customers', "source=tok_1B5j90D8MNtzsDcgsUwmv6vS&description=https%3A%2F%2Fopencollective.com%2Fjohn-smith&email=jsmith%40email.com")
  .reply(200, {"id":"cus_BSeR3FwUymkCBn","object":"customer","account_balance":0,"created":1506294254,"currency":null,"default_source":"card_1B5j90D8MNtzsDcgJLjwX3Ch","delinquent":false,"description":"https://opencollective.com/john-smith","discount":null,"email":"jsmith@email.com","livemode":false,"metadata":{},"shipping":null,"sources":{"object":"list","data":[{"id":"card_1B5j90D8MNtzsDcgJLjwX3Ch","object":"card","address_city":null,"address_country":null,"address_line1":null,"address_line1_check":null,"address_line2":null,"address_state":null,"address_zip":null,"address_zip_check":null,"brand":"Visa","country":"US","customer":"cus_BSeR3FwUymkCBn","cvc_check":"pass","dynamic_last4":null,"exp_month":12,"exp_year":2028,"fingerprint":"nt4eriIIhN3fiPZF","funding":"credit","last4":"4242","metadata":{},"name":null,"tokenization_method":null}],"has_more":false,"total_count":1,"url":"/v1/customers/cus_BSeR3FwUymkCBn/sources"},"subscriptions":{"object":"list","data":[],"has_more":false,"total_count":0,"url":"/v1/customers/cus_BSeR3FwUymkCBn/subscriptions"}}, [ 'Server',
   'X-Stripe-Privileged-Session-Required,stripe-manage-version,X-Stripe-External-Auth-Required',
  'Request-Id',
  'req_GHMHEPn8kR4e9Z',
  'Stripe-Version',
  '2015-04-07']);

nock('https://api.stripe.com:443', {"encodedQueryParams":true})
  .post('/v1/charges', "amount=154300&currency=EUR&customer=cus_BSeR3FwUymkCBn&description=Donation%20to%20BrusselsTogether%20(donor)&application_fee=7715&metadata%5Bfrom%5D=http%3A%2F%2Flocalhost%3A3000%2Fjohn-smith&metadata%5Bto%5D=http%3A%2F%2Flocalhost%3A3000%2Fbrusselstogether&metadata%5BcustomerEmail%5D=jsmith%40email.com&metadata%5BPaymentMethodId%5D=4157")
  .reply(200, {"id":"ch_1B5j91D8MNtzsDcgNMsUgI8L","object":"charge","amount":154300,"amount_refunded":0,"application":"ca_68FQcZXEcV66Kjg7egLnR1Ce87cqwoue","application_fee":"fee_1B5j92D8MNtzsDcgeoTqTy5g","balance_transaction":"txn_1B5j92D8MNtzsDcgQzIcmfrn","captured":true,"created":1506294255,"currency":"eur","customer":"cus_BSeR3FwUymkCBn","description":"Donation to BrusselsTogether (donor)","destination":null,"dispute":null,"failure_code":null,"failure_message":null,"fraud_details":{},"invoice":null,"livemode":false,"metadata":{"from":"http://localhost:3000/john-smith","to":"http://localhost:3000/brusselstogether","customerEmail":"jsmith@email.com","PaymentMethodId":"4157"},"on_behalf_of":null,"order":null,"outcome":{"network_status":"approved_by_network","reason":null,"risk_level":"normal","seller_message":"Payment complete.","type":"authorized"},"paid":true,"receipt_email":null,"receipt_number":null,"refunded":false,"refunds":{"object":"list","data":[],"has_more":false,"total_count":0,"url":"/v1/charges/ch_1B5j91D8MNtzsDcgNMsUgI8L/refunds"},"review":null,"shipping":null,"source":{"id":"card_1B5j90D8MNtzsDcgJLjwX3Ch","object":"card","address_city":null,"address_country":null,"address_line1":null,"address_line1_check":null,"address_line2":null,"address_state":null,"address_zip":null,"address_zip_check":null,"brand":"Visa","country":"US","customer":"cus_BSeR3FwUymkCBn","cvc_check":"pass","dynamic_last4":null,"exp_month":12,"exp_year":2028,"fingerprint":"nt4eriIIhN3fiPZF","funding":"credit","last4":"4242","metadata":{},"name":null,"tokenization_method":null},"source_transfer":null,"statement_descriptor":null,"status":"succeeded","transfer_group":null}, [ 'Server',
   'X-Stripe-Privileged-Session-Required,stripe-manage-version,X-Stripe-External-Auth-Required',
  'Request-Id',
  'req_CW6j9Ey72xztXd',
  'Stripe-Version',
  '2015-04-07']);


nock('https://api.stripe.com:443', {"encodedQueryParams":true})
  .get('/v1/balance/history/txn_1B5j92D8MNtzsDcgQzIcmfrn')
  .reply(200, {"id":"txn_1B5j92D8MNtzsDcgQzIcmfrn","object":"balance_transaction","amount":154300,"available_on":1506816000,"created":1506294255,"currency":"eur","description":"Donation to BrusselsTogether (donor)","fee":12215,"fee_details":[{"amount":7715,"application":"ca_68FQcZXEcV66Kjg7egLnR1Ce87cqwoue","currency":"eur","description":"OpenCollective application fee","type":"application_fee"},{"amount":4500,"application":null,"currency":"eur","description":"Stripe processing fees","type":"stripe_fee"}],"net":142085,"source":"ch_1B5j91D8MNtzsDcgNMsUgI8L","sourced_transfers":{"object":"list","data":[],"has_more":false,"total_count":0,"url":"/v1/transfers?source_transaction=ch_1B5j91D8MNtzsDcgNMsUgI8L"},"status":"pending","type":"charge"}, [ 'Server',
   'X-Stripe-Privileged-Session-Required,stripe-manage-version,X-Stripe-External-Auth-Required',
  'Request-Id',
  'req_ImiVyseI7YetGj',
  'Stripe-Version',
  '2015-04-07']);

nock('https://api.stripe.com:443', {"encodedQueryParams":true})
  .get('/v1/charges/ch_1B5j91D8MNtzsDcgNMsUgI8L')
  .reply(200, {"id":"ch_1B5j91D8MNtzsDcgNMsUgI8L","object":"charge","amount":154300,"amount_refunded":0,"application":"ca_68FQcZXEcV66Kjg7egLnR1Ce87cqwoue","application_fee":"fee_1B5j92D8MNtzsDcgeoTqTy5g","balance_transaction":"txn_1B5j92D8MNtzsDcgQzIcmfrn","captured":true,"created":1506294255,"currency":"eur","customer":"cus_BSeR3FwUymkCBn","description":"Donation to BrusselsTogether (donor)","destination":null,"dispute":null,"failure_code":null,"failure_message":null,"fraud_details":{},"invoice":null,"livemode":false,"metadata":{"from":"http://localhost:3000/john-smith","to":"http://localhost:3000/brusselstogether","customerEmail":"jsmith@email.com","PaymentMethodId":"4157"},"on_behalf_of":null,"order":null,"outcome":{"network_status":"approved_by_network","reason":null,"risk_level":"normal","seller_message":"Payment complete.","type":"authorized"},"paid":true,"receipt_email":null,"receipt_number":null,"refunded":false,"refunds":{"object":"list","data":[],"has_more":false,"total_count":0,"url":"/v1/charges/ch_1B5j91D8MNtzsDcgNMsUgI8L/refunds"},"review":null,"shipping":null,"source":{"id":"card_1B5j90D8MNtzsDcgJLjwX3Ch","object":"card","address_city":null,"address_country":null,"address_line1":null,"address_line1_check":null,"address_line2":null,"address_state":null,"address_zip":null,"address_zip_check":null,"brand":"Visa","country":"US","customer":"cus_BSeR3FwUymkCBn","cvc_check":"pass","dynamic_last4":null,"exp_month":12,"exp_year":2028,"fingerprint":"nt4eriIIhN3fiPZF","funding":"credit","last4":"4242","metadata":{},"name":null,"tokenization_method":null},"source_transfer":null,"statement_descriptor":null,"status":"succeeded","transfer_group":null}, [ 'Server',
   'X-Stripe-Privileged-Session-Required,stripe-manage-version,X-Stripe-External-Auth-Required',
  'Request-Id',
  'req_l7JQVb9eFW7a9O',
  'Stripe-Version',
  '2015-04-07']);

nock('https://api.stripe.com:443', {"encodedQueryParams":true})
  .post('/v1/tokens', "card%5Bnumber%5D=4242424242424242&card%5Bexp_month%5D=12&card%5Bexp_year%5D=2028&card%5Bcvc%5D=222")
  .reply(200, {"id":"tok_1B5j9BDjPFcHOcTmFbNsU8aR","object":"token","card":{"id":"card_1B5j9BDjPFcHOcTm5ToPXwII","object":"card","address_city":null,"address_country":null,"address_line1":null,"address_line1_check":null,"address_line2":null,"address_state":null,"address_zip":null,"address_zip_check":null,"brand":"Visa","country":"US","cvc_check":"unchecked","dynamic_last4":null,"exp_month":12,"exp_year":2028,"fingerprint":"ftgJeBXvQSZ4HMCg","funding":"credit","last4":"4242","metadata":{},"name":null,"tokenization_method":null},"client_ip":"68.173.154.69","created":1506294265,"livemode":false,"type":"card","used":false}, [ 'Server',
   'X-Stripe-Privileged-Session-Required,stripe-manage-version,X-Stripe-External-Auth-Required',
  'Request-Id',
  'req_wEoeZwQFQeF6qY']);

nock('http://api.fixer.io:80', {"encodedQueryParams":true})
  .get('/latest')
  .query({"base":"EUR","symbols":"USD"})
  .reply(200, {"base":"EUR","date":"2017-09-22","rates":{"USD":1.1961}}, [ 'Server',
   'nosniff' ]);

nock('https://api.stripe.com:443', {"encodedQueryParams":true})
  .post('/v1/customers', "source=tok_1B5j9BDjPFcHOcTmFbNsU8aR&description=https%3A%2F%2Fopencollective.com%2Fxdamman&email=fd81e8b367fee82f45af1816e5ec9147%40gmail.com")
  .reply(200, {"id":"cus_BSeSCs7JcUA1ig","object":"customer","account_balance":0,"created":1506294266,"currency":null,"default_source":"card_1B5j9BDjPFcHOcTm5ToPXwII","delinquent":false,"description":"https://opencollective.com/xdamman","discount":null,"email":"fd81e8b367fee82f45af1816e5ec9147@gmail.com","livemode":false,"metadata":{},"shipping":null,"sources":{"object":"list","data":[{"id":"card_1B5j9BDjPFcHOcTm5ToPXwII","object":"card","address_city":null,"address_country":null,"address_line1":null,"address_line1_check":null,"address_line2":null,"address_state":null,"address_zip":null,"address_zip_check":null,"brand":"Visa","country":"US","customer":"cus_BSeSCs7JcUA1ig","cvc_check":"pass","dynamic_last4":null,"exp_month":12,"exp_year":2028,"fingerprint":"ftgJeBXvQSZ4HMCg","funding":"credit","last4":"4242","metadata":{},"name":null,"tokenization_method":null}],"has_more":false,"total_count":1,"url":"/v1/customers/cus_BSeSCs7JcUA1ig/sources"},"subscriptions":{"object":"list","data":[],"has_more":false,"total_count":0,"url":"/v1/customers/cus_BSeSCs7JcUA1ig/subscriptions"}}, [ 'Server',
   'X-Stripe-Privileged-Session-Required,stripe-manage-version,X-Stripe-External-Auth-Required',
  'Request-Id',
  'req_B1Rhb4QoC6wxuX']);

nock('https://api.stripe.com:443', {"encodedQueryParams":true})
  .post('/v1/tokens', "customer=cus_BSeSCs7JcUA1ig")
  .reply(200, {"id":"tok_1B5j9DD8MNtzsDcg1RLXrid7","object":"token","card":{"id":"card_1B5j9DD8MNtzsDcgIsuIhM0Z","object":"card","address_city":null,"address_country":null,"address_line1":null,"address_line1_check":null,"address_line2":null,"address_state":null,"address_zip":null,"address_zip_check":null,"brand":"Visa","country":"US","cvc_check":"pass","dynamic_last4":null,"exp_month":12,"exp_year":2028,"fingerprint":"nt4eriIIhN3fiPZF","funding":"credit","last4":"4242","metadata":{},"name":null,"tokenization_method":null},"client_ip":"68.173.154.69","created":1506294267,"livemode":false,"type":"card","used":false}, [ 'Server',
   'X-Stripe-Privileged-Session-Required,stripe-manage-version,X-Stripe-External-Auth-Required',
  'Request-Id',
  'req_bWDWh4oX1Ee7R8',
  'Stripe-Version',
  '2015-04-07']);

nock('https://api.stripe.com:443', {"encodedQueryParams":true})
  .post('/v1/customers', "source=tok_1B5j9DD8MNtzsDcg1RLXrid7&description=https%3A%2F%2Fopencollective.com%2Fxdamman&email=fd81e8b367fee82f45af1816e5ec9147%40gmail.com")
  .reply(200, {"id":"cus_BSeS6B0ahHn6zv","object":"customer","account_balance":0,"created":1506294268,"currency":null,"default_source":"card_1B5j9DD8MNtzsDcgIsuIhM0Z","delinquent":false,"description":"https://opencollective.com/xdamman","discount":null,"email":"fd81e8b367fee82f45af1816e5ec9147@gmail.com","livemode":false,"metadata":{},"shipping":null,"sources":{"object":"list","data":[{"id":"card_1B5j9DD8MNtzsDcgIsuIhM0Z","object":"card","address_city":null,"address_country":null,"address_line1":null,"address_line1_check":null,"address_line2":null,"address_state":null,"address_zip":null,"address_zip_check":null,"brand":"Visa","country":"US","customer":"cus_BSeS6B0ahHn6zv","cvc_check":"pass","dynamic_last4":null,"exp_month":12,"exp_year":2028,"fingerprint":"nt4eriIIhN3fiPZF","funding":"credit","last4":"4242","metadata":{},"name":null,"tokenization_method":null}],"has_more":false,"total_count":1,"url":"/v1/customers/cus_BSeS6B0ahHn6zv/sources"},"subscriptions":{"object":"list","data":[],"has_more":false,"total_count":0,"url":"/v1/customers/cus_BSeS6B0ahHn6zv/subscriptions"}}, [ 'Server',
   'X-Stripe-Privileged-Session-Required,stripe-manage-version,X-Stripe-External-Auth-Required',
  'Request-Id',
  'req_hFouJL6YUOFWip',
  'Stripe-Version',
  '2015-04-07']);

nock('https://api.stripe.com:443', {"encodedQueryParams":true})
  .post('/v1/charges', "amount=154300&currency=EUR&customer=cus_BSeS6B0ahHn6zv&description=Donation%20to%20BrusselsTogether%20(donor)&application_fee=7715&metadata%5Bfrom%5D=http%3A%2F%2Flocalhost%3A3000%2Fxdamman&metadata%5Bto%5D=http%3A%2F%2Flocalhost%3A3000%2Fbrusselstogether&metadata%5BcustomerEmail%5D=fd81e8b367fee82f45af1816e5ec9147%40gmail.com&metadata%5BPaymentMethodId%5D=4156")
  .reply(200, {"id":"ch_1B5j9ED8MNtzsDcg5C3JAnTX","object":"charge","amount":154300,"amount_refunded":0,"application":"ca_68FQcZXEcV66Kjg7egLnR1Ce87cqwoue","application_fee":"fee_1B5j9FD8MNtzsDcgBuv8ZmJx","balance_transaction":"txn_1B5j9FD8MNtzsDcgvY8hIzz7","captured":true,"created":1506294268,"currency":"eur","customer":"cus_BSeS6B0ahHn6zv","description":"Donation to BrusselsTogether (donor)","destination":null,"dispute":null,"failure_code":null,"failure_message":null,"fraud_details":{},"invoice":null,"livemode":false,"metadata":{"from":"http://localhost:3000/xdamman","to":"http://localhost:3000/brusselstogether","customerEmail":"fd81e8b367fee82f45af1816e5ec9147@gmail.com","PaymentMethodId":"4156"},"on_behalf_of":null,"order":null,"outcome":{"network_status":"approved_by_network","reason":null,"risk_level":"normal","seller_message":"Payment complete.","type":"authorized"},"paid":true,"receipt_email":null,"receipt_number":null,"refunded":false,"refunds":{"object":"list","data":[],"has_more":false,"total_count":0,"url":"/v1/charges/ch_1B5j9ED8MNtzsDcg5C3JAnTX/refunds"},"review":null,"shipping":null,"source":{"id":"card_1B5j9DD8MNtzsDcgIsuIhM0Z","object":"card","address_city":null,"address_country":null,"address_line1":null,"address_line1_check":null,"address_line2":null,"address_state":null,"address_zip":null,"address_zip_check":null,"brand":"Visa","country":"US","customer":"cus_BSeS6B0ahHn6zv","cvc_check":"pass","dynamic_last4":null,"exp_month":12,"exp_year":2028,"fingerprint":"nt4eriIIhN3fiPZF","funding":"credit","last4":"4242","metadata":{},"name":null,"tokenization_method":null},"source_transfer":null,"statement_descriptor":null,"status":"succeeded","transfer_group":null}, [ 'Server',
   'X-Stripe-Privileged-Session-Required,stripe-manage-version,X-Stripe-External-Auth-Required',
  'Request-Id',
  'req_UELdsMwVIAlNyd',
  'Stripe-Version',
  '2015-04-07']);

nock('https://api.stripe.com:443', {"encodedQueryParams":true})
  .get('/v1/balance/history/txn_1B5j9FD8MNtzsDcgvY8hIzz7')
  .reply(200, {"id":"txn_1B5j9FD8MNtzsDcgvY8hIzz7","object":"balance_transaction","amount":154300,"available_on":1506816000,"created":1506294268,"currency":"eur","description":"Donation to BrusselsTogether (donor)","fee":12215,"fee_details":[{"amount":7715,"application":"ca_68FQcZXEcV66Kjg7egLnR1Ce87cqwoue","currency":"eur","description":"OpenCollective application fee","type":"application_fee"},{"amount":4500,"application":null,"currency":"eur","description":"Stripe processing fees","type":"stripe_fee"}],"net":142085,"source":"ch_1B5j9ED8MNtzsDcg5C3JAnTX","sourced_transfers":{"object":"list","data":[],"has_more":false,"total_count":0,"url":"/v1/transfers?source_transaction=ch_1B5j9ED8MNtzsDcg5C3JAnTX"},"status":"pending","type":"charge"}, [ 'Server',
   'X-Stripe-Privileged-Session-Required,stripe-manage-version,X-Stripe-External-Auth-Required',
  'Request-Id',
  'req_0ftGy2fMq3261m',
  'Stripe-Version',
  '2015-04-07']);

nock('https://api.stripe.com:443', {"encodedQueryParams":true})
  .get('/v1/charges/ch_1B5j9ED8MNtzsDcg5C3JAnTX')
  .reply(200, {"id":"ch_1B5j9ED8MNtzsDcg5C3JAnTX","object":"charge","amount":154300,"amount_refunded":0,"application":"ca_68FQcZXEcV66Kjg7egLnR1Ce87cqwoue","application_fee":"fee_1B5j9FD8MNtzsDcgBuv8ZmJx","balance_transaction":"txn_1B5j9FD8MNtzsDcgvY8hIzz7","captured":true,"created":1506294268,"currency":"eur","customer":"cus_BSeS6B0ahHn6zv","description":"Donation to BrusselsTogether (donor)","destination":null,"dispute":null,"failure_code":null,"failure_message":null,"fraud_details":{},"invoice":null,"livemode":false,"metadata":{"from":"http://localhost:3000/xdamman","to":"http://localhost:3000/brusselstogether","customerEmail":"fd81e8b367fee82f45af1816e5ec9147@gmail.com","PaymentMethodId":"4156"},"on_behalf_of":null,"order":null,"outcome":{"network_status":"approved_by_network","reason":null,"risk_level":"normal","seller_message":"Payment complete.","type":"authorized"},"paid":true,"receipt_email":null,"receipt_number":null,"refunded":false,"refunds":{"object":"list","data":[],"has_more":false,"total_count":0,"url":"/v1/charges/ch_1B5j9ED8MNtzsDcg5C3JAnTX/refunds"},"review":null,"shipping":null,"source":{"id":"card_1B5j9DD8MNtzsDcgIsuIhM0Z","object":"card","address_city":null,"address_country":null,"address_line1":null,"address_line1_check":null,"address_line2":null,"address_state":null,"address_zip":null,"address_zip_check":null,"brand":"Visa","country":"US","customer":"cus_BSeS6B0ahHn6zv","cvc_check":"pass","dynamic_last4":null,"exp_month":12,"exp_year":2028,"fingerprint":"nt4eriIIhN3fiPZF","funding":"credit","last4":"4242","metadata":{},"name":null,"tokenization_method":null},"source_transfer":null,"statement_descriptor":null,"status":"succeeded","transfer_group":null}, [ 'Server',
   'X-Stripe-Privileged-Session-Required,stripe-manage-version,X-Stripe-External-Auth-Required',
  'Request-Id',
  'req_vv8lBajc7UAqeq',
  'Stripe-Version',
  '2015-04-07']);

nock('https://api.stripe.com:443', {"encodedQueryParams":true})
  .post('/v1/tokens', "card%5Bnumber%5D=4242424242424242&card%5Bexp_month%5D=12&card%5Bexp_year%5D=2028&card%5Bcvc%5D=222")
  .reply(200, {"id":"tok_1B5j9ODjPFcHOcTmpCZFH9Uh","object":"token","card":{"id":"card_1B5j9ODjPFcHOcTmVOjSeJmS","object":"card","address_city":null,"address_country":null,"address_line1":null,"address_line1_check":null,"address_line2":null,"address_state":null,"address_zip":null,"address_zip_check":null,"brand":"Visa","country":"US","cvc_check":"unchecked","dynamic_last4":null,"exp_month":12,"exp_year":2028,"fingerprint":"ftgJeBXvQSZ4HMCg","funding":"credit","last4":"4242","metadata":{},"name":null,"tokenization_method":null},"client_ip":"68.173.154.69","created":1506294278,"livemode":false,"type":"card","used":false}, [ 'Server',
   'X-Stripe-Privileged-Session-Required,stripe-manage-version,X-Stripe-External-Auth-Required',
  'Request-Id',
  'req_NHmux8PUynUoZf']);

nock('https://api.stripe.com:443', {"encodedQueryParams":true})
  .post('/v1/customers', "source=tok_1B5j9ODjPFcHOcTmpCZFH9Uh&description=https%3A%2F%2Fopencollective.com%2Fundefined&email=")
  .reply(200, {"id":"cus_BSeSEx7Q0oBxoO","object":"customer","account_balance":0,"created":1506294279,"currency":null,"default_source":"card_1B5j9ODjPFcHOcTmVOjSeJmS","delinquent":false,"description":"https://opencollective.com/undefined","discount":null,"email":null,"livemode":false,"metadata":{},"shipping":null,"sources":{"object":"list","data":[{"id":"card_1B5j9ODjPFcHOcTmVOjSeJmS","object":"card","address_city":null,"address_country":null,"address_line1":null,"address_line1_check":null,"address_line2":null,"address_state":null,"address_zip":null,"address_zip_check":null,"brand":"Visa","country":"US","customer":"cus_BSeSEx7Q0oBxoO","cvc_check":"pass","dynamic_last4":null,"exp_month":12,"exp_year":2028,"fingerprint":"ftgJeBXvQSZ4HMCg","funding":"credit","last4":"4242","metadata":{},"name":null,"tokenization_method":null}],"has_more":false,"total_count":1,"url":"/v1/customers/cus_BSeSEx7Q0oBxoO/sources"},"subscriptions":{"object":"list","data":[],"has_more":false,"total_count":0,"url":"/v1/customers/cus_BSeSEx7Q0oBxoO/subscriptions"}}, [ 'Server',
   'X-Stripe-Privileged-Session-Required,stripe-manage-version,X-Stripe-External-Auth-Required',
  'Request-Id',
  'req_17gkzDiP7gY3Ev']);

nock('http://api.fixer.io:80', {"encodedQueryParams":true})
  .get('/latest')
  .query({"base":"EUR","symbols":"USD"})
  .reply(200, {"base":"EUR","date":"2017-09-22","rates":{"USD":1.1961}}, [ 'Server',
   'nosniff' ]);

nock('https://api.stripe.com:443', {"encodedQueryParams":true})
  .post('/v1/tokens', "customer=cus_BSeSEx7Q0oBxoO")
  .reply(200, {"id":"tok_1B5j9QD8MNtzsDcg5PAvI2zI","object":"token","card":{"id":"card_1B5j9QD8MNtzsDcgD0KIRS3e","object":"card","address_city":null,"address_country":null,"address_line1":null,"address_line1_check":null,"address_line2":null,"address_state":null,"address_zip":null,"address_zip_check":null,"brand":"Visa","country":"US","cvc_check":"pass","dynamic_last4":null,"exp_month":12,"exp_year":2028,"fingerprint":"nt4eriIIhN3fiPZF","funding":"credit","last4":"4242","metadata":{},"name":null,"tokenization_method":null},"client_ip":"68.173.154.69","created":1506294280,"livemode":false,"type":"card","used":false}, [ 'Server',
   'X-Stripe-Privileged-Session-Required,stripe-manage-version,X-Stripe-External-Auth-Required',
  'Request-Id',
  'req_l4I6FsnYrmwwAz',
  'Stripe-Version',
  '2015-04-07']);

nock('https://api.stripe.com:443', {"encodedQueryParams":true})
  .post('/v1/customers', "source=tok_1B5j9QD8MNtzsDcg5PAvI2zI&description=https%3A%2F%2Fopencollective.com%2Fxdamman&email=fd81e8b367fee82f45af1816e5ec9147%40gmail.com")
  .reply(200, {"id":"cus_BSeSxLkS6frBjo","object":"customer","account_balance":0,"created":1506294281,"currency":null,"default_source":"card_1B5j9QD8MNtzsDcgD0KIRS3e","delinquent":false,"description":"https://opencollective.com/xdamman","discount":null,"email":"fd81e8b367fee82f45af1816e5ec9147@gmail.com","livemode":false,"metadata":{},"shipping":null,"sources":{"object":"list","data":[{"id":"card_1B5j9QD8MNtzsDcgD0KIRS3e","object":"card","address_city":null,"address_country":null,"address_line1":null,"address_line1_check":null,"address_line2":null,"address_state":null,"address_zip":null,"address_zip_check":null,"brand":"Visa","country":"US","customer":"cus_BSeSxLkS6frBjo","cvc_check":"pass","dynamic_last4":null,"exp_month":12,"exp_year":2028,"fingerprint":"nt4eriIIhN3fiPZF","funding":"credit","last4":"4242","metadata":{},"name":null,"tokenization_method":null}],"has_more":false,"total_count":1,"url":"/v1/customers/cus_BSeSxLkS6frBjo/sources"},"subscriptions":{"object":"list","data":[],"has_more":false,"total_count":0,"url":"/v1/customers/cus_BSeSxLkS6frBjo/subscriptions"}}, [ 'Server',
   'X-Stripe-Privileged-Session-Required,stripe-manage-version,X-Stripe-External-Auth-Required',
  'Request-Id',
  'req_Zcl3512dLv5OGG',
  'Stripe-Version',
  '2015-04-07']);

nock('https://api.stripe.com:443', {"encodedQueryParams":true})
  .post('/v1/charges', "amount=154300&currency=EUR&customer=cus_BSeSxLkS6frBjo&description=Donation%20to%20BrusselsTogether%20(donor)&application_fee=7715&metadata%5Bfrom%5D=http%3A%2F%2Flocalhost%3A3000%2Fxdamman&metadata%5Bto%5D=http%3A%2F%2Flocalhost%3A3000%2Fbrusselstogether&metadata%5BcustomerEmail%5D=fd81e8b367fee82f45af1816e5ec9147%40gmail.com&metadata%5BPaymentMethodId%5D=4156")
  .reply(200, {"id":"ch_1B5j9SD8MNtzsDcgQOlOGenX","object":"charge","amount":154300,"amount_refunded":0,"application":"ca_68FQcZXEcV66Kjg7egLnR1Ce87cqwoue","application_fee":"fee_1B5j9SD8MNtzsDcgC3y21QZ1","balance_transaction":"txn_1B5j9SD8MNtzsDcg4BTmqeWc","captured":true,"created":1506294282,"currency":"eur","customer":"cus_BSeSxLkS6frBjo","description":"Donation to BrusselsTogether (donor)","destination":null,"dispute":null,"failure_code":null,"failure_message":null,"fraud_details":{},"invoice":null,"livemode":false,"metadata":{"from":"http://localhost:3000/xdamman","to":"http://localhost:3000/brusselstogether","customerEmail":"fd81e8b367fee82f45af1816e5ec9147@gmail.com","PaymentMethodId":"4156"},"on_behalf_of":null,"order":null,"outcome":{"network_status":"approved_by_network","reason":null,"risk_level":"normal","seller_message":"Payment complete.","type":"authorized"},"paid":true,"receipt_email":null,"receipt_number":null,"refunded":false,"refunds":{"object":"list","data":[],"has_more":false,"total_count":0,"url":"/v1/charges/ch_1B5j9SD8MNtzsDcgQOlOGenX/refunds"},"review":null,"shipping":null,"source":{"id":"card_1B5j9QD8MNtzsDcgD0KIRS3e","object":"card","address_city":null,"address_country":null,"address_line1":null,"address_line1_check":null,"address_line2":null,"address_state":null,"address_zip":null,"address_zip_check":null,"brand":"Visa","country":"US","customer":"cus_BSeSxLkS6frBjo","cvc_check":"pass","dynamic_last4":null,"exp_month":12,"exp_year":2028,"fingerprint":"nt4eriIIhN3fiPZF","funding":"credit","last4":"4242","metadata":{},"name":null,"tokenization_method":null},"source_transfer":null,"statement_descriptor":null,"status":"succeeded","transfer_group":null}, [ 'Server',
   'X-Stripe-Privileged-Session-Required,stripe-manage-version,X-Stripe-External-Auth-Required',
  'Request-Id',
  'req_IPmDMoqVHZx8p4',
  'Stripe-Version',
  '2015-04-07']);

nock('https://api.stripe.com:443', {"encodedQueryParams":true})
  .get('/v1/balance/history/txn_1B5j9SD8MNtzsDcg4BTmqeWc')
  .reply(200, {"id":"txn_1B5j9SD8MNtzsDcg4BTmqeWc","object":"balance_transaction","amount":154300,"available_on":1506816000,"created":1506294282,"currency":"eur","description":"Donation to BrusselsTogether (donor)","fee":12215,"fee_details":[{"amount":4500,"application":null,"currency":"eur","description":"Stripe processing fees","type":"stripe_fee"},{"amount":7715,"application":"ca_68FQcZXEcV66Kjg7egLnR1Ce87cqwoue","currency":"eur","description":"OpenCollective application fee","type":"application_fee"}],"net":142085,"source":"ch_1B5j9SD8MNtzsDcgQOlOGenX","sourced_transfers":{"object":"list","data":[],"has_more":false,"total_count":0,"url":"/v1/transfers?source_transaction=ch_1B5j9SD8MNtzsDcgQOlOGenX"},"status":"pending","type":"charge"}, [ 'Server',
   'X-Stripe-Privileged-Session-Required,stripe-manage-version,X-Stripe-External-Auth-Required',
  'Request-Id',
  'req_IoCB5VD4CTXWgS',
  'Stripe-Version',
  '2015-04-07']);

nock('https://api.stripe.com:443', {"encodedQueryParams":true})
  .get('/v1/charges/ch_1B5j9SD8MNtzsDcgQOlOGenX')
  .reply(200, {"id":"ch_1B5j9SD8MNtzsDcgQOlOGenX","object":"charge","amount":154300,"amount_refunded":0,"application":"ca_68FQcZXEcV66Kjg7egLnR1Ce87cqwoue","application_fee":"fee_1B5j9SD8MNtzsDcgC3y21QZ1","balance_transaction":"txn_1B5j9SD8MNtzsDcg4BTmqeWc","captured":true,"created":1506294282,"currency":"eur","customer":"cus_BSeSxLkS6frBjo","description":"Donation to BrusselsTogether (donor)","destination":null,"dispute":null,"failure_code":null,"failure_message":null,"fraud_details":{},"invoice":null,"livemode":false,"metadata":{"from":"http://localhost:3000/xdamman","to":"http://localhost:3000/brusselstogether","customerEmail":"fd81e8b367fee82f45af1816e5ec9147@gmail.com","PaymentMethodId":"4156"},"on_behalf_of":null,"order":null,"outcome":{"network_status":"approved_by_network","reason":null,"risk_level":"normal","seller_message":"Payment complete.","type":"authorized"},"paid":true,"receipt_email":null,"receipt_number":null,"refunded":false,"refunds":{"object":"list","data":[],"has_more":false,"total_count":0,"url":"/v1/charges/ch_1B5j9SD8MNtzsDcgQOlOGenX/refunds"},"review":null,"shipping":null,"source":{"id":"card_1B5j9QD8MNtzsDcgD0KIRS3e","object":"card","address_city":null,"address_country":null,"address_line1":null,"address_line1_check":null,"address_line2":null,"address_state":null,"address_zip":null,"address_zip_check":null,"brand":"Visa","country":"US","customer":"cus_BSeSxLkS6frBjo","cvc_check":"pass","dynamic_last4":null,"exp_month":12,"exp_year":2028,"fingerprint":"nt4eriIIhN3fiPZF","funding":"credit","last4":"4242","metadata":{},"name":null,"tokenization_method":null},"source_transfer":null,"statement_descriptor":null,"status":"succeeded","transfer_group":null}, [ 'Server',
   'X-Stripe-Privileged-Session-Required,stripe-manage-version,X-Stripe-External-Auth-Required',
  'Request-Id',
  'req_zsznppdgok717y',
  'Stripe-Version',
  '2015-04-07']);

nock('https://api.stripe.com:443', {"encodedQueryParams":true})
  .post('/v1/tokens', "card%5Bnumber%5D=4242424242424242&card%5Bexp_month%5D=12&card%5Bexp_year%5D=2028&card%5Bcvc%5D=222")
  .reply(200, {"id":"tok_1B5j9bDjPFcHOcTmKT132dUU","object":"token","card":{"id":"card_1B5j9bDjPFcHOcTmrEnSLdK2","object":"card","address_city":null,"address_country":null,"address_line1":null,"address_line1_check":null,"address_line2":null,"address_state":null,"address_zip":null,"address_zip_check":null,"brand":"Visa","country":"US","cvc_check":"unchecked","dynamic_last4":null,"exp_month":12,"exp_year":2028,"fingerprint":"ftgJeBXvQSZ4HMCg","funding":"credit","last4":"4242","metadata":{},"name":null,"tokenization_method":null},"client_ip":"68.173.154.69","created":1506294291,"livemode":false,"type":"card","used":false}, [ 'Server',
   'X-Stripe-Privileged-Session-Required,stripe-manage-version,X-Stripe-External-Auth-Required',
  'Request-Id',
  'req_Kr6Te4y2yNWmOE']);

nock('http://api.fixer.io:80', {"encodedQueryParams":true})
  .get('/latest')
  .query({"base":"EUR","symbols":"USD"})
  .reply(200, {"base":"EUR","date":"2017-09-22","rates":{"USD":1.1961}}, [ 'Server',
   'nosniff' ]);

nock('https://api.stripe.com:443', {"encodedQueryParams":true})
  .post('/v1/customers', "source=tok_1B5j9bDjPFcHOcTmKT132dUU&description=https%3A%2F%2Fopencollective.com%2Fxdamman&email=fd81e8b367fee82f45af1816e5ec9147%40gmail.com")
  .reply(200, {"id":"cus_BSeSUHTkNxqYr8","object":"customer","account_balance":0,"created":1506294292,"currency":null,"default_source":"card_1B5j9bDjPFcHOcTmrEnSLdK2","delinquent":false,"description":"https://opencollective.com/xdamman","discount":null,"email":"fd81e8b367fee82f45af1816e5ec9147@gmail.com","livemode":false,"metadata":{},"shipping":null,"sources":{"object":"list","data":[{"id":"card_1B5j9bDjPFcHOcTmrEnSLdK2","object":"card","address_city":null,"address_country":null,"address_line1":null,"address_line1_check":null,"address_line2":null,"address_state":null,"address_zip":null,"address_zip_check":null,"brand":"Visa","country":"US","customer":"cus_BSeSUHTkNxqYr8","cvc_check":"pass","dynamic_last4":null,"exp_month":12,"exp_year":2028,"fingerprint":"ftgJeBXvQSZ4HMCg","funding":"credit","last4":"4242","metadata":{},"name":null,"tokenization_method":null}],"has_more":false,"total_count":1,"url":"/v1/customers/cus_BSeSUHTkNxqYr8/sources"},"subscriptions":{"object":"list","data":[],"has_more":false,"total_count":0,"url":"/v1/customers/cus_BSeSUHTkNxqYr8/subscriptions"}}, [ 'Server',
   'X-Stripe-Privileged-Session-Required,stripe-manage-version,X-Stripe-External-Auth-Required',
  'Request-Id',
  'req_RQuDXIjbMrYEc4']);

nock('https://api.stripe.com:443', {"encodedQueryParams":true})
  .post('/v1/tokens', "customer=cus_BSeSUHTkNxqYr8")
  .reply(200, {"id":"tok_1B5j9dD8MNtzsDcgOvkiUy1j","object":"token","card":{"id":"card_1B5j9dD8MNtzsDcgmlFcz9qx","object":"card","address_city":null,"address_country":null,"address_line1":null,"address_line1_check":null,"address_line2":null,"address_state":null,"address_zip":null,"address_zip_check":null,"brand":"Visa","country":"US","cvc_check":"pass","dynamic_last4":null,"exp_month":12,"exp_year":2028,"fingerprint":"nt4eriIIhN3fiPZF","funding":"credit","last4":"4242","metadata":{},"name":null,"tokenization_method":null},"client_ip":"68.173.154.69","created":1506294293,"livemode":false,"type":"card","used":false}, [ 'Server',
   'X-Stripe-Privileged-Session-Required,stripe-manage-version,X-Stripe-External-Auth-Required',
  'Request-Id',
  'req_rpVTOLPphKtIfy',
  'Stripe-Version',
  '2015-04-07']);

nock('https://api.stripe.com:443', {"encodedQueryParams":true})
  .post('/v1/customers', "source=tok_1B5j9dD8MNtzsDcgOvkiUy1j&description=https%3A%2F%2Fopencollective.com%2Fxdamman&email=fd81e8b367fee82f45af1816e5ec9147%40gmail.com")
  .reply(200, {"id":"cus_BSeSINyKvEIHi9","object":"customer","account_balance":0,"created":1506294293,"currency":null,"default_source":"card_1B5j9dD8MNtzsDcgmlFcz9qx","delinquent":false,"description":"https://opencollective.com/xdamman","discount":null,"email":"fd81e8b367fee82f45af1816e5ec9147@gmail.com","livemode":false,"metadata":{},"shipping":null,"sources":{"object":"list","data":[{"id":"card_1B5j9dD8MNtzsDcgmlFcz9qx","object":"card","address_city":null,"address_country":null,"address_line1":null,"address_line1_check":null,"address_line2":null,"address_state":null,"address_zip":null,"address_zip_check":null,"brand":"Visa","country":"US","customer":"cus_BSeSINyKvEIHi9","cvc_check":"pass","dynamic_last4":null,"exp_month":12,"exp_year":2028,"fingerprint":"nt4eriIIhN3fiPZF","funding":"credit","last4":"4242","metadata":{},"name":null,"tokenization_method":null}],"has_more":false,"total_count":1,"url":"/v1/customers/cus_BSeSINyKvEIHi9/sources"},"subscriptions":{"object":"list","data":[],"has_more":false,"total_count":0,"url":"/v1/customers/cus_BSeSINyKvEIHi9/subscriptions"}}, [ 'Server',
   'X-Stripe-Privileged-Session-Required,stripe-manage-version,X-Stripe-External-Auth-Required',
  'Request-Id',
  'req_nRrDL4pzMyNk5A',
  'Stripe-Version',
  '2015-04-07']);

nock('https://api.stripe.com:443', {"encodedQueryParams":true})
  .post('/v1/charges', "amount=1000&currency=EUR&customer=cus_BSeSINyKvEIHi9&description=Monthly%20donation%20to%20BrusselsTogether%20(donor)&application_fee=50&metadata%5Bfrom%5D=http%3A%2F%2Flocalhost%3A3000%2Fxdamman&metadata%5Bto%5D=http%3A%2F%2Flocalhost%3A3000%2Fbrusselstogether&metadata%5BcustomerEmail%5D=fd81e8b367fee82f45af1816e5ec9147%40gmail.com&metadata%5BPaymentMethodId%5D=4156")
  .reply(200, {"id":"ch_1B5j9eD8MNtzsDcgWxuO1wwq","object":"charge","amount":1000,"amount_refunded":0,"application":"ca_68FQcZXEcV66Kjg7egLnR1Ce87cqwoue","application_fee":"fee_1B5j9fD8MNtzsDcg2ffprqQM","balance_transaction":"txn_1B5j9fD8MNtzsDcgBCkfO77N","captured":true,"created":1506294294,"currency":"eur","customer":"cus_BSeSINyKvEIHi9","description":"Monthly donation to BrusselsTogether (donor)","destination":null,"dispute":null,"failure_code":null,"failure_message":null,"fraud_details":{},"invoice":null,"livemode":false,"metadata":{"from":"http://localhost:3000/xdamman","to":"http://localhost:3000/brusselstogether","customerEmail":"fd81e8b367fee82f45af1816e5ec9147@gmail.com","PaymentMethodId":"4156"},"on_behalf_of":null,"order":null,"outcome":{"network_status":"approved_by_network","reason":null,"risk_level":"normal","seller_message":"Payment complete.","type":"authorized"},"paid":true,"receipt_email":null,"receipt_number":null,"refunded":false,"refunds":{"object":"list","data":[],"has_more":false,"total_count":0,"url":"/v1/charges/ch_1B5j9eD8MNtzsDcgWxuO1wwq/refunds"},"review":null,"shipping":null,"source":{"id":"card_1B5j9dD8MNtzsDcgmlFcz9qx","object":"card","address_city":null,"address_country":null,"address_line1":null,"address_line1_check":null,"address_line2":null,"address_state":null,"address_zip":null,"address_zip_check":null,"brand":"Visa","country":"US","customer":"cus_BSeSINyKvEIHi9","cvc_check":"pass","dynamic_last4":null,"exp_month":12,"exp_year":2028,"fingerprint":"nt4eriIIhN3fiPZF","funding":"credit","last4":"4242","metadata":{},"name":null,"tokenization_method":null},"source_transfer":null,"statement_descriptor":null,"status":"succeeded","transfer_group":null}, [ 'Server',
   'X-Stripe-Privileged-Session-Required,stripe-manage-version,X-Stripe-External-Auth-Required',
  'Request-Id',
  'req_o5GKsTNWPNwHrt',
  'Stripe-Version',
  '2015-04-07']);

nock('https://api.stripe.com:443', {"encodedQueryParams":true})
  .get('/v1/balance/history/txn_1B5j9fD8MNtzsDcgBCkfO77N')
  .reply(200, {"id":"txn_1B5j9fD8MNtzsDcgBCkfO77N","object":"balance_transaction","amount":1000,"available_on":1506816000,"created":1506294294,"currency":"eur","description":"Monthly donation to BrusselsTogether (donor)","fee":104,"fee_details":[{"amount":50,"application":"ca_68FQcZXEcV66Kjg7egLnR1Ce87cqwoue","currency":"eur","description":"OpenCollective application fee","type":"application_fee"},{"amount":54,"application":null,"currency":"eur","description":"Stripe processing fees","type":"stripe_fee"}],"net":896,"source":"ch_1B5j9eD8MNtzsDcgWxuO1wwq","sourced_transfers":{"object":"list","data":[],"has_more":false,"total_count":0,"url":"/v1/transfers?source_transaction=ch_1B5j9eD8MNtzsDcgWxuO1wwq"},"status":"pending","type":"charge"}, [ 'Server',
   'X-Stripe-Privileged-Session-Required,stripe-manage-version,X-Stripe-External-Auth-Required',
  'Request-Id',
  'req_3Yn7kEt56Mr6Zr',
  'Stripe-Version',
  '2015-04-07']);

nock('https://api.stripe.com:443', {"encodedQueryParams":true})
  .get('/v1/plans/EUR-MONTH-1000')
  .reply(200, {"id":"EUR-MONTH-1000","object":"plan","amount":1000,"created":1503518941,"currency":"eur","interval":"month","interval_count":1,"livemode":false,"metadata":{},"name":"EUR-MONTH-1000","statement_descriptor":null,"trial_period_days":null}, [ 'Server',
   'X-Stripe-Privileged-Session-Required,stripe-manage-version,X-Stripe-External-Auth-Required',
  'Request-Id',
  'req_XuOo1qS8bOloS0',
  'Stripe-Version',
  '2015-04-07']);

nock('https://api.stripe.com:443', {"encodedQueryParams":true})
  .post('/v1/customers/cus_BSeSINyKvEIHi9/subscriptions', /plan=EUR-MONTH-1000&application_fee_percent=5&trial_end=[0-9]{10}&metadata%5Bfrom%5D=http%3A%2F%2Flocalhost%3A3000%2Fxdamman&metadata%5Bto%5D=http%3A%2F%2Flocalhost%3A3000%2Fbrusselstogether&metadata%5BPaymentMethodId%5D=4156/)
  .reply(200, {"id":"sub_BSeSbgHtfS4sgC","object":"subscription","application_fee_percent":5,"cancel_at_period_end":false,"canceled_at":null,"created":1506294297,"current_period_end":1506899091,"current_period_start":1506294297,"customer":"cus_BSeSINyKvEIHi9","discount":null,"ended_at":null,"items":{"object":"list","data":[{"id":"si_1B5j9hD8MNtzsDcgOeQaQGoP","object":"subscription_item","created":1506294297,"metadata":{},"plan":{"id":"EUR-MONTH-1000","object":"plan","amount":1000,"created":1503518941,"currency":"eur","interval":"month","interval_count":1,"livemode":false,"metadata":{},"name":"EUR-MONTH-1000","statement_descriptor":null,"trial_period_days":null},"quantity":1}],"has_more":false,"total_count":1,"url":"/v1/subscription_items?subscription=sub_BSeSbgHtfS4sgC"},"livemode":false,"metadata":{"from":"http://localhost:3000/xdamman","to":"http://localhost:3000/brusselstogether","PaymentMethodId":"4156"},"plan":{"id":"EUR-MONTH-1000","object":"plan","amount":1000,"created":1503518941,"currency":"eur","interval":"month","interval_count":1,"livemode":false,"metadata":{},"name":"EUR-MONTH-1000","statement_descriptor":null,"trial_period_days":null},"quantity":1,"start":1506294297,"status":"trialing","tax_percent":null,"trial_end":1506899091,"trial_start":1506294297}, [ 'Server',
   'X-Stripe-Privileged-Session-Required,stripe-manage-version,X-Stripe-External-Auth-Required',
  'Request-Id',
  'req_0COLHVmz4JdeaP',
  'Stripe-Version',
  '2015-04-07']);

nock('https://api.stripe.com:443', {"encodedQueryParams":true})
  .get('/v1/subscriptions/sub_BSeSbgHtfS4sgC')
  .reply(200, {"id":"sub_BSeSbgHtfS4sgC","object":"subscription","application_fee_percent":5,"cancel_at_period_end":false,"canceled_at":null,"created":1506294297,"current_period_end":1506899091,"current_period_start":1506294297,"customer":"cus_BSeSINyKvEIHi9","discount":null,"ended_at":null,"items":{"object":"list","data":[{"id":"si_1B5j9hD8MNtzsDcgOeQaQGoP","object":"subscription_item","created":1506294297,"metadata":{},"plan":{"id":"EUR-MONTH-1000","object":"plan","amount":1000,"created":1503518941,"currency":"eur","interval":"month","interval_count":1,"livemode":false,"metadata":{},"name":"EUR-MONTH-1000","statement_descriptor":null,"trial_period_days":null},"quantity":1}],"has_more":false,"total_count":1,"url":"/v1/subscription_items?subscription=sub_BSeSbgHtfS4sgC"},"livemode":false,"metadata":{"from":"http://localhost:3000/xdamman","to":"http://localhost:3000/brusselstogether","PaymentMethodId":"4156"},"plan":{"id":"EUR-MONTH-1000","object":"plan","amount":1000,"created":1503518941,"currency":"eur","interval":"month","interval_count":1,"livemode":false,"metadata":{},"name":"EUR-MONTH-1000","statement_descriptor":null,"trial_period_days":null},"quantity":1,"start":1506294297,"status":"trialing","tax_percent":null,"trial_end":1506899091,"trial_start":1506294297}, [ 'Server',
   'X-Stripe-Privileged-Session-Required,stripe-manage-version,X-Stripe-External-Auth-Required',
  'Request-Id',
  'req_assmVifCUSXBfh',
  'Stripe-Version',
  '2015-04-07']);

nock('https://api.stripe.com:443', {"encodedQueryParams":true})
  .post('/v1/tokens', "card%5Bnumber%5D=4242424242424242&card%5Bexp_month%5D=12&card%5Bexp_year%5D=2028&card%5Bcvc%5D=222")
  .reply(200, {"id":"tok_1B5j9pDjPFcHOcTm45gGZfDg","object":"token","card":{"id":"card_1B5j9pDjPFcHOcTmftU4MHf1","object":"card","address_city":null,"address_country":null,"address_line1":null,"address_line1_check":null,"address_line2":null,"address_state":null,"address_zip":null,"address_zip_check":null,"brand":"Visa","country":"US","cvc_check":"unchecked","dynamic_last4":null,"exp_month":12,"exp_year":2028,"fingerprint":"ftgJeBXvQSZ4HMCg","funding":"credit","last4":"4242","metadata":{},"name":null,"tokenization_method":null},"client_ip":"68.173.154.69","created":1506294305,"livemode":false,"type":"card","used":false}, [ 'Server',
   'X-Stripe-Privileged-Session-Required,stripe-manage-version,X-Stripe-External-Auth-Required',
  'Request-Id',
  'req_n8aPyUScdWqSES']);

nock('http://api.fixer.io:80', {"encodedQueryParams":true})
  .get('/latest')
  .query({"base":"EUR","symbols":"USD"})
  .reply(200, {"base":"EUR","date":"2017-09-22","rates":{"USD":1.1961}}, [ 'Server',
   'nosniff' ]);

nock('https://api.stripe.com:443', {"encodedQueryParams":true})
  .post('/v1/customers', "source=tok_1B5j9pDjPFcHOcTm45gGZfDg&description=https%3A%2F%2Fopencollective.com%2Fnewco&email=jsmith%40email.com")
  .reply(200, {"id":"cus_BSeSTM5ahueqN7","object":"customer","account_balance":0,"created":1506294307,"currency":null,"default_source":"card_1B5j9pDjPFcHOcTmftU4MHf1","delinquent":false,"description":"https://opencollective.com/newco","discount":null,"email":"jsmith@email.com","livemode":false,"metadata":{},"shipping":null,"sources":{"object":"list","data":[{"id":"card_1B5j9pDjPFcHOcTmftU4MHf1","object":"card","address_city":null,"address_country":null,"address_line1":null,"address_line1_check":null,"address_line2":null,"address_state":null,"address_zip":null,"address_zip_check":null,"brand":"Visa","country":"US","customer":"cus_BSeSTM5ahueqN7","cvc_check":"pass","dynamic_last4":null,"exp_month":12,"exp_year":2028,"fingerprint":"ftgJeBXvQSZ4HMCg","funding":"credit","last4":"4242","metadata":{},"name":null,"tokenization_method":null}],"has_more":false,"total_count":1,"url":"/v1/customers/cus_BSeSTM5ahueqN7/sources"},"subscriptions":{"object":"list","data":[],"has_more":false,"total_count":0,"url":"/v1/customers/cus_BSeSTM5ahueqN7/subscriptions"}}, [ 'Server',
   'X-Stripe-Privileged-Session-Required,stripe-manage-version,X-Stripe-External-Auth-Required',
  'Request-Id',
  'req_2J68y4BPYmMYqx']);

nock('https://api.stripe.com:443', {"encodedQueryParams":true})
  .post('/v1/tokens', "customer=cus_BSeSTM5ahueqN7")
  .reply(200, {"id":"tok_1B5j9sD8MNtzsDcghOJSoOFI","object":"token","card":{"id":"card_1B5j9sD8MNtzsDcgjSEGkC84","object":"card","address_city":null,"address_country":null,"address_line1":null,"address_line1_check":null,"address_line2":null,"address_state":null,"address_zip":null,"address_zip_check":null,"brand":"Visa","country":"US","cvc_check":"pass","dynamic_last4":null,"exp_month":12,"exp_year":2028,"fingerprint":"nt4eriIIhN3fiPZF","funding":"credit","last4":"4242","metadata":{},"name":null,"tokenization_method":null},"client_ip":"68.173.154.69","created":1506294308,"livemode":false,"type":"card","used":false}, [ 'Server',
   'X-Stripe-Privileged-Session-Required,stripe-manage-version,X-Stripe-External-Auth-Required',
  'Request-Id',
  'req_7OEJqVKDrvuK2c',
  'Stripe-Version',
  '2015-04-07']);

nock('https://api.stripe.com:443', {"encodedQueryParams":true})
  .post('/v1/customers', "source=tok_1B5j9sD8MNtzsDcghOJSoOFI&description=https%3A%2F%2Fopencollective.com%2Fnewco&email=jsmith%40email.com")
  .reply(200, {"id":"cus_BSeSKsqIhPGdT5","object":"customer","account_balance":0,"created":1506294308,"currency":null,"default_source":"card_1B5j9sD8MNtzsDcgjSEGkC84","delinquent":false,"description":"https://opencollective.com/newco","discount":null,"email":"jsmith@email.com","livemode":false,"metadata":{},"shipping":null,"sources":{"object":"list","data":[{"id":"card_1B5j9sD8MNtzsDcgjSEGkC84","object":"card","address_city":null,"address_country":null,"address_line1":null,"address_line1_check":null,"address_line2":null,"address_state":null,"address_zip":null,"address_zip_check":null,"brand":"Visa","country":"US","customer":"cus_BSeSKsqIhPGdT5","cvc_check":"pass","dynamic_last4":null,"exp_month":12,"exp_year":2028,"fingerprint":"nt4eriIIhN3fiPZF","funding":"credit","last4":"4242","metadata":{},"name":null,"tokenization_method":null}],"has_more":false,"total_count":1,"url":"/v1/customers/cus_BSeSKsqIhPGdT5/sources"},"subscriptions":{"object":"list","data":[],"has_more":false,"total_count":0,"url":"/v1/customers/cus_BSeSKsqIhPGdT5/subscriptions"}}, [ 'Server',
   'X-Stripe-Privileged-Session-Required,stripe-manage-version,X-Stripe-External-Auth-Required',
  'Request-Id',
  'req_WuOrOrrmiWfs95',
  'Stripe-Version',
  '2015-04-07']);

nock('https://api.stripe.com:443', {"encodedQueryParams":true})
  .post('/v1/charges', "amount=1000&currency=EUR&customer=cus_BSeSKsqIhPGdT5&description=Monthly%20donation%20to%20BrusselsTogether%20(donor)&application_fee=50&metadata%5Bfrom%5D=http%3A%2F%2Flocalhost%3A3000%2Fnewco&metadata%5Bto%5D=http%3A%2F%2Flocalhost%3A3000%2Fbrusselstogether&metadata%5BcustomerEmail%5D=jsmith%40email.com&metadata%5BPaymentMethodId%5D=4158")
  .reply(200, {"id":"ch_1B5j9tD8MNtzsDcgEjc2ZdFR","object":"charge","amount":1000,"amount_refunded":0,"application":"ca_68FQcZXEcV66Kjg7egLnR1Ce87cqwoue","application_fee":"fee_1B5j9uD8MNtzsDcgPlDU3jGm","balance_transaction":"txn_1B5j9uD8MNtzsDcgJitah7qW","captured":true,"created":1506294309,"currency":"eur","customer":"cus_BSeSKsqIhPGdT5","description":"Monthly donation to BrusselsTogether (donor)","destination":null,"dispute":null,"failure_code":null,"failure_message":null,"fraud_details":{},"invoice":null,"livemode":false,"metadata":{"from":"http://localhost:3000/newco","to":"http://localhost:3000/brusselstogether","customerEmail":"jsmith@email.com","PaymentMethodId":"4158"},"on_behalf_of":null,"order":null,"outcome":{"network_status":"approved_by_network","reason":null,"risk_level":"normal","seller_message":"Payment complete.","type":"authorized"},"paid":true,"receipt_email":null,"receipt_number":null,"refunded":false,"refunds":{"object":"list","data":[],"has_more":false,"total_count":0,"url":"/v1/charges/ch_1B5j9tD8MNtzsDcgEjc2ZdFR/refunds"},"review":null,"shipping":null,"source":{"id":"card_1B5j9sD8MNtzsDcgjSEGkC84","object":"card","address_city":null,"address_country":null,"address_line1":null,"address_line1_check":null,"address_line2":null,"address_state":null,"address_zip":null,"address_zip_check":null,"brand":"Visa","country":"US","customer":"cus_BSeSKsqIhPGdT5","cvc_check":"pass","dynamic_last4":null,"exp_month":12,"exp_year":2028,"fingerprint":"nt4eriIIhN3fiPZF","funding":"credit","last4":"4242","metadata":{},"name":null,"tokenization_method":null},"source_transfer":null,"statement_descriptor":null,"status":"succeeded","transfer_group":null}, [ 'Server',
   'X-Stripe-Privileged-Session-Required,stripe-manage-version,X-Stripe-External-Auth-Required',
  'Request-Id',
  'req_JWr0VFdFRgNqvu',
  'Stripe-Version',
  '2015-04-07']);

nock('https://api.stripe.com:443', {"encodedQueryParams":true})
  .get('/v1/balance/history/txn_1B5j9uD8MNtzsDcgJitah7qW')
  .reply(200, {"id":"txn_1B5j9uD8MNtzsDcgJitah7qW","object":"balance_transaction","amount":1000,"available_on":1506816000,"created":1506294309,"currency":"eur","description":"Monthly donation to BrusselsTogether (donor)","fee":104,"fee_details":[{"amount":54,"application":null,"currency":"eur","description":"Stripe processing fees","type":"stripe_fee"},{"amount":50,"application":"ca_68FQcZXEcV66Kjg7egLnR1Ce87cqwoue","currency":"eur","description":"OpenCollective application fee","type":"application_fee"}],"net":896,"source":"ch_1B5j9tD8MNtzsDcgEjc2ZdFR","sourced_transfers":{"object":"list","data":[],"has_more":false,"total_count":0,"url":"/v1/transfers?source_transaction=ch_1B5j9tD8MNtzsDcgEjc2ZdFR"},"status":"pending","type":"charge"}, [ 'Server',
   'X-Stripe-Privileged-Session-Required,stripe-manage-version,X-Stripe-External-Auth-Required',
  'Request-Id',
  'req_vKaHqAf0qJURkh',
  'Stripe-Version',
  '2015-04-07']);

nock('https://api.stripe.com:443', {"encodedQueryParams":true})
  .get('/v1/plans/EUR-MONTH-1000')
  .reply(200, {"id":"EUR-MONTH-1000","object":"plan","amount":1000,"created":1503518941,"currency":"eur","interval":"month","interval_count":1,"livemode":false,"metadata":{},"name":"EUR-MONTH-1000","statement_descriptor":null,"trial_period_days":null}, [ 'Server',
   'X-Stripe-Privileged-Session-Required,stripe-manage-version,X-Stripe-External-Auth-Required',
  'Request-Id',
  'req_BkUGW9UvZB9m3o',
  'Stripe-Version',
  '2015-04-07']);

nock('https://api.stripe.com:443', {"encodedQueryParams":true})
  .post('/v1/customers/cus_BSeSKsqIhPGdT5/subscriptions', /plan=EUR-MONTH-1000&application_fee_percent=5&trial_end=[0-9]{10}&metadata%5Bfrom%5D=http%3A%2F%2Flocalhost%3A3000%2Fnewco&metadata%5Bto%5D=http%3A%2F%2Flocalhost%3A3000%2Fbrusselstogether&metadata%5BPaymentMethodId%5D=4158/)
  .reply(200, {"id":"sub_BSeSqdA9wQ8Yfa","object":"subscription","application_fee_percent":5,"cancel_at_period_end":false,"canceled_at":null,"created":1506294312,"current_period_end":1506899106,"current_period_start":1506294312,"customer":"cus_BSeSKsqIhPGdT5","discount":null,"ended_at":null,"items":{"object":"list","data":[{"id":"si_1B5j9wD8MNtzsDcghrce6yQV","object":"subscription_item","created":1506294312,"metadata":{},"plan":{"id":"EUR-MONTH-1000","object":"plan","amount":1000,"created":1503518941,"currency":"eur","interval":"month","interval_count":1,"livemode":false,"metadata":{},"name":"EUR-MONTH-1000","statement_descriptor":null,"trial_period_days":null},"quantity":1}],"has_more":false,"total_count":1,"url":"/v1/subscription_items?subscription=sub_BSeSqdA9wQ8Yfa"},"livemode":false,"metadata":{"from":"http://localhost:3000/newco","to":"http://localhost:3000/brusselstogether","PaymentMethodId":"4158"},"plan":{"id":"EUR-MONTH-1000","object":"plan","amount":1000,"created":1503518941,"currency":"eur","interval":"month","interval_count":1,"livemode":false,"metadata":{},"name":"EUR-MONTH-1000","statement_descriptor":null,"trial_period_days":null},"quantity":1,"start":1506294312,"status":"trialing","tax_percent":null,"trial_end":1506899106,"trial_start":1506294312}, [ 'Server',
   'X-Stripe-Privileged-Session-Required,stripe-manage-version,X-Stripe-External-Auth-Required',
  'Request-Id',
  'req_0kLXogfXMh5kvL',
  'Stripe-Version',
  '2015-04-07']);

nock('https://api.stripe.com:443', {"encodedQueryParams":true})
  .post('/v1/tokens', "card%5Bnumber%5D=4242424242424242&card%5Bexp_month%5D=12&card%5Bexp_year%5D=2028&card%5Bcvc%5D=222")
  .reply(200, {"id":"tok_1B5jA4DjPFcHOcTmwvUagDQs","object":"token","card":{"id":"card_1B5jA4DjPFcHOcTmyuuJWZFr","object":"card","address_city":null,"address_country":null,"address_line1":null,"address_line1_check":null,"address_line2":null,"address_state":null,"address_zip":null,"address_zip_check":null,"brand":"Visa","country":"US","cvc_check":"unchecked","dynamic_last4":null,"exp_month":12,"exp_year":2028,"fingerprint":"ftgJeBXvQSZ4HMCg","funding":"credit","last4":"4242","metadata":{},"name":null,"tokenization_method":null},"client_ip":"68.173.154.69","created":1506294320,"livemode":false,"type":"card","used":false}, [ 'Server',
   'X-Stripe-Privileged-Session-Required,stripe-manage-version,X-Stripe-External-Auth-Required',
  'Request-Id',
  'req_kgnEpAKCe0ZeTK']);

nock('http://api.fixer.io:80', {"encodedQueryParams":true})
  .get('/latest')
  .query({"base":"EUR","symbols":"USD"})
  .reply(200, {"base":"EUR","date":"2017-09-22","rates":{"USD":1.1961}}, [ 'Server',
   'nosniff' ]);

nock('https://api.stripe.com:443', {"encodedQueryParams":true})
  .post('/v1/customers', "source=tok_1B5jA4DjPFcHOcTmwvUagDQs&description=https%3A%2F%2Fopencollective.com%2Fnewco&email=fd81e8b367fee82f45af1816e5ec9147%40gmail.com")
  .reply(200, {"id":"cus_BSeTy8b9kzew1L","object":"customer","account_balance":0,"created":1506294322,"currency":null,"default_source":"card_1B5jA4DjPFcHOcTmyuuJWZFr","delinquent":false,"description":"https://opencollective.com/newco","discount":null,"email":"fd81e8b367fee82f45af1816e5ec9147@gmail.com","livemode":false,"metadata":{},"shipping":null,"sources":{"object":"list","data":[{"id":"card_1B5jA4DjPFcHOcTmyuuJWZFr","object":"card","address_city":null,"address_country":null,"address_line1":null,"address_line1_check":null,"address_line2":null,"address_state":null,"address_zip":null,"address_zip_check":null,"brand":"Visa","country":"US","customer":"cus_BSeTy8b9kzew1L","cvc_check":"pass","dynamic_last4":null,"exp_month":12,"exp_year":2028,"fingerprint":"ftgJeBXvQSZ4HMCg","funding":"credit","last4":"4242","metadata":{},"name":null,"tokenization_method":null}],"has_more":false,"total_count":1,"url":"/v1/customers/cus_BSeTy8b9kzew1L/sources"},"subscriptions":{"object":"list","data":[],"has_more":false,"total_count":0,"url":"/v1/customers/cus_BSeTy8b9kzew1L/subscriptions"}}, [ 'Server',
   'X-Stripe-Privileged-Session-Required,stripe-manage-version,X-Stripe-External-Auth-Required',
  'Request-Id',
  'req_VrLRj1u65cDVLV']);

nock('https://api.stripe.com:443', {"encodedQueryParams":true})
  .post('/v1/tokens', "customer=cus_BSeTy8b9kzew1L")
  .reply(200, {"id":"tok_1B5jA7D8MNtzsDcgEm3g1fqw","object":"token","card":{"id":"card_1B5jA6D8MNtzsDcgc5NscftQ","object":"card","address_city":null,"address_country":null,"address_line1":null,"address_line1_check":null,"address_line2":null,"address_state":null,"address_zip":null,"address_zip_check":null,"brand":"Visa","country":"US","cvc_check":"pass","dynamic_last4":null,"exp_month":12,"exp_year":2028,"fingerprint":"nt4eriIIhN3fiPZF","funding":"credit","last4":"4242","metadata":{},"name":null,"tokenization_method":null},"client_ip":"68.173.154.69","created":1506294323,"livemode":false,"type":"card","used":false}, [ 'Server',
   'X-Stripe-Privileged-Session-Required,stripe-manage-version,X-Stripe-External-Auth-Required',
  'Request-Id',
  'req_7cRSr6WcY0nbfU',
  'Stripe-Version',
  '2015-04-07']);

nock('https://api.stripe.com:443', {"encodedQueryParams":true})
  .post('/v1/customers', "source=tok_1B5jA7D8MNtzsDcgEm3g1fqw&description=https%3A%2F%2Fopencollective.com%2Fnewco&email=fd81e8b367fee82f45af1816e5ec9147%40gmail.com")
  .reply(200, {"id":"cus_BSeTa7dWu6rNSG","object":"customer","account_balance":0,"created":1506294323,"currency":null,"default_source":"card_1B5jA6D8MNtzsDcgc5NscftQ","delinquent":false,"description":"https://opencollective.com/newco","discount":null,"email":"fd81e8b367fee82f45af1816e5ec9147@gmail.com","livemode":false,"metadata":{},"shipping":null,"sources":{"object":"list","data":[{"id":"card_1B5jA6D8MNtzsDcgc5NscftQ","object":"card","address_city":null,"address_country":null,"address_line1":null,"address_line1_check":null,"address_line2":null,"address_state":null,"address_zip":null,"address_zip_check":null,"brand":"Visa","country":"US","customer":"cus_BSeTa7dWu6rNSG","cvc_check":"pass","dynamic_last4":null,"exp_month":12,"exp_year":2028,"fingerprint":"nt4eriIIhN3fiPZF","funding":"credit","last4":"4242","metadata":{},"name":null,"tokenization_method":null}],"has_more":false,"total_count":1,"url":"/v1/customers/cus_BSeTa7dWu6rNSG/sources"},"subscriptions":{"object":"list","data":[],"has_more":false,"total_count":0,"url":"/v1/customers/cus_BSeTa7dWu6rNSG/subscriptions"}}, [ 'Server',
   'X-Stripe-Privileged-Session-Required,stripe-manage-version,X-Stripe-External-Auth-Required',
  'Request-Id',
  'req_lzViIPage4byXc',
  'Stripe-Version',
  '2015-04-07']);

nock('https://api.stripe.com:443', {"encodedQueryParams":true})
  .post('/v1/charges', "amount=1000&currency=EUR&customer=cus_BSeTa7dWu6rNSG&description=Monthly%20donation%20to%20BrusselsTogether%20(donor)&application_fee=50&metadata%5Bfrom%5D=http%3A%2F%2Flocalhost%3A3000%2Fnewco&metadata%5Bto%5D=http%3A%2F%2Flocalhost%3A3000%2Fbrusselstogether&metadata%5BcustomerEmail%5D=fd81e8b367fee82f45af1816e5ec9147%40gmail.com&metadata%5BPaymentMethodId%5D=4157")
  .reply(200, {"id":"ch_1B5jA8D8MNtzsDcgtWcrtY08","object":"charge","amount":1000,"amount_refunded":0,"application":"ca_68FQcZXEcV66Kjg7egLnR1Ce87cqwoue","application_fee":"fee_1B5jA8D8MNtzsDcgzD4J7IKM","balance_transaction":"txn_1B5jA8D8MNtzsDcgaHWqHqSN","captured":true,"created":1506294324,"currency":"eur","customer":"cus_BSeTa7dWu6rNSG","description":"Monthly donation to BrusselsTogether (donor)","destination":null,"dispute":null,"failure_code":null,"failure_message":null,"fraud_details":{},"invoice":null,"livemode":false,"metadata":{"from":"http://localhost:3000/newco","to":"http://localhost:3000/brusselstogether","customerEmail":"fd81e8b367fee82f45af1816e5ec9147@gmail.com","PaymentMethodId":"4157"},"on_behalf_of":null,"order":null,"outcome":{"network_status":"approved_by_network","reason":null,"risk_level":"normal","seller_message":"Payment complete.","type":"authorized"},"paid":true,"receipt_email":null,"receipt_number":null,"refunded":false,"refunds":{"object":"list","data":[],"has_more":false,"total_count":0,"url":"/v1/charges/ch_1B5jA8D8MNtzsDcgtWcrtY08/refunds"},"review":null,"shipping":null,"source":{"id":"card_1B5jA6D8MNtzsDcgc5NscftQ","object":"card","address_city":null,"address_country":null,"address_line1":null,"address_line1_check":null,"address_line2":null,"address_state":null,"address_zip":null,"address_zip_check":null,"brand":"Visa","country":"US","customer":"cus_BSeTa7dWu6rNSG","cvc_check":"pass","dynamic_last4":null,"exp_month":12,"exp_year":2028,"fingerprint":"nt4eriIIhN3fiPZF","funding":"credit","last4":"4242","metadata":{},"name":null,"tokenization_method":null},"source_transfer":null,"statement_descriptor":null,"status":"succeeded","transfer_group":null}, [ 'Server',
   'X-Stripe-Privileged-Session-Required,stripe-manage-version,X-Stripe-External-Auth-Required',
  'Request-Id',
  'req_GWO08E32FRw4Xk',
  'Stripe-Version',
  '2015-04-07']);

nock('https://api.stripe.com:443', {"encodedQueryParams":true})
  .get('/v1/balance/history/txn_1B5jA8D8MNtzsDcgaHWqHqSN')
  .reply(200, {"id":"txn_1B5jA8D8MNtzsDcgaHWqHqSN","object":"balance_transaction","amount":1000,"available_on":1506816000,"created":1506294324,"currency":"eur","description":"Monthly donation to BrusselsTogether (donor)","fee":104,"fee_details":[{"amount":54,"application":null,"currency":"eur","description":"Stripe processing fees","type":"stripe_fee"},{"amount":50,"application":"ca_68FQcZXEcV66Kjg7egLnR1Ce87cqwoue","currency":"eur","description":"OpenCollective application fee","type":"application_fee"}],"net":896,"source":"ch_1B5jA8D8MNtzsDcgtWcrtY08","sourced_transfers":{"object":"list","data":[],"has_more":false,"total_count":0,"url":"/v1/transfers?source_transaction=ch_1B5jA8D8MNtzsDcgtWcrtY08"},"status":"pending","type":"charge"}, [ 'Server',
   'X-Stripe-Privileged-Session-Required,stripe-manage-version,X-Stripe-External-Auth-Required',
  'Request-Id',
  'req_85GwcSCSUUO00s',
  'Stripe-Version',
  '2015-04-07']);

nock('https://api.stripe.com:443', {"encodedQueryParams":true})
  .get('/v1/plans/EUR-MONTH-1000')
  .reply(200, {"id":"EUR-MONTH-1000","object":"plan","amount":1000,"created":1503518941,"currency":"eur","interval":"month","interval_count":1,"livemode":false,"metadata":{},"name":"EUR-MONTH-1000","statement_descriptor":null,"trial_period_days":null}, [ 'Server',
   'X-Stripe-Privileged-Session-Required,stripe-manage-version,X-Stripe-External-Auth-Required',
  'Request-Id',
  'req_Z3q5oj1Gcd8Nay',
  'Stripe-Version',
  '2015-04-07']);

nock('https://api.stripe.com:443', {"encodedQueryParams":true})
  .post('/v1/customers/cus_BSeTa7dWu6rNSG/subscriptions', /plan=EUR-MONTH-1000&application_fee_percent=5&trial_end=[0-9]{10}&metadata%5Bfrom%5D=http%3A%2F%2Flocalhost%3A3000%2Fnewco&metadata%5Bto%5D=http%3A%2F%2Flocalhost%3A3000%2Fbrusselstogether&metadata%5BPaymentMethodId%5D=4157/)
  .reply(200, {"id":"sub_BSeT841QpU6Row","object":"subscription","application_fee_percent":5,"cancel_at_period_end":false,"canceled_at":null,"created":1506294326,"current_period_end":1506899120,"current_period_start":1506294326,"customer":"cus_BSeTa7dWu6rNSG","discount":null,"ended_at":null,"items":{"object":"list","data":[{"id":"si_1B5jAAD8MNtzsDcgetnoi1ws","object":"subscription_item","created":1506294327,"metadata":{},"plan":{"id":"EUR-MONTH-1000","object":"plan","amount":1000,"created":1503518941,"currency":"eur","interval":"month","interval_count":1,"livemode":false,"metadata":{},"name":"EUR-MONTH-1000","statement_descriptor":null,"trial_period_days":null},"quantity":1}],"has_more":false,"total_count":1,"url":"/v1/subscription_items?subscription=sub_BSeT841QpU6Row"},"livemode":false,"metadata":{"from":"http://localhost:3000/newco","to":"http://localhost:3000/brusselstogether","PaymentMethodId":"4157"},"plan":{"id":"EUR-MONTH-1000","object":"plan","amount":1000,"created":1503518941,"currency":"eur","interval":"month","interval_count":1,"livemode":false,"metadata":{},"name":"EUR-MONTH-1000","statement_descriptor":null,"trial_period_days":null},"quantity":1,"start":1506294326,"status":"trialing","tax_percent":null,"trial_end":1506899120,"trial_start":1506294326}, [ 'Server',
   'X-Stripe-Privileged-Session-Required,stripe-manage-version,X-Stripe-External-Auth-Required',
  'Request-Id',
  'req_XQjP2UPPBg4423',
  'Stripe-Version',
  '2015-04-07']);

nock('https://api.stripe.com:443', {"encodedQueryParams":true})
  .post('/v1/tokens', "card%5Bnumber%5D=4242424242424242&card%5Bexp_month%5D=12&card%5Bexp_year%5D=2028&card%5Bcvc%5D=222")
  .reply(200, {"id":"tok_1B5jAIDjPFcHOcTmlsbjEeuH","object":"token","card":{"id":"card_1B5jAIDjPFcHOcTm1JQO1482","object":"card","address_city":null,"address_country":null,"address_line1":null,"address_line1_check":null,"address_line2":null,"address_state":null,"address_zip":null,"address_zip_check":null,"brand":"Visa","country":"US","cvc_check":"unchecked","dynamic_last4":null,"exp_month":12,"exp_year":2028,"fingerprint":"ftgJeBXvQSZ4HMCg","funding":"credit","last4":"4242","metadata":{},"name":null,"tokenization_method":null},"client_ip":"68.173.154.69","created":1506294334,"livemode":false,"type":"card","used":false}, [ 'Server',
   'X-Stripe-Privileged-Session-Required,stripe-manage-version,X-Stripe-External-Auth-Required',
  'Request-Id',
  'req_K1I2nVAzvUUccP']);

nock('http://api.fixer.io:80', {"encodedQueryParams":true})
  .get('/latest')
  .query({"base":"EUR","symbols":"USD"})
  .reply(200, {"base":"EUR","date":"2017-09-22","rates":{"USD":1.1961}}, [ 'Server',
 'nosniff' ]);

nock('https://api.stripe.com:443', {"encodedQueryParams":true})
  .post('/v1/customers', "source=tok_1B5jAIDjPFcHOcTmlsbjEeuH&description=https%3A%2F%2Fopencollective.com%2Fnewco&email=fd81e8b367fee82f45af1816e5ec9147%40gmail.com")
  .reply(200, {"id":"cus_BSeTgr9sETRdnb","object":"customer","account_balance":0,"created":1506294337,"currency":null,"default_source":"card_1B5jAIDjPFcHOcTm1JQO1482","delinquent":false,"description":"https://opencollective.com/newco","discount":null,"email":"fd81e8b367fee82f45af1816e5ec9147@gmail.com","livemode":false,"metadata":{},"shipping":null,"sources":{"object":"list","data":[{"id":"card_1B5jAIDjPFcHOcTm1JQO1482","object":"card","address_city":null,"address_country":null,"address_line1":null,"address_line1_check":null,"address_line2":null,"address_state":null,"address_zip":null,"address_zip_check":null,"brand":"Visa","country":"US","customer":"cus_BSeTgr9sETRdnb","cvc_check":"pass","dynamic_last4":null,"exp_month":12,"exp_year":2028,"fingerprint":"ftgJeBXvQSZ4HMCg","funding":"credit","last4":"4242","metadata":{},"name":null,"tokenization_method":null}],"has_more":false,"total_count":1,"url":"/v1/customers/cus_BSeTgr9sETRdnb/sources"},"subscriptions":{"object":"list","data":[],"has_more":false,"total_count":0,"url":"/v1/customers/cus_BSeTgr9sETRdnb/subscriptions"}}, [ 'Server',
   'X-Stripe-Privileged-Session-Required,stripe-manage-version,X-Stripe-External-Auth-Required',
  'Request-Id',
  'req_GjzWIJOFJpORhk']);

nock('https://api.stripe.com:443', {"encodedQueryParams":true})
  .post('/v1/tokens', "customer=cus_BSeTgr9sETRdnb")
  .reply(200, {"id":"tok_1B5jAMD8MNtzsDcgBhMsA7ev","object":"token","card":{"id":"card_1B5jALD8MNtzsDcgcOdky9H3","object":"card","address_city":null,"address_country":null,"address_line1":null,"address_line1_check":null,"address_line2":null,"address_state":null,"address_zip":null,"address_zip_check":null,"brand":"Visa","country":"US","cvc_check":"pass","dynamic_last4":null,"exp_month":12,"exp_year":2028,"fingerprint":"nt4eriIIhN3fiPZF","funding":"credit","last4":"4242","metadata":{},"name":null,"tokenization_method":null},"client_ip":"68.173.154.69","created":1506294338,"livemode":false,"type":"card","used":false}, [ 'Server',
   'X-Stripe-Privileged-Session-Required,stripe-manage-version,X-Stripe-External-Auth-Required',
  'Request-Id',
  'req_gIaFg7WliloFl0',
  'Stripe-Version',
  '2015-04-07']);

nock('https://api.stripe.com:443', {"encodedQueryParams":true})
  .post('/v1/customers', "source=tok_1B5jAMD8MNtzsDcgBhMsA7ev&description=https%3A%2F%2Fopencollective.com%2Fnewco&email=fd81e8b367fee82f45af1816e5ec9147%40gmail.com")
  .reply(200, {"id":"cus_BSeTxl6ekrtTlE","object":"customer","account_balance":0,"created":1506294338,"currency":null,"default_source":"card_1B5jALD8MNtzsDcgcOdky9H3","delinquent":false,"description":"https://opencollective.com/newco","discount":null,"email":"fd81e8b367fee82f45af1816e5ec9147@gmail.com","livemode":false,"metadata":{},"shipping":null,"sources":{"object":"list","data":[{"id":"card_1B5jALD8MNtzsDcgcOdky9H3","object":"card","address_city":null,"address_country":null,"address_line1":null,"address_line1_check":null,"address_line2":null,"address_state":null,"address_zip":null,"address_zip_check":null,"brand":"Visa","country":"US","customer":"cus_BSeTxl6ekrtTlE","cvc_check":"pass","dynamic_last4":null,"exp_month":12,"exp_year":2028,"fingerprint":"nt4eriIIhN3fiPZF","funding":"credit","last4":"4242","metadata":{},"name":null,"tokenization_method":null}],"has_more":false,"total_count":1,"url":"/v1/customers/cus_BSeTxl6ekrtTlE/sources"},"subscriptions":{"object":"list","data":[],"has_more":false,"total_count":0,"url":"/v1/customers/cus_BSeTxl6ekrtTlE/subscriptions"}}, [ 'Server',
   'X-Stripe-Privileged-Session-Required,stripe-manage-version,X-Stripe-External-Auth-Required',
  'Request-Id',
  'req_plSrzerbWWDl4c',
  'Stripe-Version',
  '2015-04-07']);

nock('https://api.stripe.com:443', {"encodedQueryParams":true})
  .post('/v1/charges', "amount=20000&currency=EUR&customer=cus_BSeTxl6ekrtTlE&description=Monthly%20donation%20to%20BrusselsTogether%20(donor)&application_fee=1000&metadata%5Bfrom%5D=http%3A%2F%2Flocalhost%3A3000%2Fnewco&metadata%5Bto%5D=http%3A%2F%2Flocalhost%3A3000%2Fbrusselstogether&metadata%5BcustomerEmail%5D=fd81e8b367fee82f45af1816e5ec9147%40gmail.com&metadata%5BPaymentMethodId%5D=4157")
  .reply(200, {"id":"ch_1B5jAND8MNtzsDcgvfiuNJMr","object":"charge","amount":20000,"amount_refunded":0,"application":"ca_68FQcZXEcV66Kjg7egLnR1Ce87cqwoue","application_fee":"fee_1B5jAND8MNtzsDcg14nMdbfU","balance_transaction":"txn_1B5jAND8MNtzsDcgvypyLu1e","captured":true,"created":1506294339,"currency":"eur","customer":"cus_BSeTxl6ekrtTlE","description":"Monthly donation to BrusselsTogether (donor)","destination":null,"dispute":null,"failure_code":null,"failure_message":null,"fraud_details":{},"invoice":null,"livemode":false,"metadata":{"from":"http://localhost:3000/newco","to":"http://localhost:3000/brusselstogether","customerEmail":"fd81e8b367fee82f45af1816e5ec9147@gmail.com","PaymentMethodId":"4157"},"on_behalf_of":null,"order":null,"outcome":{"network_status":"approved_by_network","reason":null,"risk_level":"normal","seller_message":"Payment complete.","type":"authorized"},"paid":true,"receipt_email":null,"receipt_number":null,"refunded":false,"refunds":{"object":"list","data":[],"has_more":false,"total_count":0,"url":"/v1/charges/ch_1B5jAND8MNtzsDcgvfiuNJMr/refunds"},"review":null,"shipping":null,"source":{"id":"card_1B5jALD8MNtzsDcgcOdky9H3","object":"card","address_city":null,"address_country":null,"address_line1":null,"address_line1_check":null,"address_line2":null,"address_state":null,"address_zip":null,"address_zip_check":null,"brand":"Visa","country":"US","customer":"cus_BSeTxl6ekrtTlE","cvc_check":"pass","dynamic_last4":null,"exp_month":12,"exp_year":2028,"fingerprint":"nt4eriIIhN3fiPZF","funding":"credit","last4":"4242","metadata":{},"name":null,"tokenization_method":null},"source_transfer":null,"statement_descriptor":null,"status":"succeeded","transfer_group":null}, [ 'Server',
   'X-Stripe-Privileged-Session-Required,stripe-manage-version,X-Stripe-External-Auth-Required',
  'Request-Id',
  'req_P0ZrIkJxuox8IT',
  'Stripe-Version',
  '2015-04-07']);

nock('https://api.stripe.com:443', {"encodedQueryParams":true})
  .get('/v1/balance/history/txn_1B5jAND8MNtzsDcgvypyLu1e')
  .reply(200, {"id":"txn_1B5jAND8MNtzsDcgvypyLu1e","object":"balance_transaction","amount":20000,"available_on":1506816000,"created":1506294339,"currency":"eur","description":"Monthly donation to BrusselsTogether (donor)","fee":1605,"fee_details":[{"amount":1000,"application":"ca_68FQcZXEcV66Kjg7egLnR1Ce87cqwoue","currency":"eur","description":"OpenCollective application fee","type":"application_fee"},{"amount":605,"application":null,"currency":"eur","description":"Stripe processing fees","type":"stripe_fee"}],"net":18395,"source":"ch_1B5jAND8MNtzsDcgvfiuNJMr","sourced_transfers":{"object":"list","data":[],"has_more":false,"total_count":0,"url":"/v1/transfers?source_transaction=ch_1B5jAND8MNtzsDcgvfiuNJMr"},"status":"pending","type":"charge"}, [ 'Server',
   'X-Stripe-Privileged-Session-Required,stripe-manage-version,X-Stripe-External-Auth-Required',
  'Request-Id',
  'req_4GYyF32x3QFOuG',
  'Stripe-Version',
  '2015-04-07']);

nock('https://api.stripe.com:443', {"encodedQueryParams":true})
  .get('/v1/plans/EUR-MONTH-20000')
  .reply(200, {"id":"EUR-MONTH-20000","object":"plan","amount":20000,"created":1504282114,"currency":"eur","interval":"month","interval_count":1,"livemode":false,"metadata":{},"name":"EUR-MONTH-20000","statement_descriptor":null,"trial_period_days":null}, [ 'Server',
   'X-Stripe-Privileged-Session-Required,stripe-manage-version,X-Stripe-External-Auth-Required',
  'Request-Id',
  'req_gGWxZvoJaB0mPu',
  'Stripe-Version',
  '2015-04-07']);

nock('https://api.stripe.com:443', {"encodedQueryParams":true})
  .post('/v1/customers/cus_BSeTxl6ekrtTlE/subscriptions', /plan=EUR-MONTH-20000&application_fee_percent=5&trial_end=[0-9]{10}&metadata%5Bfrom%5D=http%3A%2F%2Flocalhost%3A3000%2Fnewco&metadata%5Bto%5D=http%3A%2F%2Flocalhost%3A3000%2Fbrusselstogether&metadata%5BPaymentMethodId%5D=4157/)
  .reply(200, {"id":"sub_BSeT7o3apk1bwX","object":"subscription","application_fee_percent":5,"cancel_at_period_end":false,"canceled_at":null,"created":1506294341,"current_period_end":1506899135,"current_period_start":1506294341,"customer":"cus_BSeTxl6ekrtTlE","discount":null,"ended_at":null,"items":{"object":"list","data":[{"id":"si_1B5jAPD8MNtzsDcgDIi225L1","object":"subscription_item","created":1506294342,"metadata":{},"plan":{"id":"EUR-MONTH-20000","object":"plan","amount":20000,"created":1504282114,"currency":"eur","interval":"month","interval_count":1,"livemode":false,"metadata":{},"name":"EUR-MONTH-20000","statement_descriptor":null,"trial_period_days":null},"quantity":1}],"has_more":false,"total_count":1,"url":"/v1/subscription_items?subscription=sub_BSeT7o3apk1bwX"},"livemode":false,"metadata":{"from":"http://localhost:3000/newco","to":"http://localhost:3000/brusselstogether","PaymentMethodId":"4157"},"plan":{"id":"EUR-MONTH-20000","object":"plan","amount":20000,"created":1504282114,"currency":"eur","interval":"month","interval_count":1,"livemode":false,"metadata":{},"name":"EUR-MONTH-20000","statement_descriptor":null,"trial_period_days":null},"quantity":1,"start":1506294341,"status":"trialing","tax_percent":null,"trial_end":1506899135,"trial_start":1506294341}, [ 'Server',
   'X-Stripe-Privileged-Session-Required,stripe-manage-version,X-Stripe-External-Auth-Required',
  'Request-Id',
  'req_E9kGRDNSlSUk4F',
  'Stripe-Version',
  '2015-04-07']);

nock('http://api.fixer.io:80')
  .get(/20[0-9]{2}\-[0-9]{2}\-[0-9]{2}/)
  .query({"base":"EUR","symbols":"USD"})
  .reply(200, {"base":"EUR","date":"2017-09-01","rates":{"USD":1.192}});

nock('http://api.fixer.io:80')
  .get('/latest')
  .times(2)
  .query({"base":"EUR","symbols":"USD"})
  .reply(200, {"base":"EUR","date":"2017-09-01","rates":{"USD":1.192}});

}