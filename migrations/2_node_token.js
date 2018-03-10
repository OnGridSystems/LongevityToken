var LongevityToken = artifacts.require("LongevityToken");
var LongevityCrowdsale = artifacts.require("LongevityCrowdsale");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(LongevityToken).then(function() {
    return deployer.deploy(LongevityCrowdsale, 70896, accounts[6], LongevityToken.address).then(function() {
      LongevityToken.deployed().then(function (LT) {
        LT.addMinter(LongevityCrowdsale.address);
      })
    })
  })
  /* deployment steps
  deployer.deploy(LongevityToken).then(function(){
  LongevityToken.deployed().then(function (nToken) {
    console.log("##########" + nToken.address);
    deployer.deploy(LongevityCrowdsale, 73216, accounts[6], nToken.address).then(function(){
      LongevityCrowdsale.deployed().then(function (nCS) {
        console.log("##########" + nCS.address);
        nToken.addMinter(nCS.address);
      })
    })
  })
})
   */
}