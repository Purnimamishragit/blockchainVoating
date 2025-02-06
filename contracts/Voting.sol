// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Voting {
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    address public owner;
    mapping(uint => Candidate) public candidates;
    mapping(address => bool) public voters;
    uint public candidatesCount;
    bool public electionEnded;

    event CandidateAdded(uint indexed candidateId, string name);
    event Voted(address indexed voter, uint indexed candidateId);
    event ElectionEnded();

    constructor() {
        owner = msg.sender;
        electionEnded = false;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    modifier electionActive() {
        require(!electionEnded, "Election has ended");
        _;
    }

    function addCandidate(string memory _name) public onlyOwner {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
        emit CandidateAdded(candidatesCount, _name);
    }

    function vote(uint _candidateId) public electionActive {
        require(!voters[msg.sender], "You have already voted");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID");

        voters[msg.sender] = true;
        candidates[_candidateId].voteCount++;

        emit Voted(msg.sender, _candidateId);
    }

    function endElection() public onlyOwner electionActive {
        electionEnded = true;
        emit ElectionEnded();
    }

    function getCandidate(uint _id) public view returns (uint, string memory, uint) {
        require(_id > 0 && _id <= candidatesCount, "Invalid candidate ID");
        Candidate memory c = candidates[_id];
        return (c.id, c.name, c.voteCount);
    }
}
