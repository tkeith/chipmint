// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";

contract MainContract is ERC721Upgradeable {

  // type Auid is bytes32;
  // type Time is uint256;
  // type SmsStatus is uint8;
  // type Qty is uint16;
  // type PhoneHash is bytes32;
  // type SmsRequestId is uint32;

  struct Authorization {
    address sender;
    address recipient;
    uint256 qty;
    uint256 exp;
  }

  struct AuthorizationStatus {
    bool valid;
    uint256 qty;
    uint256 time;
  }

  struct SmsRequest {
    bytes32 auid;
    uint256 time;
    string text;
    uint256 status;
  }

  mapping(address => bytes32) public phoneHashes;
  mapping(bytes32 => Authorization) public authorizations;
  mapping(uint256 => SmsRequest) public smsRequests;
  uint256 public numberOfSmsRequests;

  address private manager;

  event PhoneNumberVerified(address recipient, bytes32 phoneHash);
  event AuthorizationRegistered(address sender, address recipient, uint256 qty, uint256 exp);
  event SmsRequested(uint256 smsRequestId, address sender, address recipient, uint256 time, string text, uint256 newAuthQty);
  event SmsStatusUpdated(uint256 id, uint256 status);

  modifier onlyManager(){
      require(_msgSender() == manager, "Manager only");
      _;
  }

  function _baseURI() pure internal override returns (string memory) {
    return "https://app.chipmint.co/express/nft-metadata/";
  }

  function initialize(address _manager) public initializer {
    manager = _manager;
    __MainContract_init();
  }

  function __MainContract_init() internal onlyInitializing {
    __ERC721_init("Chipmint", "CHIP");
  }

  function setPhoneNumberVerified(address recipient, bytes32 phoneHash) external onlyManager {
    phoneHashes[recipient] = phoneHash;
    emit PhoneNumberVerified(recipient, phoneHash);
  }
  
  function isPhoneNumberVerified(address recipient) external view returns(bool) {
    return phoneHashes[recipient] != 0;
  }

  function getAuid(address sender, address recipient) internal pure returns(bytes32) {
    return keccak256(abi.encode([sender, recipient]));
  }

  function registerAuthorization(address sender, address recipient, uint256 qty, uint256 exp) external onlyManager {
    // FUTURE: on-chain verification of the signed message

    bytes32 auid = getAuid(sender, recipient);
    Authorization memory curAuth = authorizations[auid];
    if (curAuth.exp > exp && curAuth.qty > qty) {
      return; // not a superior authorization to the current one
    }
    authorizations[auid] = Authorization(sender, recipient, qty, exp);
    emit AuthorizationRegistered(sender, recipient, qty, exp);
  }

  function checkAuthorization(address sender, address recipient) public view returns(AuthorizationStatus memory) {
    Authorization memory auth = authorizations[getAuid(sender, recipient)];
    if (auth.qty <= 0 || auth.exp <= block.timestamp) {
      return AuthorizationStatus(false, 0, 0);
    }
    return AuthorizationStatus(true, auth.qty, auth.exp);
  }

  function checkMyAuthorization(address recipient) external view returns(AuthorizationStatus memory) {
    return checkAuthorization(msg.sender, recipient);
  }

  function handleSend(address recipient, string calldata text) internal {
    numberOfSmsRequests++;
    SmsRequest memory smsRequest = SmsRequest(getAuid(msg.sender, recipient), block.timestamp, text, 0);
    smsRequests[numberOfSmsRequests] = smsRequest;

    Authorization memory auth = authorizations[getAuid(msg.sender, recipient)];
    auth.qty--;

    emit SmsRequested(numberOfSmsRequests, msg.sender, recipient, block.timestamp, text, auth.qty);
  }

  function sendSms(address recipient, string calldata text) external returns(bool) {
    if (!checkAuthorization(msg.sender, recipient).valid) {
      return false; // not sufficiently authorized
    }
    handleSend(recipient, text);
    return true;
  }

  function sendSmsWithRequire(address recipient, string calldata text) external returns(bool) {
    require(checkAuthorization(msg.sender, recipient).valid, "Not authorized");
    handleSend(recipient, text);
    return true;
  }

  function checkSmsStatus(uint256 id) view external returns(uint256) {
    return smsRequests[id].status;
  }

  function setSmsStatus(uint256 id, uint256 status) external onlyManager {
    smsRequests[id].status = status;
    emit SmsStatusUpdated(id, status);
  }
}
