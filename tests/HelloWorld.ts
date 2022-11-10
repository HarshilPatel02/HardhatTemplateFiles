import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai"
import { ethers } from "hardhat";
import { HelloWorld } from "../typechain-types";

describe("HelloWorld", async function () {
    this.timeout(40000)

    let helloWorldContract: HelloWorld;
    let signers: SignerWithAddress[];

    beforeEach(async () => {
        signers = await ethers.getSigners();
        const helloWorldFactory = await ethers.getContractFactory("HelloWorld");
        helloWorldContract = await helloWorldFactory.deploy() as HelloWorld;
        await helloWorldContract.deployed();
    });

    it("Should give a Hello World", async function () {
        const helloWorldFactory = await ethers.getContractFactory("HelloWorld");
        const helloWorldContract = await helloWorldFactory.deploy() as HelloWorld;
        await helloWorldContract.deployed();
        const text = await helloWorldContract.helloWorld();
        expect(text).to.equal("Hello World");
    });

    it("Should set owner to deployer account", async () => {
        const signers = await ethers.getSigners();
        const helloWorldFactory = await ethers.getContractFactory("HelloWorld");
        const helloWorldContract = await helloWorldFactory.deploy();
        await helloWorldContract.deployed();
        const owner = await helloWorldContract.owner();
        const contractDeployer = signers[0].address;
        expect(owner).to.equal(contractDeployer);
    });

    it("Should change text correctly", async () => {
        const newText = "New Text";
        const tx = await helloWorldContract.setText("New Text");
        await tx.wait();
        const text = await helloWorldContract.helloWorld();
        expect(text).to.equal(newText);
    });

    it("Should not allow anyone other than owner to change text", async () => {
        const newText = "New Text";
        await expect(helloWorldContract.connect(signers[1]).setText(newText)).to.be.reverted;
    });
});