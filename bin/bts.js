const { Apis } = require('bitsharesjs-ws')
const {
  ChainStore,
  FetchChain,
  PrivateKey,
  key,
  TransactionHelper,
  Aes,
  TransactionBuilder
} = require('bitsharesjs')

const random = require('random-words')



/**
 *
 * @param
 * @return keyPair <Promise>{object}
 */
const generateKeyPair = () => {
  const keyPair = PrivateKey.fromSeed(
    key.normalize_brainKey(
      random(12).join('')
    )
  )
  
  return new Promise((resolve) => resolve(
    JSON.stringify({
      publicKey: keyPair.toPublicKey().toString(),
      privateKey: keyPair.toWif()
    })
  ))
}


// TODO move to .env
const privateKey = '5KBuq5WmHvgePmB7w3onYsqLM8ESomM2Ae7SigYuuwg8MDHW7NN'
const keyPair = PrivateKey.fromWif(privateKey);


const transfer = (from, to, amount, asset) => {
  return new Promise(resolve => {
    return Apis.instance("wss://node.testnet.bitshares.eu", true)
    .init_promise.then(() => {
      
      ChainStore.init().then(() => {
        Promise.all([
          FetchChain("getAccount", from),
          FetchChain("getAccount", to),
          FetchChain("getAsset", asset),
          FetchChain("getAsset", asset)
        ]).then((res)=> {
          const [ fromAccount, toAccount, memoSender, sendAsset, feeAsset ] = res;
          console.log('ChainStore init', res)
          
          
          const tx = new TransactionBuilder()
  
          tx.add_type_operation( "transfer", {
            fee: {
              amount: 0,
              asset_id: feeAsset.get("id")
            },
            from: fromAccount.get("id"),
            to: toAccount.get("id"),
            amount: { amount, asset_id: sendAsset.get("id") },
          })
  
          tx.set_required_fees().then(() => {
            tx.add_signer(keyPair, keyPair.toPublicKey().toPublicKeyString());
            console.log("serialized transaction:", tx.serialize());
            tx.broadcast();
          })
        });
      });
    });
  })
}

const nodeLoger = () => {
  Apis.instance("wss://node.testnet.bitshares.eu", true).init_promise.then(res => {
    console.log("connected to:", res[0].network);
    ChainStore.init(false).then(() => {
      ChainStore.subscribe(log)
    });
  });
  
  function log(object) {
    console.log("ChainStore object update", ChainStore.getObject("2.1.0"));
  }
}

const accountHistory = (name) => new Promise(resolve =>
  Apis.instance("wss://node.bitshares.eu/", true)
    .init_promise.then((res) => {
      console.log("connected to:", res[0].network_name, "network")
      return Apis.instance().db_api().exec("subscribe_to_market", [(data) => console.log('data', data), '1.3.5245', '1.3.5246'])
    }).then((res) => {
    // 1.3.5245 EDR
    // '1.3.5247 ETH
    // 1.3.5246 BTC
      // how do I get transaction hash here?
      console.log(res)
      resolve(res)
    }).catch(error => {
      console.log('err', error)
    })
  )

module.exports = {
  nodeLoger,
  accountHistory,
  transfer,
  generateKeyPair,
}
