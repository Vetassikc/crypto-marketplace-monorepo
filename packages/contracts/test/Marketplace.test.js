const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Marketplace Contract V2", function () {
  let Marketplace, marketplace, owner, seller, buyer;

  beforeEach(async function () {
    [owner, seller, buyer] = await ethers.getSigners();
    Marketplace = await ethers.getContractFactory("Marketplace");
    marketplace = await Marketplace.deploy();
    await marketplace.waitForDeployment();
  });

  describe("Seller Management", function () {
    it("Should allow the owner to register a new seller", async function () {
      await expect(marketplace.connect(owner).registerSeller(seller.address))
        .to.emit(marketplace, "SellerRegistered")
        .withArgs(seller.address);
      expect(await marketplace.isSellerRegistered(seller.address)).to.be.true;
    });

    it("Should NOT allow non-owners to register a seller", async function () {
      await expect(
        marketplace.connect(seller).registerSeller(buyer.address)
      ).to.be.revertedWith("Only owner can register sellers.");
    });
  });

  describe("Managing Products", function () {
    beforeEach(async function () {
      // Реєструємо `seller` перед тестами
      await marketplace.connect(owner).registerSeller(seller.address);
    });

    it("Should allow a registered seller to add a product", async function () {
      const productId = 1;
      const price = ethers.parseEther("1");
      await marketplace.connect(seller).addOrUpdateProduct(productId, price);

      const product = await marketplace.products(productId);
      expect(product.id).to.equal(productId);
      expect(product.price).to.equal(price);
      expect(product.seller).to.equal(seller.address);
    });

    it("Should NOT allow an unregistered address to add a product", async function () {
      // `buyer` не є зареєстрованим продавцем
      await expect(
        marketplace.connect(buyer).addOrUpdateProduct(2, ethers.parseEther("2"))
      ).to.be.revertedWith("Only registered sellers can add products.");
    });
  });

  describe("Buying Products", function () {
    const productId = 1;
    const price = ethers.parseEther("1");

    beforeEach(async function () {
      // Продавець реєструється і додає товар
      await marketplace.connect(owner).registerSeller(seller.address);
      await marketplace.connect(seller).addOrUpdateProduct(productId, price);
    });

    it("Should transfer funds directly to the seller upon purchase", async function () {
      // Перевіряємо, що баланс продавця зміниться рівно на суму покупки
      await expect(
        buyer.sendTransaction({
          to: marketplace.target,
          data: marketplace.interface.encodeFunctionData("buyProduct", [productId]),
          value: price
        })
      ).to.changeEtherBalance(seller, price);

      // Баланс контракту має залишатися 0
      expect(await ethers.provider.getBalance(marketplace.target)).to.equal(0);
    });

    it("Should fail if incorrect amount is sent", async function () {
      const wrongPrice = ethers.parseEther("0.5");
      await expect(
         buyer.sendTransaction({
          to: marketplace.target,
          data: marketplace.interface.encodeFunctionData("buyProduct", [productId]),
          value: wrongPrice
        })
      ).to.be.revertedWith("Incorrect ETH amount sent.");
    });
  });
});