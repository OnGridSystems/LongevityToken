var LongevityCrowdsale = artifacts.require("LongevityCrowdsale");

contract('LongevityCrowdsale', function (accounts) {
  it('Acc1 is initial owner by constructor', function () {
    return LongevityCrowdsale.deployed().then(function (instance) {
      return instance.owners(accounts[0]);
    }).then(function (result) {
      assert.equal(result, true);
    });
  });
  it('Acc9 (nobody) can\'t add owners', function () {
    return LongevityCrowdsale.deployed().then(function (instance) {
      return instance.addOwner(accounts[1], {from: accounts[9]});
    }).then(assert.fail)
      .catch(function (error) {
        assert.isAbove(error.message.search('VM Exception while processing transaction'), -1, 'revert must be returned')
      });
  });
  it('Acc0 (owner by constructor) can add Acc1 as a new owner', function () {
    return LongevityCrowdsale.deployed().then(function (instance) {
      return instance.addOwner(accounts[1]);
    }).then(function (result) {
      assert.equal(result['logs'][0]['event'], 'OwnerAdded');
    });
  });
  it('Acc1 (new owner) can add Acc2 to owners', function () {
    return LongevityCrowdsale.deployed().then(function (instance) {
      return instance.addOwner(accounts[2], {from: accounts[1]});
    }).then(function (result) {
      assert.equal(result['logs'][0]['event'], 'OwnerAdded');
    });
  });
  it('Acc1 (owner) removes Acc0 from owners', function () {
    return LongevityCrowdsale.deployed().then(function (instance) {
      return instance.delOwner(accounts[0], {from: accounts[1]});
    }).then(function (result) {
      assert.equal(result['logs'][0]['event'], 'OwnerRemoved');
    });
  });
  it('Acc1 (owner) removes Acc2 from owners and becomes single owner', function () {
    return LongevityCrowdsale.deployed().then(function (instance) {
      return instance.delOwner(accounts[2], {from: accounts[1]});
    }).then(function (result) {
      assert.equal(result['logs'][0]['event'], 'OwnerRemoved');
    });
  });
  it('Verify Acc0 is not an owner via getter', function () {
    return LongevityCrowdsale.deployed().then(function (instance) {
      return instance.owners(accounts[0]);
    }).then(function (result) {
      assert.equal(result, false);
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