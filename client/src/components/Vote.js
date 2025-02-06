import React, { useEffect, useState } from 'react';
import Web3 from 'web3';  // Import Web3
import Voting from './VotingContract';  // Assuming you have this file with contract ABI and address

const VotingApp = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // Initializing Web3 and requesting account access
  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
      window.ethereum.request({ method: "eth_requestAccounts" }).then(setAccounts);
    } else {
      alert("Please install MetaMask!");
    }
  }, []);

  // Loading the contract and candidates
  useEffect(() => {
    if (web3) {
      const loadContract = async () => {
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = Voting.networks[networkId];
        const instance = new web3.eth.Contract(Voting.abi, deployedNetwork && deployedNetwork.address);
        setContract(instance);

        // Load candidates count
        const count = await instance.methods.candidatesCount().call();
        console.log("Number of candidates:", count); // Debugging line

        const candidatesList = [];
        for (let i = 1; i <= count; i++) {
          const candidate = await instance.methods.candidates(i).call();
          console.log("Candidate", i, ":", candidate); // Debugging line

          if (candidate && candidate[1]) { // Checking if candidate is valid
            candidatesList.push({
              id: candidate[0],
              name: candidate[1],
              votes: candidate[2].toString() // Convert BigNumber to string
            });
          } else {
            console.error(`Candidate at index ${i} is undefined or has no name`);
          }
        }
        setCandidates(candidatesList);
      };

      loadContract();
    }
  }, [web3]);

  // Voting for a candidate
  const vote = async () => {
    if (contract && selectedCandidate !== null) {
      try {
        await contract.methods.vote(selectedCandidate).send({ from: accounts[0] });
        alert("Voted successfully!");
        // Reload candidates to see updated vote counts
        const count = await contract.methods.candidatesCount().call();
        const updatedCandidates = [];
        for (let i = 1; i <= count; i++) {
          const candidate = await contract.methods.candidates(i).call();
          updatedCandidates.push({
            id: candidate[0],
            name: candidate[1],
            votes: candidate[2].toString() // Convert BigNumber to string
          });
        }
        setCandidates(updatedCandidates);
      } catch (error) {
        alert("Error voting: " + error.message);
      }
    }
  };

  return (
    <div>
      <h1>Vote for Your Candidate</h1>
      <p>Connected Account: {accounts[0]}</p>

      <h3>Candidates:</h3>
      <ul>
        {candidates.length > 0 ? (
          candidates.map((candidate, index) => (
            <li key={index}>
              <button onClick={() => setSelectedCandidate(candidate.id)}>
                {candidate.name} - Votes: {candidate.votes}
              </button>
            </li>
          ))
        ) : (
          <li>No candidates available.</li>
        )}
      </ul>

      <button onClick={vote} disabled={selectedCandidate === null}>
        Vote
      </button>
    </div>
  );
};

export default VotingApp;
