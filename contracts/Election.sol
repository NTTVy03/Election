pragma solidity ^0.5.16;

contract Election {
    // Candidate model
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    // Vote event
    event votedEvent (
        uint indexed _candidateId
    );

    // list of candidates
    mapping(uint => Candidate) public candidates;

    // number of candidate (length of the candidates map)
    uint public candidatesCount;

    // list of voters
    mapping(address => bool) public voters;

    constructor() public {
        addCandidate("Truc Vy");
        addCandidate("Triet Huynh");
    }

    function addCandidate(string memory _name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    function vote(uint _candidateId) public {
        // each address only vote 1 time
        require(!voters[msg.sender]);

        // validate candidate id
        require(_candidateId > 0 && _candidateId <= candidatesCount);

        // mark that voter has voted
        voters[msg.sender] = true;

        // vote for candidate
        candidates[_candidateId].voteCount++;

        // trigger voted event
        emit votedEvent(_candidateId);
    }
}