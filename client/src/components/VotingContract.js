// src/components/VotingContract.js

import VotingJson from '../contracts/Voting.json'; // Correct path to Voting.json
//const contractAddress = '0xf362d544e4Fd43a1862d1E113C90C7919Cdf82B4';

const VotingContract = {
  abi: VotingJson.abi, // Accessing the ABI from the Voting.json file
  address: VotingJson.networks.address,
};

export default VotingContract;
