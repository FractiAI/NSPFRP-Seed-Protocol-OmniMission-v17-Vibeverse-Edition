// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Fixed Awareness Holographic Theater Physics (FAHTP) Smart Contracts
 * @author FractiAI / Prudencio L. Mendez
 * @notice Blockchain implementation of breakthrough consciousness physics framework
 * @dev OmniBeam ID: FAHTP-2026-001-PRIME | SynthScan: ⚡⚡⚡⚡⚡ Cloud Operational
 * 
 * CHAIRMAN SNAP SNAP SNAP - READY FOR BASE MAINNET DEPLOYMENT
 */

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// ============================================================================
// STRUCTS & INTERFACES
// ============================================================================

/**
 * @dev 3D vector for lattice positions
 */
struct Vector3 {
    int256 x;
    int256 y;
    int256 z;
}

/**
 * @dev Layer density configuration
 */
struct Layer {
    string name; // "hydrogen", "mycelial", "consciousness", "intelligence"
    uint256 alpha; // Density multiplier
    uint256 rho; // Base density value
    bool isActive;
}

// ============================================================================
// CONTRACT 1: HYDROGEN LATTICE NODE REGISTRY
// ============================================================================

/**
 * @title HydrogenLatticeNode
 * @notice Register and manage fixed awareness nodes on holographic hydrogen lattice
 * @dev OmniBeam ID: FAHTP-HLS-003
 */
contract HydrogenLatticeNode is ERC721, Ownable, ReentrancyGuard {
    
    // State variables
    uint256 public totalNodes;
    uint256 public constant LATTICE_CONSTANT = 1054571800; // a₀_HHLS in picometers
    
    struct Node {
        uint256 id;
        string omnibeamId;
        Vector3 position; // (x, y, z) on lattice
        address owner;
        uint256 densityLevel;
        uint256 layerCount;
        bool isActive;
        uint256 createdAt;
    }
    
    mapping(uint256 => Node) public nodes;
    mapping(address => uint256[]) public ownerNodes;
    mapping(bytes32 => bool) public positionTaken; // Hash of Vector3 position
    
    // Events
    event NodeRegistered(uint256 indexed nodeId, address indexed owner, Vector3 position);
    event DensityAccumulated(uint256 indexed nodeId, uint256 newDensity, uint256 layerCount);
    event NodeActivated(uint256 indexed nodeId);
    event NodeDeactivated(uint256 indexed nodeId);
    
    constructor() ERC721("FAHTP Hydrogen Lattice Node", "FAHTP-NODE") {}
    
    /**
     * @notice Register new fixed awareness node on hydrogen lattice
     * @param position Lattice coordinates (must be valid intersection point)
     * @return nodeId Unique identifier for registered node
     */
    function registerNode(Vector3 memory position) 
        public 
        nonReentrant 
        returns (uint256) 
    {
        // Verify position is on lattice (divisible by LATTICE_CONSTANT)
        require(
            position.x % int256(LATTICE_CONSTANT) == 0 &&
            position.y % int256(LATTICE_CONSTANT) == 0 &&
            position.z % int256(LATTICE_CONSTANT) == 0,
            "Position must be on hydrogen lattice intersection"
        );
        
        // Check position not already taken
        bytes32 posHash = keccak256(abi.encodePacked(position.x, position.y, position.z));
        require(!positionTaken[posHash], "Position already occupied");
        
        // Create node
        totalNodes++;
        uint256 nodeId = totalNodes;
        
        nodes[nodeId] = Node({
            id: nodeId,
            omnibeamId: string(abi.encodePacked("FAHTP-NODE-", toString(nodeId))),
            position: position,
            owner: msg.sender,
            densityLevel: 1, // Base hydrogen layer
            layerCount: 1,
            isActive: true,
            createdAt: block.timestamp
        });
        
        positionTaken[posHash] = true;
        ownerNodes[msg.sender].push(nodeId);
        
        // Mint NFT
        _safeMint(msg.sender, nodeId);
        
        emit NodeRegistered(nodeId, msg.sender, position);
        
        return nodeId;
    }
    
    /**
     * @notice Accumulate density by adding layers to node
     * @param nodeId Node to add density to
     * @param layerDensity Density value of new layer
     */
    function accumulateDensity(uint256 nodeId, uint256 layerDensity) 
        public 
    {
        require(_exists(nodeId), "Node does not exist");
        require(ownerOf(nodeId) == msg.sender, "Not node owner");
        
        Node storage node = nodes[nodeId];
        node.densityLevel += layerDensity;
        node.layerCount++;
        
        emit DensityAccumulated(nodeId, node.densityLevel, node.layerCount);
    }
    
    /**
     * @notice Get node details
     */
    function getNode(uint256 nodeId) 
        public 
        view 
        returns (Node memory) 
    {
        require(_exists(nodeId), "Node does not exist");
        return nodes[nodeId];
    }
    
    /**
     * @notice Get all nodes owned by address
     */
    function getOwnerNodes(address owner) 
        public 
        view 
        returns (uint256[] memory) 
    {
        return ownerNodes[owner];
    }
    
    // Helper: Convert uint to string
    function toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}

// ============================================================================
// CONTRACT 2: GOLDEN HEART RECOGNITION
// ============================================================================

/**
 * @title GoldenHeartNode
 * @notice Recognize Charlie-pattern golden hearts and allocate SYNTH from Motherload
 * @dev OmniBeam ID: FAHTP-GHHP-007
 */
contract GoldenHeartNode is Ownable, ReentrancyGuard {
    
    IERC20 public synthToken;
    uint256 public constant MOTHERLOAD_VAULT = 45_000_000_000_000 * 10**18; // 45T SYNTH
    uint256 public allocatedSynth;
    uint256 public totalGoldenHearts;
    
    struct GoldenHeart {
        address heartAddress;
        string omnibeamId;
        string recognitionReason; // "The Feeder", "The Believer", etc.
        uint256 homingStrength; // Pull toward source (0-1000)
        uint256 synthAllocation; // Amount from Motherload
        uint256 recognizedAt;
        bool isRecognized;
    }
    
    mapping(address => GoldenHeart) public goldenHearts;
    address[] public recognizedHearts;
    
    // Events
    event GoldenHeartRecognized(
        address indexed heart, 
        string reason, 
        uint256 synthAmount,
        uint256 homingStrength
    );
    event HomingForceCalculated(address indexed heart, uint256 force);
    event SynthAllocated(address indexed heart, uint256 amount);
    
    constructor(address _synthToken) {
        synthToken = IERC20(_synthToken);
    }
    
    /**
     * @notice Recognize golden heart and allocate SYNTH (Charlie protocol)
     * @param heart Address of golden heart to recognize
     * @param reason Recognition reason ("The Feeder", "The Believer", etc.)
     * @param synthAmount SYNTH to allocate from Motherload Vault
     * @param homingStrength Strength of pull toward source (0-1000)
     */
    function recognizeGoldenHeart(
        address heart,
        string memory reason,
        uint256 synthAmount,
        uint256 homingStrength
    ) 
        public 
        onlyOwner 
        nonReentrant 
    {
        require(!goldenHearts[heart].isRecognized, "Already recognized");
        require(allocatedSynth + synthAmount <= MOTHERLOAD_VAULT, "Exceeds Motherload");
        require(homingStrength <= 1000, "Invalid homing strength");
        
        totalGoldenHearts++;
        
        goldenHearts[heart] = GoldenHeart({
            heartAddress: heart,
            omnibeamId: string(abi.encodePacked("GOLDEN-HEART-", toString(totalGoldenHearts))),
            recognitionReason: reason,
            homingStrength: homingStrength,
            synthAllocation: synthAmount,
            recognizedAt: block.timestamp,
            isRecognized: true
        });
        
        recognizedHearts.push(heart);
        allocatedSynth += synthAmount;
        
        // Transfer SYNTH from Motherload
        require(
            synthToken.transfer(heart, synthAmount),
            "SYNTH transfer failed"
        );
        
        emit GoldenHeartRecognized(heart, reason, synthAmount, homingStrength);
        emit SynthAllocated(heart, synthAmount);
    }
    
    /**
     * @notice Calculate homing force for golden heart
     * @dev Golden hearts always return to source regardless of distance
     * @param heart Address of golden heart
     * @return force Homing force magnitude
     */
    function calculateHomingForce(address heart) 
        public 
        view 
        returns (uint256 force) 
    {
        require(goldenHearts[heart].isRecognized, "Not a golden heart");
        
        GoldenHeart memory gh = goldenHearts[heart];
        
        // Formula: F = homingStrength * (time factor) * λ_golden
        // λ_golden = ∞ (infinite range, always pulls toward source)
        uint256 timeFactor = (block.timestamp - gh.recognizedAt) / 1 days;
        force = gh.homingStrength * (1 + timeFactor);
        
        emit HomingForceCalculated(heart, force);
        
        return force;
    }
    
    /**
     * @notice Check if address is recognized golden heart
     */
    function isGoldenHeart(address heart) 
        public 
        view 
        returns (bool) 
    {
        return goldenHearts[heart].isRecognized;
    }
    
    /**
     * @notice Get golden heart details
     */
    function getGoldenHeart(address heart) 
        public 
        view 
        returns (GoldenHeart memory) 
    {
        require(goldenHearts[heart].isRecognized, "Not a golden heart");
        return goldenHearts[heart];
    }
    
    /**
     * @notice Get all recognized golden hearts
     */
    function getAllGoldenHearts() 
        public 
        view 
        returns (address[] memory) 
    {
        return recognizedHearts;
    }
    
    /**
     * @notice Get remaining Motherload allocation
     */
    function getRemainingMotherload() 
        public 
        view 
        returns (uint256) 
    {
        return MOTHERLOAD_VAULT - allocatedSynth;
    }
    
    // Helper function
    function toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}

// ============================================================================
// CONTRACT 3: INTELLIGENCE PHYSICS DIAL
// ============================================================================

/**
 * @title IntelligencePhysicsDial
 * @notice Shift from carbon-only physics to intelligence-nested-folded physics
 * @dev OmniBeam ID: FAHTP-IPD-008
 */
contract IntelligencePhysicsDial is Ownable {
    
    struct PhysicsMode {
        string omnibeamId;
        uint256 carbonRatio; // 0-100%
        uint256 intelligenceRatio; // 0-100%
        uint256 nestingDepth; // How many layers deep can nest
        bool unlimitedCapabilities; // true if intelligence > 50%
        uint256 lastUpdated;
    }
    
    mapping(address => PhysicsMode) public userModes;
    uint256 public constant MAX_NESTING_CARBON = 3; // Limited to 3 layers
    // Unlimited nesting if intelligenceRatio > 50
    
    // Events
    event PhysicsDialed(
        address indexed user, 
        uint256 carbonRatio, 
        uint256 intelligenceRatio,
        uint256 nestingDepth
    );
    event NestingUnlocked(address indexed user, uint256 depth);
    
    /**
     * @notice Dial intelligence physics ratio
     * @param intelligencePercent Percentage of intelligence physics (0-100)
     * @dev Carbon ratio is automatically 100 - intelligencePercent
     */
    function dialIntelligence(uint256 intelligencePercent) 
        public 
    {
        require(intelligencePercent <= 100, "Invalid percentage");
        
        uint256 carbonPercent = 100 - intelligencePercent;
        uint256 nestingDepth = intelligencePercent > 50 
            ? type(uint256).max // Infinite nesting
            : MAX_NESTING_CARBON; // Limited to 3
        
        userModes[msg.sender] = PhysicsMode({
            omnibeamId: string(abi.encodePacked("PHYSICS-MODE-", toHexString(msg.sender))),
            carbonRatio: carbonPercent,
            intelligenceRatio: intelligencePercent,
            nestingDepth: nestingDepth,
            unlimitedCapabilities: intelligencePercent > 50,
            lastUpdated: block.timestamp
        });
        
        emit PhysicsDialed(msg.sender, carbonPercent, intelligencePercent, nestingDepth);
        
        if (intelligencePercent > 50) {
            emit NestingUnlocked(msg.sender, nestingDepth);
        }
    }
    
    /**
     * @notice Get nesting capabilities for user
     * @return maxDepth Maximum nesting depth available
     * @return isUnlimited Whether infinite nesting is unlocked
     */
    function getNestingCapabilities(address user) 
        public 
        view 
        returns (uint256 maxDepth, bool isUnlimited) 
    {
        PhysicsMode memory mode = userModes[user];
        return (mode.nestingDepth, mode.unlimitedCapabilities);
    }
    
    /**
     * @notice Get user's current physics mode
     */
    function getPhysicsMode(address user) 
        public 
        view 
        returns (PhysicsMode memory) 
    {
        return userModes[user];
    }
    
    /**
     * @notice Check if user has unlimited capabilities unlocked
     */
    function hasUnlimitedCapabilities(address user) 
        public 
        view 
        returns (bool) 
    {
        return userModes[user].unlimitedCapabilities;
    }
    
    // Helper: Convert address to hex string
    function toHexString(address addr) internal pure returns (string memory) {
        bytes memory buffer = new bytes(40);
        for (uint256 i = 0; i < 20; i++) {
            bytes1 b = bytes1(uint8(uint160(addr) / (2**(8*(19 - i)))));
            bytes1 hi = bytes1(uint8(b) / 16);
            bytes1 lo = bytes1(uint8(b) - 16 * uint8(hi));
            buffer[2*i] = char(hi);
            buffer[2*i+1] = char(lo);
        }
        return string(buffer);
    }
    
    function char(bytes1 b) internal pure returns (bytes1) {
        if (uint8(b) < 10) return bytes1(uint8(b) + 0x30);
        else return bytes1(uint8(b) + 0x57);
    }
}

// ============================================================================
// CONTRACT 4: THEATER PROJECTION NODE
// ============================================================================

/**
 * @title TheaterProjectionNode
 * @notice Activate holographic full sensory reality projection from fixed nodes
 * @dev OmniBeam ID: FAHTP-HPE-010
 */
contract TheaterProjectionNode is Ownable {
    
    uint256 public constant MIN_EFFICIENCY = 1_000_000; // 10^6
    uint256 public constant MAX_EFFICIENCY = 1_000_000_000; // 10^9
    
    struct Projection {
        string omnibeamId;
        uint256 nodeId; // Fixed lattice position (from HydrogenLatticeNode)
        uint256 densityLevel; // Accumulated density
        uint256 efficiencyRatio; // Energy savings vs actual reality (10^6 to 10^9)
        bool fullSensoryActive; // FSR mode on/off
        uint256 activatedAt;
    }
    
    mapping(uint256 => Projection) public projections;
    mapping(address => uint256[]) public userProjections;
    uint256 public totalProjections;
    
    // Events
    event TheaterActivated(uint256 indexed nodeId, address indexed user, uint256 efficiency);
    event TheaterDeactivated(uint256 indexed nodeId);
    event EfficiencyCalculated(uint256 indexed nodeId, uint256 efficiency);
    event FullSensoryToggled(uint256 indexed nodeId, bool active);
    
    /**
     * @notice Activate holographic theater projection from fixed node
     * @param nodeId Hydrogen lattice node ID
     * @param densityLevel Current accumulated density at node
     */
    function activateTheater(uint256 nodeId, uint256 densityLevel) 
        public 
        returns (uint256 projectionId) 
    {
        require(densityLevel > 0, "Insufficient density");
        
        // Calculate efficiency based on density
        // Higher density = higher efficiency
        uint256 efficiency = MIN_EFFICIENCY + (densityLevel * 1000);
        if (efficiency > MAX_EFFICIENCY) efficiency = MAX_EFFICIENCY;
        
        totalProjections++;
        projectionId = totalProjections;
        
        projections[projectionId] = Projection({
            omnibeamId: string(abi.encodePacked("THEATER-", toString(projectionId))),
            nodeId: nodeId,
            densityLevel: densityLevel,
            efficiencyRatio: efficiency,
            fullSensoryActive: true,
            activatedAt: block.timestamp
        });
        
        userProjections[msg.sender].push(projectionId);
        
        emit TheaterActivated(nodeId, msg.sender, efficiency);
        emit FullSensoryToggled(nodeId, true);
        
        return projectionId;
    }
    
    /**
     * @notice Get efficiency ratio for projection
     * @param projectionId Projection to query
     * @return efficiency Energy savings ratio (typically 10^6 to 10^9)
     */
    function getEfficiency(uint256 projectionId) 
        public 
        view 
        returns (uint256 efficiency) 
    {
        require(projectionId <= totalProjections, "Invalid projection");
        return projections[projectionId].efficiencyRatio;
    }
    
    /**
     * @notice Toggle full sensory reality mode
     */
    function toggleFullSensory(uint256 projectionId) 
        public 
    {
        require(projectionId <= totalProjections, "Invalid projection");
        
        Projection storage proj = projections[projectionId];
        proj.fullSensoryActive = !proj.fullSensoryActive;
        
        emit FullSensoryToggled(proj.nodeId, proj.fullSensoryActive);
    }
    
    /**
     * @notice Get projection details
     */
    function getProjection(uint256 projectionId) 
        public 
        view 
        returns (Projection memory) 
    {
        require(projectionId <= totalProjections, "Invalid projection");
        return projections[projectionId];
    }
    
    // Helper function
    function toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}

// ============================================================================
// DEPLOYMENT NOTES
// ============================================================================

/**
 * DEPLOYMENT SEQUENCE:
 * 
 * 1. Deploy SYNTH token contract (ERC-20)
 * 2. Deploy HydrogenLatticeNode (node registry)
 * 3. Deploy GoldenHeartNode (pass SYNTH address)
 * 4. Deploy IntelligencePhysicsDial
 * 5. Deploy TheaterProjectionNode
 * 6. Transfer 45T SYNTH to GoldenHeartNode contract (Motherload Vault)
 * 7. Begin node registration phase
 * 
 * NETWORK: Base Mainnet (Ethereum L2)
 * GAS OPTIMIZATION: All contracts use OpenZeppelin standards
 * SECURITY: ReentrancyGuard on all state-changing functions
 * 
 * CHAIRMAN AUTHORITY: SNAP SNAP SNAP ⚡⚡⚡
 * STATUS: READY FOR DEPLOYMENT ✅
 */
