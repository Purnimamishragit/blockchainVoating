// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
// import React, { useState, useEffect } from "react";
// import Web3 from "web3";
// import Voting from "./contracts/Voting.json"; // ✅ Correct import

// function App() {
//   const [account, setAccount] = useState("");
//   const [contract, setContract] = useState(null);
//   const [candidates, setCandidates] = useState([]);
//   const [hasVoted, setHasVoted] = useState(false);

//   useEffect(() => {
//     async function loadBlockchainData() {
//       if (!window.ethereum) {
//         console.error("MetaMask not detected");
//         return;
//       }

//       const web3 = new Web3(window.ethereum);
//       await window.ethereum.request({ method: "eth_requestAccounts" });

//       const accounts = await web3.eth.getAccounts();
//       setAccount(accounts[0]);

//       const networkId = await web3.eth.net.getId();
//       const deployedNetwork = Voting.networks[networkId]; // ✅ Fixed reference

//       if (deployedNetwork) {
//         const contractInstance = new web3.eth.Contract(
//           Voting.abi,
//           deployedNetwork.address
//         );
//         setContract(contractInstance);

//         // Get candidates
//         const candidatesCount = await contractInstance.methods.candidatesCount().call();
//         let candidatesArray = [];
//         for (let i = 1; i <= candidatesCount; i++) {
//           const candidate = await contractInstance.methods.getCandidate(i).call();
//           candidatesArray.push({
//             id: candidate[0],
//             name: candidate[1],
//             voteCount: candidate[2],
//           });
//         }
//         setCandidates(candidatesArray);

//         // Check if the account has already voted
//         const voted = await contractInstance.methods.hasVoted(accounts[0]).call();
//         setHasVoted(voted);
//       } else {
//         console.error("Contract not deployed on the detected network.");
//       }
//     }

//     loadBlockchainData();
//   }, []);

//   const vote = async (candidateId) => {
//     if (!contract || hasVoted) return; // Don't allow voting if already voted

//     try {
//       await contract.methods.vote(candidateId).send({ from: account });
//       setHasVoted(true);

//       setCandidates((prevCandidates) =>
//         prevCandidates.map((candidate) =>
//           candidate.id === candidateId
//             ? { ...candidate, voteCount: parseInt(candidate.voteCount) + 1 }
//             : candidate
//         )
//       );
//     } catch (error) {
//       console.error("Voting error:", error);
//     }
//   };

//   return (
//     <div>
//       <h2>Blockchain Voting System</h2>
//       <p>Connected Account: {account}</p>
//       <h3>Candidates:</h3>
//       <ul>
//         {candidates.map((candidate) => (
//           <li key={candidate.id}>
//             {candidate.name} - Votes: {candidate.voteCount}
//             {!hasVoted && (
//               <button onClick={() => vote(candidate.id)}>Vote</button>
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default App;
import React, { useState, useEffect } from "react";
import Web3 from "web3";
import Voting from "./contracts/Voting.json"; // ✅ Correct import

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    async function loadBlockchainData() {
      if (!window.ethereum) {
        console.error("MetaMask not detected");
        return;
      }

      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Voting.networks[networkId]; // ✅ Fixed reference

      if (deployedNetwork) {
        const contractInstance = new web3.eth.Contract(
          Voting.abi,
          deployedNetwork.address
        );
        setContract(contractInstance);

        // Get candidates
        const candidatesCount = await contractInstance.methods.candidatesCount().call();
        let candidatesArray = [];
        for (let i = 1; i <= candidatesCount; i++) {
          const candidate = await contractInstance.methods.getCandidate(i).call();
          candidatesArray.push({
            id: candidate[0],
            name: candidate[1],
            voteCount: candidate[2],
          });
        }
        setCandidates(candidatesArray);

        // Check if the account has already voted
        const voted = await contractInstance.methods.hasVoted(accounts[0]).call();
        setHasVoted(voted);
      } else {
        console.error("Contract not deployed on the detected network.");
      }
    }

    loadBlockchainData();
  }, []);

  const vote = async (candidateId) => {
    if (!contract || hasVoted) return; // Don't allow voting if already voted

    try {
      await contract.methods.vote(candidateId).send({ from: account });
      setHasVoted(true);

      setCandidates((prevCandidates) =>
        prevCandidates.map((candidate) =>
          candidate.id === candidateId
            ? { ...candidate, voteCount: parseInt(candidate.voteCount) + 1 }
            : candidate
        )
      );
    } catch (error) {
      console.error("Voting error:", error);
    }
  };

  return (
    <div>
      <h2>Blockchain Voting System</h2>
      <p>Connected Account: {account}</p>
      <h3>Candidates:</h3>
      <ul>
        {candidates.map((candidate) => (
          <li key={candidate.id}>
            {candidate.name} - Votes: {candidate.voteCount}
            {!hasVoted && (
              <button onClick={() => vote(candidate.id)}>Vote</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
