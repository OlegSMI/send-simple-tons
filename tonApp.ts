import { getHttpEndpoint } from "@orbs-network/ton-access";
import { config } from "dotenv";
import { TonClient, WalletContractV4, fromNano } from "ton";
import { KeyPair, mnemonicToWalletKey } from "ton-crypto";

export interface ITonApp {
  key: KeyPair;
  wallet: WalletContractV4;
  endpoint: string;
  client: TonClient;
  checkDeployWallet: () => void;
  getBalance: () => void;
}

const tonApp = async (): Promise<ITonApp> => {
  const { key, wallet } = await getWallet();

  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient({ endpoint });

  const checkDeployWallet = async () => {
    if (!(await client.isContractDeployed(wallet.address))) {
      return console.log("wallet is not deployed");
    }
  };

  const getBalance = async () => {
    const balance = await client.getBalance(wallet.address);
    console.log("Balance:", fromNano(balance));
  };

  return {
    key,
    wallet,
    endpoint,
    client,
    checkDeployWallet,
    getBalance,
  };
};

const getWallet = async () => {
  config();

  const mnemonic = process.env.MNEMONIC || "";
  const key = await mnemonicToWalletKey(mnemonic.split(" "));

  const wallet = WalletContractV4.create({
    publicKey: key.publicKey,
    workchain: 0,
  });
  return { key, wallet };
};

export default tonApp;
