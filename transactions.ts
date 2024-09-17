import { internal, OpenedContract, WalletContractV4 } from "ton";
import { ITonApp } from "./tonApp";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const sendTon = async (
  app: ITonApp,
  address: string,
  amount: string,
  letter: string
) => {
  const { client, wallet, key } = app;

  const walletContract = client.open(wallet);
  const seqno = await walletContract.getSeqno();

  await walletContract.sendTransfer({
    secretKey: key.secretKey,
    seqno: seqno,
    messages: [
      internal({
        to: address,
        value: amount,
        body: letter,
        bounce: false,
      }),
    ],
  });

  await consoleSeqno(seqno, walletContract);
};

const consoleSeqno = async (
  seqno: number,
  walletContract: OpenedContract<WalletContractV4>
) => {
  let currentSeqno = seqno;

  while (currentSeqno == seqno) {
    console.log("waiting for transaction to confirm...");
    await sleep(1500);
    currentSeqno = await walletContract.getSeqno();
  }
  console.log("transaction confirmed!");
};

export default sendTon;
