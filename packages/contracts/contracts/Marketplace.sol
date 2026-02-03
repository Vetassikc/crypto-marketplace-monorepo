// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Marketplace {
    address public owner;

    struct Product {
        uint id;
        uint price; // Ціна в wei
        address payable seller; // НОВЕ: Зберігаємо адресу продавця
    }

    // НОВЕ: Словник для відстеження зареєстрованих продавців
    mapping(address => bool) public isSellerRegistered;

    mapping(uint => Product) public products;

    // НОВЕ: Події для реєстрації продавців та покупок
    event SellerRegistered(address seller);
    event ProductSold(address buyer, address seller, uint productId, uint price);

    constructor() {
        owner = msg.sender;
    }

    // НОВЕ: Функція для реєстрації продавця (тільки власник маркетплейсу)
    // Ось тут і буде зв'язок з KYC. Ти викликаєш цю функцію для тих, хто пройшов перевірку.
    function registerSeller(address _sellerAddress) external {
        require(msg.sender == owner, "Only owner can register sellers.");
        isSellerRegistered[_sellerAddress] = true;
        emit SellerRegistered(_sellerAddress);
    }

    // ОНОВЛЕНО: Тепер цю функцію можуть викликати лише зареєстровані продавці
    function addOrUpdateProduct(uint _productId, uint _priceInWei) external {
        require(isSellerRegistered[msg.sender], "Only registered sellers can add products.");
        products[_productId] = Product(_productId, _priceInWei, payable(msg.sender));
    }

    // ОНОВЛЕНО: Гроші тепер йдуть напряму продавцю
    function buyProduct(uint _productId) external payable {
        Product storage product = products[_productId];
        require(product.price > 0, "Product does not exist.");
        require(msg.value == product.price, "Incorrect ETH amount sent.");
        
        // Переказуємо кошти напряму на гаманець продавця
        product.seller.transfer(msg.value);

        emit ProductSold(msg.sender, product.seller, _productId, msg.value);
    }
    
    // БІЛЬШЕ НЕ ПОТРІБНА: Функція withdraw() видалена, бо гроші не зберігаються на контракті
}