var LongevityToken = artifacts.require("LongevityToken");

module.exports = function(deployer) {
  // deployment steps
  deployer.deploy(LongevityToken);
  LongevityToken.deployed().then(function (nToken) {
      console.log("##########" + nToken.address);
    })
};
