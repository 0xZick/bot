const { Apis } = require('bitsharesjs-ws')
const {
  ChainStore,
  FetchChain,
  PrivateKey,
  TransactionHelper,
  Aes,
  TransactionBuilder
} = require('bitsharesjs')

const privateKey = '5KBuq5WmHvgePmB7w3onYsqLM8ESomM2Ae7SigYuuwg8MDHW7NN'
let keyPair = PrivateKey.fromWif(privateKey);


const init = () => {
  return new Promise(resolve => {
    return Apis.instance("wss://node.testnet.bitshares.eu", true)
    .init_promise.then(() => {
 
      ChainStore.init().then(() => {
        
        let fromAccount = "bitsharesjs";
        let memoSender = fromAccount;
        let memo = "Testing transfer from node.js";
        
        let toAccount = "faucet";
        
        let sendAmount = {
          amount: 10000,
          asset: "TEST"
        }
        
        Promise.all([
          FetchChain("getAccount", fromAccount),
          FetchChain("getAccount", toAccount),
          FetchChain("getAccount", memoSender),
          FetchChain("getAsset", sendAmount.asset),
          FetchChain("getAsset", sendAmount.asset)
        ]).then((res)=> {
          let [fromAccount, toAccount, memoSender, sendAsset, feeAsset] = res;
          
          // Memos are optional, but if you have one you need to encrypt it here
          let memoFromKey = memoSender.getIn(["options","memo_key"]);
          let memoToKey = toAccount.getIn(["options","memo_key"]);
          let nonce = TransactionHelper.unique_nonce_uint64();
          
          let memo_object = {
            from: memoFromKey,
            to: memoToKey,
            nonce,
            message: Aes.encrypt_with_checksum(
              pKey,
              memoToKey,
              nonce,
              memo
            )
          }
          
          let tr = new TransactionBuilder()
          
          tr.add_type_operation( "transfer", {
            fee: {
              amount: 0,
              asset_id: feeAsset.get("id")
            },
            from: fromAccount.get("id"),
            to: toAccount.get("id"),
            amount: { amount: sendAmount.amount, asset_id: sendAsset.get("id") },
            memo: memo_object
          } )
          
          tr.set_required_fees().then(() => {
            tr.add_signer(pKey, pKey.toPublicKey().toPublicKeyString());
            console.log("serialized transaction:", tr.serialize());
            tr.broadcast();
          })
        });
      });
    });
  })
}

module.exports = {
  init,
}
