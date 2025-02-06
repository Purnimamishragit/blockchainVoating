// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Voting {
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    mapping(uint => Candidate) public candidates;
    mapping(address => bool) public hasVoted;
    uint public candidatesCount;
    address public immutable owner;

    event VotedEvent(uint indexed candidateId, address indexed voter);
    event CandidateAdded(uint indexed candidateId, string name);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can execute this");
        _;
    }

    constructor() {
        owner = msg.sender;
        // Add initial candidates on contract deployment
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
    }

    function addCandidate(string memory _name) public onlyOwner {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }



    function vote(uint _candidateId) public {
        // Ensure the sender has not voted yet
        require(!hasVoted[msg.sender], "You have already voted");
        
        // Ensure the candidate ID is valid
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID");

        // Mark the sender as having voted
        hasVoted[msg.sender] = true;

        // Increment the vote count for the candidate
        candidates[_candidateId].voteCount++;

        // Emit the vote event
        emit VotedEvent(_candidateId, msg.sender);
    }

    function getCandidate(uint _id) public view returns (Candidate memory) {
        // Ensure the candidate ID is valid
        require(_id > 0 && _id <= candidatesCount, "Invalid candidate ID");
        
        // Return the candidate details
        return candidates[_id];
    }

    function getCandidatesCount() public view returns (uint) {
        return candidatesCount;
    }
}
