console.log("Script Working");

async function connect() {
  if (typeof window.ethereum != null) {
    console.log("I see MetaMask");
    await window.ethereum.request({ method: "eth_requestAccounts" });
    console.log("Opened Metamask");
  } else {
    document.getElementById("info").innerHTML = "Please Install a MetaMask";
    console.log("No MetaMask");
  }
}
