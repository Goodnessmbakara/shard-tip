// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title GovernanceSystem
 * @dev Decentralized governance system for ShardTip platform
 * @author ShardTip Team
 */
contract GovernanceSystem is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // Events
    event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string title, uint256 endTime);
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight);
    event ProposalExecuted(uint256 indexed proposalId);
    event ProposalCancelled(uint256 indexed proposalId);
    event QuorumChanged(uint256 newQuorum);
    event VotingPeriodChanged(uint256 newVotingPeriod);
    event ProposalThresholdChanged(uint256 newThreshold);

    // Proposal states
    enum ProposalState {
        Pending,
        Active,
        Succeeded,
        Defeated,
        Executed,
        Cancelled
    }

    // Proposal structure
    struct Proposal {
        uint256 id;
        address proposer;
        string title;
        string description;
        uint256 startTime;
        uint256 endTime;
        uint256 forVotes;
        uint256 againstVotes;
        bool executed;
        bool cancelled;
        address[] targets;
        uint256[] values;
        bytes[] calldatas;
    }

    // Vote structure
    struct Vote {
        bool hasVoted;
        bool support;
        uint256 weight;
    }

    // State variables
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => Vote)) public votes;
    mapping(address => uint256) public votingPower;
    mapping(address => bool) public authorizedVoters;
    
    uint256 public proposalCount;
    uint256 public quorum = 1000; // 10% of total voting power
    uint256 public votingPeriod = 3 days;
    uint256 public proposalThreshold = 100; // Minimum voting power to create proposal
    uint256 public executionDelay = 1 days; // Delay before execution after voting ends
    
    IERC20 public governanceToken;
    bool public governanceEnabled = true;

    constructor(address _governanceToken) Ownable(msg.sender) {
        governanceToken = IERC20(_governanceToken);
    }

    /**
     * @dev Create a new governance proposal
     */
    function propose(
        string memory title,
        string memory description,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas
    ) external returns (uint256) {
        require(governanceEnabled, "GovernanceSystem: Governance disabled");
        require(votingPower[msg.sender] >= proposalThreshold, "GovernanceSystem: Insufficient voting power");
        require(targets.length == values.length && targets.length == calldatas.length, "GovernanceSystem: Array length mismatch");

        uint256 proposalId = proposalCount++;
        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + votingPeriod;

        proposals[proposalId] = Proposal({
            id: proposalId,
            proposer: msg.sender,
            title: title,
            description: description,
            startTime: startTime,
            endTime: endTime,
            forVotes: 0,
            againstVotes: 0,
            executed: false,
            cancelled: false,
            targets: targets,
            values: values,
            calldatas: calldatas
        });

        emit ProposalCreated(proposalId, msg.sender, title, endTime);
        return proposalId;
    }

    /**
     * @dev Vote on a proposal
     */
    function vote(uint256 proposalId, bool support) external {
        require(governanceEnabled, "GovernanceSystem: Governance disabled");
        require(getProposalState(proposalId) == ProposalState.Active, "GovernanceSystem: Proposal not active");
        require(votingPower[msg.sender] > 0, "GovernanceSystem: No voting power");
        require(!votes[proposalId][msg.sender].hasVoted, "GovernanceSystem: Already voted");

        Proposal storage proposal = proposals[proposalId];
        uint256 weight = votingPower[msg.sender];

        votes[proposalId][msg.sender] = Vote({
            hasVoted: true,
            support: support,
            weight: weight
        });

        if (support) {
            proposal.forVotes += weight;
        } else {
            proposal.againstVotes += weight;
        }

        emit VoteCast(proposalId, msg.sender, support, weight);
    }

    /**
     * @dev Execute a successful proposal
     */
    function execute(uint256 proposalId) external nonReentrant {
        require(getProposalState(proposalId) == ProposalState.Succeeded, "GovernanceSystem: Proposal not succeeded");
        require(block.timestamp >= proposals[proposalId].endTime + executionDelay, "GovernanceSystem: Execution delay not met");

        Proposal storage proposal = proposals[proposalId];
        proposal.executed = true;

        // Execute proposal actions
        for (uint256 i = 0; i < proposal.targets.length; i++) {
            (bool success, ) = proposal.targets[i].call{value: proposal.values[i]}(proposal.calldatas[i]);
            require(success, "GovernanceSystem: Execution failed");
        }

        emit ProposalExecuted(proposalId);
    }

    /**
     * @dev Cancel a proposal (proposer only)
     */
    function cancel(uint256 proposalId) external {
        Proposal storage proposal = proposals[proposalId];
        require(msg.sender == proposal.proposer, "GovernanceSystem: Not proposer");
        require(getProposalState(proposalId) == ProposalState.Active, "GovernanceSystem: Proposal not active");

        proposal.cancelled = true;
        emit ProposalCancelled(proposalId);
    }

    /**
     * @dev Get proposal state
     */
    function getProposalState(uint256 proposalId) public view returns (ProposalState) {
        Proposal memory proposal = proposals[proposalId];
        
        if (proposal.cancelled) {
            return ProposalState.Cancelled;
        }
        
        if (proposal.executed) {
            return ProposalState.Executed;
        }
        
        if (block.timestamp < proposal.startTime) {
            return ProposalState.Pending;
        }
        
        if (block.timestamp <= proposal.endTime) {
            return ProposalState.Active;
        }
        
        if (proposal.forVotes <= proposal.againstVotes || proposal.forVotes < quorum) {
            return ProposalState.Defeated;
        }
        
        return ProposalState.Succeeded;
    }

    /**
     * @dev Update voting power based on token balance
     */
    function updateVotingPower(address voter) external {
        _updateVotingPower(voter);
    }

    /**
     * @dev Batch update voting power for multiple voters
     */
    function batchUpdateVotingPower(address[] calldata voters) external {
        for (uint256 i = 0; i < voters.length; i++) {
            _updateVotingPower(voters[i]);
        }
    }

    /**
     * @dev Internal function to update voting power
     */
    function _updateVotingPower(address voter) internal {
        require(address(governanceToken) != address(0), "GovernanceSystem: No governance token");
        
        uint256 balance = governanceToken.balanceOf(voter);
        votingPower[voter] = balance;
    }

    /**
     * @dev Get proposal details
     */
    function getProposal(uint256 proposalId) external view returns (Proposal memory) {
        return proposals[proposalId];
    }

    /**
     * @dev Get voter's vote for a proposal
     */
    function getVote(uint256 proposalId, address voter) external view returns (Vote memory) {
        return votes[proposalId][voter];
    }

    /**
     * @dev Check if proposal meets quorum
     */
    function meetsQuorum(uint256 proposalId) external view returns (bool) {
        Proposal memory proposal = proposals[proposalId];
        return proposal.forVotes >= quorum;
    }

    /**
     * @dev Get proposal results
     */
    function getProposalResults(uint256 proposalId) external view returns (
        uint256 forVotes,
        uint256 againstVotes,
        bool meetsQuorumThreshold,
        bool passed
    ) {
        Proposal memory proposal = proposals[proposalId];
        forVotes = proposal.forVotes;
        againstVotes = proposal.againstVotes;
        meetsQuorumThreshold = proposal.forVotes >= quorum;
        passed = proposal.forVotes > proposal.againstVotes && meetsQuorumThreshold;
    }

    // Admin functions
    /**
     * @dev Set quorum (owner only)
     */
    function setQuorum(uint256 newQuorum) external onlyOwner {
        require(newQuorum > 0, "GovernanceSystem: Invalid quorum");
        quorum = newQuorum;
        emit QuorumChanged(newQuorum);
    }

    /**
     * @dev Set voting period (owner only)
     */
    function setVotingPeriod(uint256 newVotingPeriod) external onlyOwner {
        require(newVotingPeriod > 0, "GovernanceSystem: Invalid voting period");
        votingPeriod = newVotingPeriod;
        emit VotingPeriodChanged(newVotingPeriod);
    }

    /**
     * @dev Set proposal threshold (owner only)
     */
    function setProposalThreshold(uint256 newThreshold) external onlyOwner {
        proposalThreshold = newThreshold;
        emit ProposalThresholdChanged(newThreshold);
    }

    /**
     * @dev Set execution delay (owner only)
     */
    function setExecutionDelay(uint256 newDelay) external onlyOwner {
        executionDelay = newDelay;
    }

    /**
     * @dev Toggle governance (owner only)
     */
    function setGovernanceEnabled(bool enabled) external onlyOwner {
        governanceEnabled = enabled;
    }

    /**
     * @dev Authorize voter (owner only)
     */
    function authorizeVoter(address voter) external onlyOwner {
        authorizedVoters[voter] = true;
    }

    /**
     * @dev Deauthorize voter (owner only)
     */
    function deauthorizeVoter(address voter) external onlyOwner {
        authorizedVoters[voter] = false;
    }

    /**
     * @dev Emergency pause governance (owner only)
     */
    function emergencyPause() external onlyOwner {
        governanceEnabled = false;
    }

    /**
     * @dev Get governance statistics
     */
    function getGovernanceStats() external view returns (
        uint256 totalProposals,
        uint256 activeProposals,
        uint256 executedProposals,
        uint256 totalVotingPower
    ) {
        totalProposals = proposalCount;
        activeProposals = 0;
        executedProposals = 0;
        totalVotingPower = 0;

        for (uint256 i = 0; i < proposalCount; i++) {
            ProposalState state = getProposalState(i);
            if (state == ProposalState.Active) {
                activeProposals++;
            } else if (state == ProposalState.Executed) {
                executedProposals++;
            }
        }

        // Note: totalVotingPower would require iterating through all voters
        // This is simplified for gas efficiency
    }

    /**
     * @dev Fallback function to accept ETH
     */
    receive() external payable {}
}

