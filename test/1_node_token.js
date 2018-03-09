var LongevityToken = artifacts.require('LongevityToken');

contract('LongevityToken', function (accounts) {
  it('Check initial', function () {
    return LongevityToken.deployed().then(function (instance) {
      return instance.totalSupply();
    }).then(function (result) {
      assert.equal(result, 0, 'Incorrect totalSupply');
    });
  });
  it('Acc0 (owner by constructor) can\'t mint tokens to himself until it added to minters', function () {
    return LongevityToken.deployed().then(function (instance) {
      return instance.mint(accounts[0], 10000);
    }).catch(function (error) {
      assert.isAbove(error.message.search('VM Exception while processing transaction'), -1, 'revert must be returned')
    });
  });
  it('Acc0 (owner by constructor) can\'t mint tokens to non-owners', function () {
    return LongevityToken.deployed().then(function (instance) {
      return instance.mint(accounts[1], 500);
    }).catch(function (error) {
      assert.isAbove(error.message.search('VM Exception while processing transaction'), -1, 'revert must be returned')
    });
  });
  it('Acc9 (nobody) can\'t mint tokens', function () {
    return LongevityToken.deployed().then(function (instance) {
      return instance.mint(accounts[0], 10000, {from: accounts[9]});
    }).catch(function (error) {
      assert.isAbove(error.message.search('VM Exception while processing transaction'), -1, 'revert must be returned')
    });
  });
  it('Acc9 (nobody) can\'t add owners', function () {
    return LongevityToken.deployed().then(function (instance) {
      return instance.addOwner(accounts[1], {from: accounts[9]});
    }).catch(function (error) {
      assert.isAbove(error.message.search('VM Exception while processing transaction'), -1, 'revert must be returned')
    });
  });
  it('Acc0 (owner by constructor) can add Acc1 as a new owner', function () {
    return LongevityToken.deployed().then(function (instance) {
      return instance.addOwner(accounts[1]);
    }).then(function (result) {
      assert.equal(result['logs'][0]['event'], 'OwnerAdded');
    });
  });
  it('Acc1 (new owner) can add Acc2 to owners', function () {
    return LongevityToken.deployed().then(function (instance) {
      return instance.addOwner(accounts[2], {from: accounts[1]});
    }).then(function (result) {
      assert.equal(result['logs'][0]['event'], 'OwnerAdded');
    });
  });
  it('Acc9 (nobody) can\'t mint tokens', function () {
    return LongevityToken.deployed().then(function (instance) {
      return instance.mint(accounts[0], 10000, {from: accounts[9]});
    }).catch(function (error) {
      assert.isAbove(error.message.search('VM Exception while processing transaction'), -1, 'revert must be returned')
    });
  });
  it('Acc0 (owner) can\'t mint tokens until add himself to minters', function () {
    return LongevityToken.deployed().then(function (instance) {
      return instance.mint(accounts[0], 10000, {from: accounts[0]});
    }).catch(function (error) {
      assert.isAbove(error.message.search('VM Exception while processing transaction'), -1, 'revert must be returned')
    });
  });
  it('Acc1 (owner) can\'t mint tokens until add himself to minters', function () {
    return LongevityToken.deployed().then(function (instance) {
      return instance.mint(accounts[0], 10000, {from: accounts[1]});
    }).catch(function (error) {
      assert.isAbove(error.message.search('VM Exception while processing transaction'), -1, 'revert must be returned')
    });
  });
  it('Acc1 (owner) can add Acc0 to miners', function () {
    return LongevityToken.deployed().then(function (instance) {
      return instance.addMinter(accounts[0], {from: accounts[1]});
    }).then(function (result) {
      assert.equal(result['logs'][0]['event'], 'MinterAdded');
    });
  });
  it('Acc0 (owner, minter) can add Acc3 (nobody) as minter', function () {
    return LongevityToken.deployed().then(function (instance) {
      return instance.addMinter(accounts[3], {from: accounts[0]});
    }).then(function (result) {
      assert.equal(result['logs'][0]['event'], 'MinterAdded');
    });
  });
  it('First Acc0 (owner, minter) now able to mint to himself', function () {
    return LongevityToken.deployed().then(function (instance) {
      return instance.mint(accounts[0], 12345, {from: accounts[0]});
    }).then(function (result) {
      assert.equal(result['logs'][0]['event'], 'Mint');
    });
  });
  it('Acc0 (owner, minter) balance equals to just-minted value', function () {
    return LongevityToken.deployed().then(function (instance) {
      return instance.balanceOf(accounts[0]);
    }).then(function (result) {
      assert.equal(result, 12345);
    });
  });
  it('Acc0 (owner, minter) able to mint to Acc7 (nobody)', function () {
    return LongevityToken.deployed().then(function (instance) {
      return instance.mint(accounts[7], 36754, {from: accounts[0]});
    }).then(function (result) {
      assert.equal(result['logs'][0]['event'], 'Mint');
    });
  });
  it('Acc0 (owner, minter) can transfer tokens to another Acc9', function () {
    return LongevityToken.deployed().then(function (instance) {
      return instance.transfer(accounts[9], 4000);
    }).then(function (result) {
      assert.equal(result['logs'][0]['event'], 'Transfer');
    });
  });
  it('Acc9 (holder) can further transfer tokens to Acc8', function () {
    return LongevityToken.deployed().then(function (instance) {
      return instance.transfer(accounts[8], 3000,{from: accounts[9]});
    }).then(function (result) {
      assert.equal(result['logs'][0]['event'], 'Transfer', 'Incorrect result of transfer');
    });
  });
  it('Acc9 (holder) unable to transfer more than its balance', function () {
    return LongevityToken.deployed().then(function (instance) {
      return instance.transfer(accounts[7], 1001,{from: accounts[9]});
    }).catch(function (error) {
      assert.isAbove(error.message.search('VM Exception while processing transaction'), -1, 'revert must be returned')
    });
  });
  it('Acc9 (holder) unable to burn more than it has', function () {
    return LongevityToken.deployed().then(function (instance) {
      return instance.burn(1001,{from: accounts[9]});
    }).catch(function (error) {
      assert.isAbove(error.message.search('VM Exception while processing transaction'), -1, 'revert must be returned')
    });
  });
  it('Acc9 (holder) able to burn all its balance', function () {
    return LongevityToken.deployed().then(function (instance) {
      return instance.burn(1000,{from: accounts[9]});
    }).then(function (result) {
      assert.equal(result['logs'][0]['event'], 'Burn');
    });
  });
  // ToDo overspend tests
  it('Check resulting balance for account', function () {
    return LongevityToken.deployed().then(function (instance) {
      return instance.balanceOf.call(accounts[0]);
    }).then(function (result) {
      assert.equal(result, 8345, 'Incorrect account balance');
    });
  });
  it('Acc0 burns a part of its balance', function () {
    return LongevityToken.deployed().then(function (instance) {
      return instance.burn(5345, {from: accounts[0]});
    }).then(function (result) {
      assert.equal(result['logs'][0]['event'], 'Burn', 'Incorrect result of burning');
    });
  });
  it('Check Acc0 (holder, owner, minter) balance after burning', function () {
    return LongevityToken.deployed().then(function (instance) {
      return instance.balanceOf.call(accounts[0]);
    }).then(function (result) {
      assert.equal(result, 3000, 'Incorrect account balance');
    });
  });
  it('Acc8 (holder) burn part of its tokens', function () {
    return LongevityToken.deployed().then(function (instance) {
      return instance.burn(2222, {from: accounts[8]});
    }).then(function (result) {
      assert.equal(result['logs'][0]['event'], 'Burn', 'Incorrect result of burning');
    });
  });
  it('Check Acc8 (holder) balance after burning', function () {
    return LongevityToken.deployed().then(function (instance) {
      return instance.balanceOf.call(accounts[8]);
    }).then(function (result) {
      assert.equal(result, 3000 - 2222, 'Incorrect account balance');
    });
  });
  it('Acc3 (minter) can\'t remove Acc0 from minters', function () {
    return LongevityToken.deployed().then(function (instance) {
      return instance.delMinter(accounts[0], {from: accounts[3]});
    }).catch(function (error) {
      assert.isAbove(error.message.search('VM Exception while processing transaction'), -1, 'revert must be returned')
    });
  });
  it('Acc2 (owner, minter) removes Acc0 from minters', function () {
    return LongevityToken.deployed().then(function (instance) {
      return instance.delMinter(accounts[0], {from: accounts[2]});
    }).then(function (result) {
      assert.equal(result['logs'][0]['event'], 'MinterRemoved');
    });
  });
  it('Acc0 (owner) can\'t mint tokens to himself after was removed from minters', function () {
    return LongevityToken.deployed().then(function (instance) {
      return instance.mint(accounts[0], 10000);
    }).catch(function (error) {
      assert.isAbove(error.message.search('VM Exception while processing transaction'), -1, 'revert must be returned')
    });
  });
  it('Unprivileged holder can\'t finalize minting', function () {
    return LongevityToken.deployed().then(function (instance) {
      return instance.finishMinting({from: accounts[9]});
    }).catch(function (error) {
      assert.isAbove(error.message.search('VM Exception while processing transaction'), -1, 'revert must be returned')
    });
  });
  it('Minter can\'t finalize minting', function () {
    return LongevityToken.deployed().then(function (instance) {
      return instance.finishMinting({from: accounts[3]});
    }).catch(function (error) {
      assert.isAbove(error.message.search('VM Exception while processing transaction'), -1, 'revert must be returned')
    });
  });
  it('Owner can finalize minting', function () {
    return LongevityToken.deployed().then(function (instance) {
      return instance.finishMinting({from: accounts[2]});
    }).then(function (result) {
      assert.equal(result['logs'][0]['event'], 'MintFinished');
    });
  });
  it('Acc0 (owner + minter) unable to mint for himself after finalization', function () {
    return LongevityToken.deployed().then(function (instance) {
      return instance.mint(accounts[0], 12861, {from: accounts[0]});
    }).catch(function (error) {
      assert.isAbove(error.message.search('VM Exception while processing transaction'), -1, 'revert must be returned')
    });
  });
  it('Acc3 (minter) unable to mint for anybody after finalization', function () {
    return LongevityToken.deployed().then(function (instance) {
      return instance.mint(accounts[6], 51429, {from: accounts[3]});
    }).catch(function (error) {
      assert.isAbove(error.message.search('VM Exception while processing transaction'), -1, 'revert must be returned')
    });
  });
  it('Acc8 (holder) burns part of its tokens again', function () {
    return LongevityToken.deployed().then(function (instance) {
      return instance.burn(212, {from: accounts[8]});
    }).then(function (result) {
      assert.equal(result['logs'][0]['event'], 'Burn', 'Incorrect result of burning');
    });
  });
  it('Check Acc8 (holder) balance after one more burning', function () {
    return LongevityToken.deployed().then(function (instance) {
      return instance.balanceOf.call(accounts[8]);
    }).then(function (result) {
      assert.equal(result, 3000 - 2222 - 212, 'Incorrect account balance');
    });
  });
  it('Acc3 (minter) can\'t remove Acc0 from owners', function () {
    return LongevityToken.deployed().then(function (instance) {
      return instance.delOwner(accounts[0], {from: accounts[3]});
    }).catch(function (error) {
      assert.isAbove(error.message.search('VM Exception while processing transaction'), -1, 'revert must be returned')
    });
  });
  it('Acc9 (holder) can\'t remove Acc0 from owners', function () {
    return LongevityToken.deployed().then(function (instance) {
      return instance.delOwner(accounts[0], {from: accounts[9]});
    }).catch(function (error) {
      assert.isAbove(error.message.search('VM Exception while processing transaction'), -1, 'revert must be returned')
    });
  });
  it('Acc2 (owner) removes Acc0 from owners', function () {
    return LongevityToken.deployed().then(function (instance) {
      return instance.delOwner(accounts[0], {from: accounts[2]});
    }).then(function (result) {
      assert.equal(result['logs'][0]['event'], 'OwnerRemoved');
    });
  });
  it('Acc1 (owner) removes Acc2 from owners and becomes single owner', function () {
    return LongevityToken.deployed().then(function (instance) {
      return instance.delOwner(accounts[2], {from: accounts[1]});
    }).then(function (result) {
      assert.equal(result['logs'][0]['event'], 'OwnerRemoved');
    });
  });
  it('Acc8 (holder) unable approve more than its balance', function () {
    return LongevityToken.deployed().then(function (instance) {
      return instance.approve(accounts[7], 567,{from: accounts[9]});
    }).catch(function (error) {
      assert.isAbove(error.message.search('VM Exception while processing transaction'), -1, 'revert must be returned')
    });
  });
  it('Check Acc7 (spender) has no approval to transfer from Acc8 (holder)', function () {
    return LongevityToken.deployed().then(function (instance) {
      return instance.allowance.call(accounts[8],accounts[7]);
    }).then(function (result) {
      assert.equal(result, 0);
    });
  });
  it('Acc7 (spender) is unable to transfer non-approved money', function () {
    return LongevityToken.deployed().then(function (instance) {
      return instance.transferFrom(accounts[8], accounts[5], 567, {from: accounts[7]});
    }).catch(function (error) {
      assert.isAbove(error.message.search('VM Exception while processing transaction'), -1, 'revert must be returned')
    });
  });
  it('Acc8 (holder) is able to approve to Acc7 its balance', function () {
    return LongevityToken.deployed().then(function (instance) {
      return instance.approve(accounts[7], 566,{from: accounts[8]});
    }).then(function (result) {
      assert.equal(result['logs'][0]['event'], 'Approval');
    });
  });
  it('Check Acc7 (spender) approval to transfer from Acc8 (holder)', function () {
    return LongevityToken.deployed().then(function (instance) {
      return instance.allowance.call(accounts[8],accounts[7]);
    }).then(function (result) {
      assert.equal(result, 566);
    });
  });
  // ToDo decrease approval
  it('Acc7 (spender) is able to transfer part of approved money', function () {
    return LongevityToken.deployed().then(function (instance) {
      return instance.transferFrom(accounts[8], accounts[5], 500, {from: accounts[7]});
    }).then(function (result) {
      assert.equal(result['logs'][0]['event'], 'Transfer');
    });
  });
  it('Acc7 (holder) is unable to transfer money more than approved', function () {
    return LongevityToken.deployed().then(function (instance) {
      return instance.transferFrom(accounts[8], accounts[5], 67, {from: accounts[7]});
    }).catch(function (error) {
      assert.isAbove(error.message.search('VM Exception while processing transaction'), -1, 'revert must be returned')
    });
  });
  it('Acc7 (holder) is able to transfer remaining approved money', function () {
    return LongevityToken.deployed().then(function (instance) {
      return instance.transferFrom(accounts[8], accounts[5], 66, {from: accounts[7]});
    }).then(function (result) {
      assert.equal(result['logs'][0]['event'], 'Transfer');
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