var LongevityCrowdsale = artifacts.require("LongevityCrowdsale");
var LongevityToken = artifacts.require("LongevityToken");

contract('LongevityCrowdsale', function (accounts) {
  it('Correct wallet collecting ethers', function () {
    return LongevityCrowdsale.deployed().then(function (instance) {
      return instance.wallet();
    }).then(function (result) {
      assert.equal(result, accounts[6]);
    });
  });
  it('Owner is msg sender', function () {
    return LongevityCrowdsale.deployed().then(function (instance) {
      return instance.owners.call(accounts[0]);
    }).then(function (result) {
      assert.equal(result, true);
    });
  });
  it('Discount equals 40%', function () {
      return LongevityCrowdsale.deployed().then(function (instance) {
          return instance.bonusPercent();
      }).then(function (result) {
          assert.equal(result, 40);
      });
  });
  it('Token is correct', function () {
    return LongevityCrowdsale.deployed().then(function (instance) {
      return instance.token();
    }).then(function (result) {
      assert.equal(result, LongevityToken.address);
    });
  });
  it('Price equals to initialized on construction value', function () {
    return LongevityCrowdsale.deployed().then(function (instance) {
      return instance.priceUSDcETH();
    }).then(function (result) {
      assert.equal(result, 70896);
    });
  });
  it('calculateUSDcAmount with view function for 0.2356151 Ether', function () {
    return LongevityCrowdsale.deployed().then(function (instance) {
      return instance.calculateUSDcAmount(0.2356151 * 1e18);
    }).then(function (result) {
      assert.equal(result, 16704);
    });
  });
  it('calculateTokenAmount with view function for 0.2356151 Ether (with bonus)', function () {
    return LongevityCrowdsale.deployed().then(function (instance) {
      return instance.calculateTokenAmount(0.2356151 * 1e18);
    }).then(function (result) {
      assert.equal(result, 23385);
    });
  });
  it('Check weiRaised == 0', function () {
    return LongevityCrowdsale.deployed().then(function (instance) {
      return instance.weiRaised();
    }).then(function (result) {
      assert.equal(result, 0);
    });
  });
  /*
  it('Non-owner prohibited to update rate', function () {
    return LongevityCrowdsale.deployed().then(function (instance) {
      return instance.setRate(130672, {from: accounts[1]});
    }).catch(function (error) {
      assert.isAbove(error.message.search('VM Exception while processing transaction'), -1, 'revert must be returned')
    });
  });
  */
  it('Send less than 100 USD to fallback function', function () {
    return LongevityCrowdsale.deployed().then(function (instance) {
      return instance.sendTransaction({value: 141051681336000000, gas: 300000});
    }).then(assert.fail)
      .catch(function (error) {
      assert.isAbove(error.message.search('VM Exception while processing transaction'), -1, 'revert must be returned')
    });
  });
  it('Send more than 100 USD to fallback function', function () {
    return LongevityCrowdsale.deployed().then(function (instance) {
      return instance.sendTransaction({value: 141051681337000000, gas: 300000});
    }).then(function (result) {
      assert.equal(result['logs'][0]['event'], 'TokenPurchase');
    });
  });
  it('Nobody including owner Acc0 unable to update rate if not in oracles list', function () {
    return LongevityCrowdsale.deployed().then(function (instance) {
      return instance.setPrice(70897, {from: accounts[0]});
    }).then(assert.fail)
      .catch(function (error) {
        assert.isAbove(error.message.search('VM Exception while processing transaction'), -1, 'revert must be returned')
      });
  });
  it('Acc1 unable to update rate if not in oracles list', function () {
    return LongevityCrowdsale.deployed().then(function (instance) {
      return instance.setPrice(70897, {from: accounts[1]});
    }).then(assert.fail)
      .catch(function (error) {
        assert.isAbove(error.message.search('VM Exception while processing transaction'), -1, 'revert must be returned')
      });
  });
  it('Acc1(nobody) unable to add entry to Price Oracles list', function () {
    return LongevityCrowdsale.deployed().then(function (instance) {
      return instance.addOracle(accounts[2], {from: accounts[1]});
    }).then(assert.fail)
      .catch(function (error) {
        assert.isAbove(error.message.search('VM Exception while processing transaction'), -1, 'revert must be returned')
      });
  });
  it('Acc0(owner) able to add Acc1 to Price Oracles list', function () {
    return LongevityCrowdsale.deployed().then(function (instance) {
      return instance.addOracle(accounts[1], {from: accounts[0]});
    }).then(function (result) {
      assert.equal(result['logs'][0]['event'], 'PriceOracleAdded');
    });
  });
  it('Acc1(oracle) unable to update price out of allowed limit up', function () {
    return LongevityCrowdsale.deployed().then(function (instance) {
      return instance.setPrice(78000, {from: accounts[1]});
    }).then(assert.fail)
      .catch(function (error) {
        assert.isAbove(error.message.search('VM Exception while processing transaction'), -1, 'revert must be returned')
      });
  });
  it('Acc1(oracle) unable to update price out of allowed limit down', function () {
    return LongevityCrowdsale.deployed().then(function (instance) {
      return instance.setPrice(63000, {from: accounts[1]});
    }).then(assert.fail)
      .catch(function (error) {
        assert.isAbove(error.message.search('VM Exception while processing transaction'), -1, 'revert must be returned')
      });
  });
  it('Acc1(oracle) updates price in allowed limit up', function () {
    return LongevityCrowdsale.deployed().then(function (instance) {
      return instance.setPrice(77500, {from: accounts[1]});
    }).then(function (result) {
      assert.equal(result['logs'][0]['event'], 'PriceUpdated');
    });
  });
/*
  it('Owner updates rate in allowed limits +9%', function () {
    return LongevityCrowdsale.deployed().then(function (instance) {
      return instance.setRate(142431);
    }).then(function (result) {
      assert.equal(result['logs'][0]['event'], 'RateUpdate');
    });
  });
  it('Check rate after allowed update', function () {
    return LongevityCrowdsale.deployed().then(function (instance) {
      return instance.rateUSDcETH();
    }).then(function (result) {
      assert.equal(result, 142431);
    });
  });
  it('Owner updates rate in non-allowed limits +11%', function () {
    return LongevityCrowdsale.deployed().then(function (instance) {
      return instance.setRate(158098);
    }).catch(function (error) {
      assert.isAbove(error.message.search('VM Exception while processing transaction'), -1, 'revert must be returned')
    });
  });
  it('Rate shouldnt change after err. update', function () {
    return LongevityCrowdsale.deployed().then(function (instance) {
      return instance.rateUSDcETH();
    }).then(function (result) {
      assert.equal(result, 142431);
    });
  });
  it('Owner updates rate in allowed limits -9%', function () {
    return LongevityCrowdsale.deployed().then(function (instance) {
      return instance.setRate(129612);
    }).then(function (result) {
      assert.equal(result['logs'][0]['event'], 'RateUpdate');
    });
  });
  it('Check rate after approved update', function () {
    return LongevityCrowdsale.deployed().then(function (instance) {
      return instance.rateUSDcETH();
    }).then(function (result) {
      assert.equal(result, 129612);
    });
  });
  it('Owner updates rate in non-allowed limits -11%', function () {
    return LongevityCrowdsale.deployed().then(function (instance) {
      return instance.setRate(115354);
    }).catch(function (error) {
      assert.isAbove(error.message.search('VM Exception while processing transaction'), -1, 'revert must be returned')
    });
  });
  it('Rate shouldnt change after err. update', function () {
    return LongevityCrowdsale.deployed().then(function (instance) {
      return instance.rateUSDcETH();
    }).then(function (result) {
      assert.equal(result, 129612);
    });
  });
  it('Non-owner prohibited to update bots list', function () {
      return LongevityCrowdsale.deployed().then(function (instance) {
          return instance.addBot(accounts[1], {from: accounts[1]});
      }).catch(function (error) {
          assert.isAbove(error.message.search('VM Exception while processing transaction'), -1, 'revert must be returned')
      });
  });
  it('Owner adds Acc1 as the bot', function () {
      return LongevityCrowdsale.deployed().then(function (instance) {
          return instance.addBot(accounts[1]);
      }).then(function (result) {
          assert.equal(result['logs'][0]['event'], 'BotAdded');
      });
  });
  it('Bot updates rate in allowed limits +9%', function () {
      return LongevityCrowdsale.deployed().then(function (instance) {
          return instance.setRate(141276, {from: accounts[1]});
      }).then(function (result) {
          assert.equal(result['logs'][0]['event'], 'RateUpdate');
      });
  });
  it('Check rate after allowed update', function () {
      return LongevityCrowdsale.deployed().then(function (instance) {
          return instance.rateUSDcETH();
      }).then(function (result) {
          assert.equal(result, 141276, {from: accounts[1]});
      });
  });
  it('Owner removes himself from bots list', function () {
      return LongevityCrowdsale.deployed().then(function (instance) {
          return instance.delBot(accounts[0]);
      }).then(function (result) {
          assert.equal(result['logs'][0]['event'], 'BotRemoved');
      });
  });
  it('Just removed bot (Ex-owner) prohibited to update rate', function () {
      return LongevityCrowdsale.deployed().then(function (instance) {
          return instance.setRate(141277);
      }).catch(function (error) {
          assert.isAbove(error.message.search('VM Exception while processing transaction'), -1, 'revert must be returned')
      });
  });
  it('Check rate didnt change after err. update', function () {
      return LongevityCrowdsale.deployed().then(function (instance) {
          return instance.rateUSDcETH();
      }).then(function (result) {
          assert.equal(result, 141276);
      });
  });
  it('Non-owner prohibited to update wallet', function () {
      return LongevityCrowdsale.deployed().then(function (instance) {
          return instance.setWallet(accounts[3], {from: accounts[1]});
      }).catch(function (error) {
          assert.isAbove(error.message.search('VM Exception while processing transaction'), -1, 'revert must be returned')
      });
  });
  it('Wallet collecting ethers not changed after err update', function () {
      return LongevityCrowdsale.deployed().then(function (instance) {
          return instance.wallet();
      }).then(function (result) {
          assert.equal(result, accounts[0]);
      });
  });
 */
});
