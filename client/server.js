const Web3 = require("web3");
const fs = require("fs");
require("dotenv").config();

const web3 = new Web3("http://127.0.0.1:7545"); // Ganache RPC URL
const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
const abi = JSON.parse(fs.readFileSync("VotingABI.json", "utf8")); // Get ABI from Remix or Truffle

const votingContract = new web3.eth.Contract(abi, contractAddress);

async function main() {
    const accounts = await web3.eth.getAccounts();
    console.log("Available Accounts:", accounts);

    // Adding candidates
    try {
        const tx = await votingContract.methods.addCandidate("Alice").send({ from: accounts[0] });
        console.log("Candidate Added:", tx.events.CandidateAdded.returnValues);
    } catch (err) {
        console.error("Error adding candidate:", err.message);
    }

    // Voting
    try {
        const tx = await votingContract.methods.vote(1).send({ from: accounts[1] });
        console.log("Vote cast:", tx.events.Voted.returnValues);
    } catch (err) {
        console.error("Voting Error:", err.message);
    }

    // Ending election
    try {
        const tx = await votingContract.methods.endElection().send({ from: accounts[0] });
        console.log("Election Ended.");
    } catch (err) {
        console.error("Election Ending Error:", err.message);
    }

    // Getting candidate data
    try {
        const result = await votingContract.methods.getCandidate(1).call();
        console.log("Candidate Info:", result);
    } catch (err) {
        console.error("Fetching Candidate Info Error:", err.message);
    }
}

main();
