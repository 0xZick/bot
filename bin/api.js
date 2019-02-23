const request = require('request');
const crypto = require('crypto');

const apiKey = '1c5ac9cd1a96fa3aa1a6025f33e601ab';
const apiSecret = '47afe7d75150b5cd5bd4b1790e0170c9';

const baseUrl = 'https://p2pb2b.io';


const postRequest = (url, params) => {
  const data = {
    ...params,
    request: url,
    nonce: Date.now(),
  };

  const stringData = JSON.stringify(data);

  const completeURL = `${baseUrl}${url}`;
  const payload = new Buffer(stringData)
    .toString('base64');

  const signature = crypto
    .createHmac('sha512', apiSecret)
    .update(payload)
    .digest('hex');

  const options = {
    url: completeURL,
    headers: {
      'Content-Type': 'application/json',
      'X-TXC-APIKEY': apiKey,
      'X-TXC-PAYLOAD': payload,
      'X-TXC-SIGNATURE': signature
    },
    body: stringData,
  };

  return new Promise((resolve) => request.post(
    options, (error, response, body) => resolve(body)
  ))
};

const getRequest = (url, params) => {
  const path = params ? `${url}${getString(params)}` : url;

  console.log('path', `${baseUrl}${path}`);

  const options = {
    url: `${baseUrl}${path}`,
    headers: {
      'User-Agent': 'request',
    },
  };

  return new Promise((resolve) => request.get(
    options, (error, response, body) => resolve(body)
  ));
};

const getString = (params) => {
  const req = Object.keys(params).map((key, index) => {
    if (index === 0) {
      return `?${key}=${params[key]}`
    }
    return `&${key}=${params[key]}`
  });

  return req.join('');
};


module.exports = {
  postRequest,
  getRequest,
};
