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

const parsedMarket = (market) => {
  return market
    .filter(item => item.stock === 'EDR')
    .map(item => {
      const img   = `/assets/${item.stock.toLowerCase()}.png`;
      const base  = `${item.stock}`; // change edr to base
      const quote = `EDR.${item.money}`;
      const id    = `${quote}_${base}`;

      return { id, img, base, quote, featured: true, restricted: false }
  });
};

const parsedPairs = () => [
  {
    "inputCoinType": "btc",
    "outputCoinType": "edr.btc",
    "restricted": false
  },
  {
    "inputCoinType": "edr.btc",
    "outputCoinType": "btc",
    "restricted": false
  },

  {
    "inputCoinType": "eth",
    "outputCoinType": "edr.eth",
    "restricted": false
  },
  {
    "inputCoinType": "edr.eth",
    "outputCoinType": "eth",
    "restricted": false
  },

  {
    "inputCoinType": "edr",
    "outputCoinType": "edr.edr",
    "restricted": false
  },
  {
    "inputCoinType": "edr.edr",
    "outputCoinType": "edr",
    "restricted": false
  },
];

const getFakeRequest = () => {
  return new Promise((resolve) => resolve(JSON.stringify({ status: '200' })));
};

const parsedCoins = () => [
  {
    "coinType": "btc",
    "walletName": "BTC",
    "name": "BTC",
    "symbol": "BTC",
    "walletSymbol": "BTC",
    "walletType": "btc",
    "transactionFee": "0",
    "precision": "100000000.00000000000000000000",
    "supportsOutputMemos": false,
    "restricted": false,
    "authorized": null,
    "notAuthorizedReasons": null,
    "backingCoinType": "btc",
    "gateFee": "0.000900",
    "coinPriora": 0,
    "is_return_active": true,
    "allow_deposit": true,
    "allow_withdrawal": true,
    "maintenanceReason": "",
    "withdrawalLimit24h": "-1.0"
  },
  {
    "coinType": "edr",
    "walletName": "BitShares 2.0",
    "name": "EDR",
    "symbol": "EDR",
    "walletSymbol": "EDR",
    "walletType": "bitshares2",
    "transactionFee": "0",
    "precision": "1000000.00000000000000000000",
    "supportsOutputMemos": true,
    "restricted": false,
    "authorized": null,
    "notAuthorizedReasons": null,
    "backingCoinType": "edr",
    "gateFee": "0.000000",
    "coinPriora": 0,
    "is_return_active": false,
    "allow_deposit": false,
    "allow_withdrawal": false,
    "maintenanceReason": "Under maintenance",
    "withdrawalLimit24h": "-1"
  },
  {
    "coinType": "eth",
    "walletName": "Ethereum currency",
    "name": "ETH",
    "symbol": "ETH",
    "walletSymbol": "ETH",
    "walletType": "eth",
    "transactionFee": "0",
    "precision": "1000000000000000000.00000000000000000000",
    "supportsOutputMemos": false,
    "restricted": false,
    "authorized": null,
    "notAuthorizedReasons": null,
    "backingCoinType": "eth",
    "gateFee": "0.005500",
    "coinPriora": 0,
    "is_return_active": true,
    "allow_deposit": true,
    "allow_withdrawal": true,
    "maintenanceReason": "",
    "withdrawalLimit24h": "-1"
  },

  {
    "coinType": "edr.eth",
    "walletName": "BitShares 2.0",
    "name": "EDR ETH",
    "symbol": "EDR.ETH",
    "walletSymbol": "EDR.ETH",
    "walletType": "bitshares2",
    "transactionFee": "0",
    "precision": "1000000.00000000000000000000",
    "supportsOutputMemos": true,
    "restricted": false,
    "authorized": null,
    "notAuthorizedReasons": null,
    "backingCoinType": "eth",
    "gateFee": "0.000000",
    "coinPriora": 0,
    "is_return_active": false,
    "allow_deposit": false,
    "allow_withdrawal": false,
    "maintenanceReason": "Under maintenance",
    "withdrawalLimit24h": "-1"
  },

  {
    "coinType": "edr.btc",
    "walletName": "BitShares 2.0",
    "name": "EDR BTC",
    "symbol": "EDR.BTC",
    "walletSymbol": "EDR.BTC",
    "walletType": "bitshares2",
    "transactionFee": "0",
    "precision": "100000000.00000000000000000000",
    "supportsOutputMemos": true,
    "restricted": false,
    "authorized": null,
    "notAuthorizedReasons": null,
    "backingCoinType": "btc",
    "gateFee": "0.000000",
    "coinPriora": 0,
    "is_return_active": false,
    "allow_deposit": false,
    "allow_withdrawal": false,
    "maintenanceReason": "Under maintenance",
    "withdrawalLimit24h": "-1.0"
  },

  {
    "coinType": "edr.edr",
    "walletName": "BitShares 2.0",
    "name": "EDR.EDR",
    "symbol": "EDR.EDR",
    "walletSymbol": "EDR.EDR",
    "walletType": "bitshares2",
    "transactionFee": "0",
    "precision": "1000000.00000000000000000000",
    "supportsOutputMemos": true,
    "restricted": false,
    "authorized": null,
    "notAuthorizedReasons": null,
    "backingCoinType": "edr",
    "gateFee": "0.000000",
    "coinPriora": 0,
    "is_return_active": false,
    "allow_deposit": false,
    "allow_withdrawal": false,
    "maintenanceReason": "Under maintenance",
    "withdrawalLimit24h": "-1"
  },
];

const parsedWallet = () => [ "bitshares2", "eth", "btc" ];

const getDepositAddress = (coin) => {
  return new Promise((resolve) => {
    switch(coin.toUpperCase()) {
      case 'ETH':
        return resolve(JSON.stringify({ address: '' }));

      case 'BTC':
        return resolve(JSON.stringify({ address: '' }));

      case 'EDR':
        return resolve(JSON.stringify({ address: '' }));
    }
  });
};

module.exports = {
  getDepositAddress,
  getFakeRequest,
  parsedPairs,
  parsedMarket,
  parsedWallet,
  parsedCoins,
  postRequest,
  getRequest,
};
