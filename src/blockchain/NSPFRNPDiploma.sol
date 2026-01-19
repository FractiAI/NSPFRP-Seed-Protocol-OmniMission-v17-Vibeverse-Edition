// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title NSPFRNPDiploma
 * @dev Soulbound NFT diploma for NSPFRNP University
 * SNAP #12: Blockchain Diploma Registry
 * Octave 12: Complete Educational Experience
 */
contract NSPFRNPDiploma is ERC721, ERC721URIStorage, AccessControl {
    using Counters for Counters.Counter;
    
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    
    Counters.Counter private _tokenIdCounter;
    
    struct Diploma {
        string studentId;
        string studentName;
        string college;
        string certificationLevel; // ASSISTANT, GP, SPECIALIST, MASTER, FELLOW
        string major;
        uint256 completionDate;
        uint256 totalCredits;
        uint256 gpa; // Stored as basis points (375 = 3.75 GPA)
        string ipfsHash; // Full diploma data on IPFS
        string[] honors; // e.g., "Summa Cum Laude"
        bool revoked; // Can be revoked if fraud detected
    }
    
    // Mapping from token ID to diploma data
    mapping(uint256 => Diploma) public diplomas;
    
    // Mapping from student ID to array of token IDs (one student can have multiple diplomas)
    mapping(string => uint256[]) public studentDiplomas;
    
    // Mapping from student wallet to student ID
    mapping(address => string) public walletToStudentId;
    
    // Events
    event DiplomaIssued(
        uint256 indexed tokenId,
        string indexed studentId,
        address indexed studentWallet,
        string college,
        string certificationLevel,
        uint256 completionDate,
        uint256 gpa
    );
    
    event DiplomaRevoked(
        uint256 indexed tokenId,
        string reason
    );
    
    event DiplomaVerified(
        uint256 indexed tokenId,
        address indexed verifier,
        bool valid
    );
    
    constructor() ERC721("NSPFRNP University Diploma", "NSPFRP-DIPLOMA") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ISSUER_ROLE, msg.sender);
        _grantRole(VERIFIER_ROLE, msg.sender);
    }
    
    /**
     * @dev Issue a new diploma NFT
     * @param studentWallet Wallet address of the student
     * @param studentId Unique student identifier
     * @param studentName Full name of student
     * @param college College code (BHEP, SHC, INP, etc.)
     * @param certificationLevel Level achieved (ASSISTANT, GP, SPECIALIST, MASTER, FELLOW)
     * @param major Field of study
     * @param totalCredits Total credits earned
     * @param gpa GPA in basis points (375 = 3.75)
     * @param ipfsHash IPFS hash of full diploma data
     * @param honors Array of honors (e.g., ["Summa Cum Laude"])
     * @return tokenId The ID of the newly minted diploma NFT
     */
    function issueDiploma(
        address studentWallet,
        string memory studentId,
        string memory studentName,
        string memory college,
        string memory certificationLevel,
        string memory major,
        uint256 totalCredits,
        uint256 gpa,
        string memory ipfsHash,
        string[] memory honors
    ) public onlyRole(ISSUER_ROLE) returns (uint256) {
        require(studentWallet != address(0), "Invalid student wallet");
        require(bytes(studentId).length > 0, "Student ID required");
        require(bytes(college).length > 0, "College required");
        require(gpa <= 430, "Invalid GPA (max 4.3)"); // 430 basis points = 4.3 GPA
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        // Create diploma record
        diplomas[tokenId] = Diploma({
            studentId: studentId,
            studentName: studentName,
            college: college,
            certificationLevel: certificationLevel,
            major: major,
            completionDate: block.timestamp,
            totalCredits: totalCredits,
            gpa: gpa,
            ipfsHash: ipfsHash,
            honors: honors,
            revoked: false
        });
        
        // Track student diplomas
        studentDiplomas[studentId].push(tokenId);
        walletToStudentId[studentWallet] = studentId;
        
        // Mint soulbound NFT
        _safeMint(studentWallet, tokenId);
        _setTokenURI(tokenId, string(abi.encodePacked("ipfs://", ipfsHash)));
        
        emit DiplomaIssued(
            tokenId,
            studentId,
            studentWallet,
            college,
            certificationLevel,
            block.timestamp,
            gpa
        );
        
        return tokenId;
    }
    
    /**
     * @dev Get diploma details by token ID
     */
    function getDiploma(uint256 tokenId) public view returns (Diploma memory) {
        require(_exists(tokenId), "Diploma does not exist");
        return diplomas[tokenId];
    }
    
    /**
     * @dev Get all diplomas for a student ID
     */
    function getStudentDiplomas(string memory studentId) public view returns (uint256[] memory) {
        return studentDiplomas[studentId];
    }
    
    /**
     * @dev Get student ID from wallet address
     */
    function getStudentId(address wallet) public view returns (string memory) {
        return walletToStudentId[wallet];
    }
    
    /**
     * @dev Verify a diploma's authenticity
     */
    function verifyDiploma(uint256 tokenId, string memory studentId) public returns (bool) {
        if (!_exists(tokenId)) {
            emit DiplomaVerified(tokenId, msg.sender, false);
            return false;
        }
        
        Diploma memory diploma = diplomas[tokenId];
        
        if (diploma.revoked) {
            emit DiplomaVerified(tokenId, msg.sender, false);
            return false;
        }
        
        bool valid = keccak256(bytes(diploma.studentId)) == keccak256(bytes(studentId));
        
        emit DiplomaVerified(tokenId, msg.sender, valid);
        return valid;
    }
    
    /**
     * @dev Revoke a diploma (in case of fraud)
     */
    function revokeDiploma(uint256 tokenId, string memory reason) public onlyRole(ISSUER_ROLE) {
        require(_exists(tokenId), "Diploma does not exist");
        diplomas[tokenId].revoked = true;
        emit DiplomaRevoked(tokenId, reason);
    }
    
    /**
     * @dev Check if diploma is revoked
     */
    function isRevoked(uint256 tokenId) public view returns (bool) {
        require(_exists(tokenId), "Diploma does not exist");
        return diplomas[tokenId].revoked;
    }
    
    /**
     * @dev Get GPA as a decimal (375 => 3.75)
     */
    function getGPADecimal(uint256 tokenId) public view returns (uint256, uint256) {
        require(_exists(tokenId), "Diploma does not exist");
        uint256 gpa = diplomas[tokenId].gpa;
        return (gpa / 100, gpa % 100);
    }
    
    /**
     * @dev Override to make diploma soulbound (non-transferable)
     * Can only mint to student, cannot transfer after
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal virtual override {
        require(
            from == address(0) || to == address(0), 
            "Diplomas are soulbound and cannot be transferred"
        );
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
    
    /**
     * @dev Check if diploma exists
     */
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }
    
    // The following functions are overrides required by Solidity
    
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
