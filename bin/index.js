const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

const {
  postRequest, getRequest, getFakeRequest, getDepositAddress,
  parsedMarket, parsedCoins, parsedWallet, parsedPairs
} = require('./api');

const {
  nodeLoger,
  transfer,
  generateKeyPair
} = require('./bts')


const route = (name, params, handler) => (req, res) => {
  const paramsValid = params.reduce((acc, param) => acc && req.query[param], true);

  if (!paramsValid) {
    return res.status(500).json({
      err: true,
      required: params,
      message: `not enough args: ${params} required, got ${req.query}`
    })
  }

  handler(req.query)
    .then((info) => {
      const response = JSON.parse(info);
      console.log('response', response);

      console.log('[SERVER] 200 Success', name);
      switch (name) {
        case 'markets':
          return res.json(parsedMarket(response.result));

        case 'deposit':
          return res.json(response);

        case 'pairs':
          return res.json(parsedPairs());

        case 'coins':
          return res.json(parsedCoins());

        case 'wallets':
          return res.json(parsedWallet());
          

        case 'switch':
          return res.json(response)
      }
      return res.json(response)
    })
    .catch(err => {
      console.error('[SERVER] 500 Error', err.message);
      res.status(500).json({ err: true, message: err.message })
    })
};

app.use(cors());

app.use(express.static('web'));

// bts node

app.get('/transfer', route('transfer', ['from', 'to', 'amount', 'asset'], (from, to, amount, asset) => {
  return transfer(from, to, amount, asset)
}));

app.get('/update', route('update', [], () => {
  return nodeLoger()
}));

app.get('/generate', route('generate-key', [], () => {
  return generateKeyPair()
}));

// private

app.get('/get-balance-currency', route('get-balance', ['currency'], ({ currency }) => {
  return postRequest('/api/v1/account/balance', { currency })
}));

app.get('/get-balances', route('get-balance', [], () => {
  return postRequest('/api/v1/account/balances')
}));

app.get('/new-order', route('new-order', [], () => {
  return postRequest('/api/v1/order/new', { market: 'EDR_ETH', side: 'buy', amount: '100', price: '0.00005784' })
}));

app.get('/new-order-sell', route('new-order', [], () => {
  return postRequest('/api/v1/order/new', { market: 'EDR_ETH', side: 'sell', amount: '1000', price: '0.00005784' })
}));

app.get('/cancel-order', route('cancel-order', [], () => {
  return postRequest('/api/v1/order/cancel', { market: 'EDT_ETH', orderId: '8947572,' })
}));

// "market": "ETH_BTC",
//   "side": "buy",
//   "amount": "0.001",
//   "price": "1000",

app.get('/un-executed-orders', route('un-executed-orders', ['market', 'offset', 'limit'], ({ market, offset, limit }) => {
  return postRequest('/api/v1/orders', { market, offset, limit })
}));

app.get('/order-history', route('order-history', ['offset', 'limit'], ({ offset, limit }) => {
  return postRequest('/api/v1/account/order_history', { offset, limit })
}));

app.get('/deals', route('deals', ['orderId', 'offset', 'limit'], ({ orderId, offset, limit }) => {
  return postRequest('/api/v1/account/order', { orderId, offset, limit })
}));

// public

app.get('/markets', route('markets', [], () => getRequest('/api/v1/public/markets')));

app.get('/wallets', route('wallets', [], () => getFakeRequest()));

app.get('/coins', route('coins', [], () => getFakeRequest()));

app.get('/pairs', route('pairs', [], () => getFakeRequest()));

app.get('/tickers', route('tickers', [], () => getRequest('/api/v1/public/tickers')));
// https://api.alterdice.com/api/default/ticker

app.get('/products', route('products', [], () => getRequest('/api/v1/public/products')));

app.get('/switch', route('switch', [], () => {
  return postRequest('/v2/profile/transfer', { amount: '100', transfer_method: 'deposit', ticker: 'EDR' })
}));

app.get('/deposit', route('deposit', ['coin'], ({ coin }) => getDepositAddress(coin)));
// https://api.alterdice.com/api/deposit/get-address {"iso":"BTC","new":0,"p":1,"request_id":"1551898011531996"}

app.get('/ticker', route('ticker', ['market'], ({ market }) => {
  return getRequest('/api/v1/public/ticker', { market })
}));

app.get('/book', route('book', ['market', 'side', 'offset', 'limit'], ({ market, side, offset, limit }) => {
  return getRequest('/api/v1/public/book', { market, side, offset, limit })
}));

app.get('/history', route('history', ['market', 'lastId', 'limit'], ({ market, lastId, limit }) => {
  return getRequest('/api/v1/public/history', { market, lastId, limit })
}));

app.get('/history-result', route('history-result', ['market', 'since', 'limit'], ({ market, since, limit }) => {
  return getRequest('/api/v1/public/history', { market, since, limit })
}));

app.get('/depth', route('depth', ['market', 'limit'], ({ market, limit }) => {
  return getRequest('/api/v1/public/depth/result', { market, limit })
}));

app.listen(port, () => console.log(`[SERVER] listening on port ${port}`));
