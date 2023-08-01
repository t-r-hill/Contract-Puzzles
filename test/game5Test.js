const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');

describe('Game5', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game5');
    const game = await Game.deploy();

    const deployer = await ethers.provider.getSigner(0);

    return { game, deployer };
  }
  it('should be a winner', async function () {
    const { game, deployer } = await loadFixture(deployContractAndSetVariables);
    const threshhold = '0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf';
    let address = '';
    let etherToSend = ethers.utils.parseEther("1.0")

    // good luck
    do {
      let signer = await ethers.Wallet.createRandom();
      address = await signer.getAddress();
      console.log(address);
      if (address < threshhold){
        // send ether to address
        console.log('Deployer address:', await deployer.getAddress());
        console.log('Deployer balance:', await deployer.getBalance());
        console.log('Sending tx:', address, etherToSend);
        tx = await deployer.sendTransaction({
          value: etherToSend,
          to: address
        })
        await tx.wait();
        console.log('Deployer address:', await deployer.getAddress());
        console.log('Deployer balance:', await deployer.getBalance());
        signer = await signer.connect(ethers.provider);
        console.log('Signer address:', await signer.getAddress());
        console.log('Signer balance:', await signer.getBalance());
        await game.connect(signer).win();
      }
    } while (address >= threshhold);

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
