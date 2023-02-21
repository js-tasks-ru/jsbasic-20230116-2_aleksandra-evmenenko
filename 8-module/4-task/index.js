/* eslint-disable no-unused-expressions */
import createElement from '../../assets/lib/create-element.js';
import escapeHtml from '../../assets/lib/escape-html.js';

import Modal from '../../7-module/2-task/index.js';

export default class Cart {
  cartItems = []; // [product: {...}, count: N]

  constructor(cartIcon) {
    this.cartIcon = cartIcon;

    this.addEventListeners();
  }

  addProduct(product) {
    let cartItems = this.cartItems.find(item => item.product.id === product.id);
    if (!cartItems) {
      cartItems = {
        product,
        count: 1,
      };

      this.cartItems.push(cartItems);
    }
    else {
      cartItems.count++;
    }
    this.onProductUpdate(cartItems);
  }

  updateProductCount(productId, amount) {
    let cartItems = this.cartItems.find(item => item.product.id === productId);
    amount < 1 ? cartItems.count-- : cartItems.count++;
    if (!cartItems) {return;}
    if (cartItems.count === 0) {
      this.cartItems.splice(this.cartItems.indexOf(cartItems), 1);
    }
    this.onProductUpdate(cartItems);
  }

  isEmpty() {
    return this.cartItems.length === 0;
  }

  getTotalCount() {
    return this.cartItems.reduce((totalCount, item) => totalCount + item.count, 0);
  }

  getProdPrice(cartItem) {
    let sum = cartItem.product.price * cartItem.count;
    return `€${sum.toFixed(2)}`;
  }

  getTotalPrice() {
    return this.cartItems.reduce((totalPrice, item) => totalPrice + item.product.price * item.count, 0);
  }

  renderProduct(product, count) {
    return createElement(`
    <div class="cart-product" data-product-id="${product.id}">
      <div class="cart-product__img">
        <img src="/assets/images/products/${product.image}" alt="product">
      </div>
      <div class="cart-product__info">
        <div class="cart-product__title">${escapeHtml(product.name)}</div>
        <div class="cart-product__price-wrap">
          <div class="cart-counter">
            <button type="button" class="cart-counter__button cart-counter__button_minus">
              <img src="/assets/images/icons/square-minus-icon.svg" alt="minus">
            </button>
            <span class="cart-counter__count">${count}</span>
            <button type="button" class="cart-counter__button cart-counter__button_plus">
              <img src="/assets/images/icons/square-plus-icon.svg" alt="plus">
            </button>
          </div>
          <div class="cart-product__price">€${product.price.toFixed(2)}</div>
        </div>
      </div>
    </div>`);
  }

  renderOrderForm() {
    return createElement(`<form class="cart-form">
      <h5 class="cart-form__title">Delivery</h5>
      <div class="cart-form__group cart-form__group_row">
        <input name="name" type="text" class="cart-form__input" placeholder="Name" required value="Santa Claus">
        <input name="email" type="email" class="cart-form__input" placeholder="Email" required value="john@gmail.com">
        <input name="tel" type="tel" class="cart-form__input" placeholder="Phone" required value="+1234567">
      </div>
      <div class="cart-form__group">
        <input name="address" type="text" class="cart-form__input" placeholder="Address" required value="North, Lapland, Snow Home">
      </div>
      <div class="cart-buttons">
        <div class="cart-buttons__buttons btn-group">
          <div class="cart-buttons__info">
            <span class="cart-buttons__info-text">total</span>
            <span class="cart-buttons__info-price">€${this.getTotalPrice().toFixed(2)}</span>
          </div>
          <button type="submit" class="cart-buttons__button btn-group__button button">order</button>
        </div>
      </div>
    </form>`);
  }

  renderModal() {
    this.modal = new Modal();
    this.modalBody = createElement('<div>');
    this.cartItems.map(item =>
      this.modalBody.append(this.renderProduct(item.product, item.count))
    );
    this.modalBody.append(this.renderOrderForm());

    this.modalBody.addEventListener('click', this.onModalBodyChange);
    this.modalBody.querySelector('.cart-form').onsubmit = (event) => this.onSubmit(event);

    this.modal.setTitle('Your order');
    this.modal.setBody(this.modalBody);
    this.modal.open();
  }

  onModalBodyChange = (event) => {
    if (event.target.closest('.cart-counter__button')) {
      let prodId = event.target.closest('.cart-product').dataset.productId;
      if (event.target.closest('.cart-counter__button_minus')) {
        this.updateProductCount(prodId, -1);
      }
      if (event.target.closest('.cart-counter__button_plus')) {
        this.updateProductCount(prodId, 1);
      }
    }
  }

  onProductUpdate = (cartItem) => {
    if (document.body.classList.contains('is-modal-open')) {
      this.onCartModalUpdate(cartItem);
    }

    this.cartIcon.update(this);
  }

  onCartModalUpdate(cartItem) {
    let productId = cartItem.product.id;
    let modalBody = this.modalBody;
    let product = modalBody.querySelector(`[data-product-id="${productId}"]`);
    let productCount = modalBody.querySelector(`[data-product-id="${productId}"] .cart-counter__count`);
    let productPrice = modalBody.querySelector(`[data-product-id="${productId}"] .cart-product__price`);
    let infoPrice = modalBody.querySelector(`.cart-buttons__info-price`);

    if (this.cartItems.length == 0) {
      this.modal.close();
      return false;
    }

    if (cartItem.count === 0) {
      product.remove();
    } else {
      productCount.innerHTML = cartItem.count;
      productPrice.innerHTML = this.getProdPrice(cartItem);
      infoPrice.innerHTML = `€${this.getTotalPrice().toFixed(2)}`;
    }
  }

  async onSubmit(event) {
    event.preventDefault();
    let formElem = this.modalBody.querySelector('.cart-form');
    let formBtn = this.modalBody.querySelector('[type=submit]');
    let url = 'https://httpbin.org/post';
    formBtn.classList.add('is-loading');

    let response = await fetch(url, {
      method: 'POST',
      body: new FormData(formElem)
    });

    if (!response.ok) {
      throw new Error(`Ошибка по адресу ${url}, статус ошибки ${response.status}`);
    } else {
      formBtn.classList.remove('is-loading');
      this.modal.setTitle("Success!");
      this.cartItems = [];
      this.cartIcon.update(this);
      this.modalBody.innerHTML = `
      <div class="modal__body-inner">
        <p>
          Order successful! Your order is being cooked :) <br>
          We’ll notify you about delivery time shortly.<br>
          <img src="/assets/images/delivery.gif">
        </p>
      </div>`;
    }
  }

  addEventListeners() {
    this.cartIcon.elem.onclick = () => this.renderModal();
  }
}

