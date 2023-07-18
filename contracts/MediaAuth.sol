// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import some libraries
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

// Define the MediaAuth contract
contract MediaAuth is Ownable {
  // Define some constants
  uint256 public constant FEE = 0.01 ether; // The fee for registering media
  uint256 public constant MAX_MEDIA_COUNT = 10; // The maximum number of media per creator

  // Define some structs
  struct Media {
    string ipfsHash; // The IPFS hash of the media file
    string title; // The title of the media
    string description; // The description of the media
    uint256 timestamp; // The timestamp of the registration
  }

  // Define some mappings
  mapping(address => Media[]) public mediaByCreator; // A mapping from creator address to media array
  mapping(string => bool) public ipfsHashExists; // A mapping from IPFS hash to existence flag

  // Define some events
  event MediaRegistered(address indexed creator, string ipfsHash, string title, string description, uint256 timestamp); // An event for media registration

  // Define a modifier that checks if the fee is paid
  modifier feePaid() {
    require(msg.value == FEE, "Fee not paid");
    _;
  }

  // Define a function that returns the fee amount
  function fee() public returns (uint256) {
    return FEE;
  }

  // Define a function that returns the media count for a creator
  function getMediaCount(address creator) public view returns (uint256) {
    return mediaByCreator[creator].length;
  }

  // Define a function that returns the media details by index for a creator
  function getMediaByIndex(address creator, uint256 index) public view returns (Media memory) {
    return mediaByCreator[creator][index];
  }

  // Define a function that registers a new media on the contract
  function registerMedia(string memory ipfsHash, string memory title, string memory description) public payable feePaid {
    // Check if the IPFS hash is not empty
    require(bytes(ipfsHash).length > 0, "IPFS hash is empty");
    // Check if the IPFS hash does not exist on the contract
    require(!ipfsHashExists[ipfsHash], "IPFS hash already exists");
    // Check if the title is not empty
    require(bytes(title).length > 0, "Title is empty");
    // Check if the description is not empty
    require(bytes(description).length > 0, "Description is empty");
    // Check if the media count for the creator is less than the maximum limit
    require(mediaByCreator[msg.sender].length < MAX_MEDIA_COUNT, "Media count exceeded");
    // Get the current timestamp
    uint256 timestamp = block.timestamp;
    // Create a new media struct with the given details
    Media memory media = Media(ipfsHash, title, description, timestamp);
    // Push the media struct to the media array for the creator
    mediaByCreator[msg.sender].push(media);
    // Set the IPFS hash existence flag to true
    ipfsHashExists[ipfsHash] = true;
    // Emit an event with the media details
    emit MediaRegistered(msg.sender, ipfsHash, title, description, timestamp);
  }

}
