import { ethers } from "./ethers-v5.7.js";
import { contractaddress, abi } from "./constants.js";
const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const getBalanceButton = document.getElementById("getBalance");
const withdrawButton = document.getElementById("withdraw");
withdrawButton.onclick = withdraw;
connectButton.onclick = connect;
fundButton.onclick = fund;
getBalanceButton.onclick = getBalance;
async function connect() {
  if (typeof window.ethereum != "undefined") {
    window.ethereum.request({ method: "eth_requestAccounts" });
    connectButton.innerHTML = "已连接";
  } else {
    connectButton.innerHTML = "未连接";
  }
}

async function fund() {
  const ethAmount = document.getElementById("ehtamont").value;
  if (typeof window.ethereum != "undefined") {
    //provider,   wallet
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const singer = provider.getSigner();
    const contarct = new ethers.Contract(contractaddress, abi, singer);
    try {
      const transactionResponse = await contarct.fund({
        value: ethers.utils.parseEther(ethAmount),
      });
      await listenForTraction(transactionResponse, provider);
      console.log("done!");
    } catch (error) {
      console.log(error);
    }
  }
}
function listenForTraction(transactionResponse, provider) {
  console.log(`${transactionResponse.hash}`);
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `completed with ${transactionReceipt.confirmations} confirmations`
      );
      resolve();
    });
  });
}
async function getBalance() {
  if (typeof window.ethereum != "unfinded") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(contractaddress);
    console.log(ethers.utils.formatEther(balance));
  }
}
async function withdraw() {
  if (typeof window.ethereum != "undefinded") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const singer = provider.getSigner();
    const contract = new ethers.Contract(contractaddress, abi, singer);
    try {
      const withdrawResponse = await contract.withdraw();
      await listenForTraction(withdrawResponse, provider);
      console.log("withdraw sucessed");
    } catch (error) {
      console.log(error);
    }
  }
}
