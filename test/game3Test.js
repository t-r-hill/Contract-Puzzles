const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');

describe('Game3', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game3');
    const game = await Game.deploy();

    // Hardhat will create 10 accounts for you by default
    // you can get one of this accounts with ethers.provider.getSigner
    // and passing in the zero-based indexed of the signer you want:
    const [deployer, address1, address2, address3 ] = await ethers.getSigners();

    // you can get that signer's address via .getAddress()
    // this variable is NOT used for Contract 3, just here as an example

    return { game, deployer, address1, address2, address3 };
  }

  it('should be a winner', async function () {
    const { game, deployer, address1, address2, address3 } = await loadFixture(deployContractAndSetVariables);

    // you'll need to update the `balances` mapping to win this stage

    // to call a contract as a signer you can use contract.connect
    await game.connect(address3).buy({ value: '1' });
    await game.connect(address1).buy({ value: '2' });
    await game.connect(address2).buy({ value: '3' });

    // TODO: win expects three arguments
    await game.win(address1.getAddress(), address2.getAddress(), address3.getAddress());

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
