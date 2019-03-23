const baseUrl = 'http://localhost:3000'

getDeposit = async (coin) => {
  const result = await fetch(`${baseUrl}/deposit?coin=${coin}`);
  const data    = await result.json();

  console.log('getDeposit', data);
  const deposit = document.getElementById('deposit');
  deposit.innerHTML = ` ${data.address}`;
};

getBalance = async (currency) => {
  const result = await fetch(`${baseUrl}/get-balance-currency?currency=${currency}`);
  const data = await result.json();

  console.log('getBalance', data);
  const freeze =  data.result[currency].freeze;
  const available = data.result[currency].available;
  const balance = document.getElementById('balance');
  balance.innerHTML = `Доступный: ${available}` + ` Замороженный: ${freeze}`
};

createOrder = async (type) => {
  const req = type === 'sell' ? 'new-order-sell' : 'new-order';
  const result = await fetch(`${baseUrl}/${req}`);
  const data = await result.json();

  console.log('createOrder', data)
};

