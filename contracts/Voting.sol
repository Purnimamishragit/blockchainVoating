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

    event VotedEvent(uint indexed candidateId, address voter);
    event CandidateAdded(uint indexed candidateId, string name);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can execute this");
        _;
    }

    constructor() {
        owner = msg.sender;
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
    }

    function addCandidate(string memory _name) public onlyOwner {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
        emit CandidateAdded(candidatesCount, _name);
    }

    function vote(uint _candidateId) public {
        require(!hasVoted[msg.sender], "You have already voted");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID");

        hasVoted[msg.sender] = true;
        candidates[_candidateId].voteCount++;

        emit VotedEvent(_candidateId, msg.sender);
    }

    function getCandidate(uint _id) public view returns (Candidate memory) {
        require(_id > 0 && _id <= candidatesCount, "Invalid candidate ID");
        return candidates[_id];
    }
}
