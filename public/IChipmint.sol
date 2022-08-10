interface IChipmint {
  function approve ( address to, uint256 tokenId ) external;
  function authorizations ( bytes32 ) external view returns ( address sender, address recipient, uint256 qty, uint256 exp );
  function balanceOf ( address owner ) external view returns ( uint256 );
  function checkAuthorization ( address sender, address recipient ) external view returns ( tuple );
  function checkMyAuthorization ( address recipient ) external view returns ( tuple );
  function checkSmsStatus ( uint256 id ) external view returns ( uint256 );
  function getApproved ( uint256 tokenId ) external view returns ( address );
  function initialize ( address _manager ) external;
  function isApprovedForAll ( address owner, address operator ) external view returns ( bool );
  function isPhoneNumberVerified ( address recipient ) external view returns ( bool );
  function name (  ) external view returns ( string );
  function numberOfSmsRequests (  ) external view returns ( uint256 );
  function ownerOf ( uint256 tokenId ) external view returns ( address );
  function phoneHashes ( address ) external view returns ( bytes32 );
  function registerAuthorization ( address sender, address recipient, uint256 qty, uint256 exp ) external;
  function safeTransferFrom ( address from, address to, uint256 tokenId ) external;
  function safeTransferFrom ( address from, address to, uint256 tokenId, bytes data ) external;
  function sendSms ( address recipient, string text ) external returns ( bool );
  function sendSmsWithRequire ( address recipient, string text ) external returns ( bool );
  function setApprovalForAll ( address operator, bool approved ) external;
  function setPhoneNumberVerified ( address recipient, bytes32 phoneHash ) external;
  function setSmsStatus ( uint256 id, uint256 status ) external;
  function smsRequests ( uint256 ) external view returns ( bytes32 auid, uint256 time, string text, uint256 status );
  function supportsInterface ( bytes4 interfaceId ) external view returns ( bool );
  function symbol (  ) external view returns ( string );
  function tokenURI ( uint256 tokenId ) external view returns ( string );
  function transferFrom ( address from, address to, uint256 tokenId ) external;
}
