import tonApp, { ITonApp } from "./tonApp";
import sendTon from "./transactions";

main();

async function main() {
  const app: ITonApp = await tonApp();

  app.getBalance();
  await sendTon(
    app,
    "0QC0lgEGPeYPwujW0t1c5865DYdKVyWOQ5x95fMQmeRH6a4F",
    "0.05",
    "message"
  );
  app.getBalance();
}
