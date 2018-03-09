var LongevityToken = artifacts.require('LongevityToken');

contract('LongevityToken', function (accounts) {
  it('Check name', function () {
    return LongevityToken.deployed().then(function (instance) {
      return instance.name();
    }).then(function (result) {
      assert.equal(result, 'Longevity');
    });
  });
  it('Check symbols', function () {
      return LongevityToken.deployed().then(function (instance) {
          return instance.symbol();
      }).then(function (result) {
          assert.equal(result, 'LTY');
      });
  });
  it('Check decimals', function () {
      return LongevityToken.deployed().then(function (instance) {
          return instance.decimals();
      }).then(function (result) {
          assert.equal(result, 2);
      });
  });
});

/*
useful snippets for interactive use in truffle develop console
 LongevityPowerToken.deployed().then(function(instance) {return instance.totalSupply});
 LongevityPowerToken.deployed().then(function(instance) {return instance.mint(web3.eth.accounts[0], 10000)});
 LongevityPowerToken.deployed().then(function(instance) {return instance.mint(web3.eth.accounts[1], 10000, {from: web3.eth.accounts[1]})});
LongevityPowerToken.deployed().then(function(instance) {return instance.owner()});
LongevityPowerToken.deployed().then(function(instance) {return instance.mintingFinished()});
LongevityPowerToken.deployed().then(function(instance) {return instance.finishMinting()});
LongevityPowerToken.deployed().then(function(instance) {return instance.mint(web3.eth.accounts[0], 10000)});
LongevityPowerToken.deployed().then(function(instance) {return instance.balanceOf.call(web3.eth.accounts[0])});
*/