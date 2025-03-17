var Election = artifacts.require("./Election.sol");

contract("Election", function(accounts) {
  var electionInstance;

  // Define constants to avoid magic numbers
  const CANDIDATE_1_ID = 1;
  const CANDIDATE_2_ID = 2;
  const CANDIDATE_1_NAME = "Truc Vy";
  const CANDIDATE_2_NAME = "Triet Huynh";
  const INITIAL_VOTE_COUNT = 0;
  const FIRST_VOTER_ACCOUNT = accounts[0];
  const SECOND_VOTER_ACCOUNT = accounts[1];

  // Deploy a fresh instance of the contract before each test
  beforeEach(async function() {
    electionInstance = await Election.new(); // Deploy a fresh contract
  });

  it("initializes with two candidates", async function() {
    const count = await electionInstance.candidatesCount();
    assert.equal(count, 2);
  });

  it("initializes the candidates with the correct values", async function() {
    const candidate1 = await electionInstance.candidates(CANDIDATE_1_ID);
    assert.equal(candidate1[0].toNumber(), CANDIDATE_1_ID, "contains the correct id");
    assert.equal(candidate1[1], CANDIDATE_1_NAME, "contains the correct name");
    assert.equal(candidate1[2].toNumber(), INITIAL_VOTE_COUNT, "contains the correct votes count");

    const candidate2 = await electionInstance.candidates(CANDIDATE_2_ID);
    assert.equal(candidate2[0].toNumber(), CANDIDATE_2_ID, "contains the correct id");
    assert.equal(candidate2[1], CANDIDATE_2_NAME, "contains the correct name");
    assert.equal(candidate2[2].toNumber(), INITIAL_VOTE_COUNT, "contains the correct votes count");
  });

  it("throws an exception for invalid candidates", async function() {
    try {
      await electionInstance.vote(99, { from: SECOND_VOTER_ACCOUNT });
      assert.fail("vote should fail");
    } catch (error) {
      assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
    }

    const candidate1 = await electionInstance.candidates(CANDIDATE_1_ID);
    const voteCount1 = candidate1[2].toNumber();
    assert.equal(voteCount1, INITIAL_VOTE_COUNT, "candidate 1 did not receive any votes");

    const candidate2 = await electionInstance.candidates(CANDIDATE_2_ID);
    const voteCount2 = candidate2[2].toNumber();
    assert.equal(voteCount2, INITIAL_VOTE_COUNT, "candidate 2 did not receive any votes");
  });

  it("throws an exception for double voting", async function() {
    // Vote for the first candidate
    await electionInstance.vote(CANDIDATE_1_ID, { from: FIRST_VOTER_ACCOUNT });

    // Check first candidate's vote count
    const firstCandidate = await electionInstance.candidates(CANDIDATE_1_ID);
    let voteCount = firstCandidate[2].toNumber();
    assert.equal(voteCount, 1, "First vote is accepted for candidate 1");

    // Try to vote again for the same candidate (should fail)
    try {
      await electionInstance.vote(CANDIDATE_1_ID, { from: FIRST_VOTER_ACCOUNT });
      assert.fail("double voting should fail");
    } catch (error) {
      assert(error.message.indexOf('revert') >= 0, "Error message must contain 'revert'");
    }

    // Check that the vote count for candidate 1 hasn't changed
    const updatedFirstCandidate = await electionInstance.candidates(CANDIDATE_1_ID);
    voteCount = updatedFirstCandidate[2].toNumber();
    assert.equal(voteCount, 1, "Vote count for candidate 1 should still be 1");

    // Check that candidate 2's vote count is still 0 (no double voting)
    const secondCandidate = await electionInstance.candidates(CANDIDATE_2_ID);
    voteCount = secondCandidate[2].toNumber();
    assert.equal(voteCount, INITIAL_VOTE_COUNT, "Candidate 2 should not have received any votes");
  });

  it("allows a voter to cast a vote", async function() {
    // Check the initial vote count for the candidate before voting
    const candidate = await electionInstance.candidates(CANDIDATE_1_ID);
    assert.equal(candidate[2].toNumber(), INITIAL_VOTE_COUNT, "vote count before vote must be 0");

    // Now cast a vote
    const receipt = await electionInstance.vote(CANDIDATE_1_ID, { from: FIRST_VOTER_ACCOUNT });
    assert.equal(receipt.logs.length, 1, "an event was triggered");
    assert.equal(receipt.logs[0].event, "votedEvent", "the event type is correct");
    assert.equal(receipt.logs[0].args._candidateId.toNumber(), CANDIDATE_1_ID, "the candidate id is correct");

    // Check if the voter was marked as voted
    const voted = await electionInstance.voters(FIRST_VOTER_ACCOUNT);
    assert(voted, "the voter was marked as voted");

    // Check the final vote count for the candidate
    const updatedCandidate = await electionInstance.candidates(CANDIDATE_1_ID);
    const voteCount = updatedCandidate[2].toNumber();
    assert.equal(voteCount, 1, "increments the candidate's vote count");
  });
});
