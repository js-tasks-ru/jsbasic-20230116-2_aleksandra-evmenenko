import Carousel from '../../6-module/3-task/index.js';
import slides from '../../6-module/3-task/slides.js';

import RibbonMenu from '../../7-module/1-task/index.js';
import categories from '../../7-module/1-task/categories.js';

import StepSlider from '../../7-module/4-task/index.js';
import ProductsGrid from '../../8-module/2-task/index.js';

import CartIcon from '../../8-module/1-task/index.js';
import Cart from '../../8-module/4-task/index.js';

export default class Main {

  constructor() {
    let carousel = new Carousel(slides);
    let containerElement = document.body.querySelector('[data-carousel-holder]');
    containerElement.append(carousel.elem);

    this.ribbonMenu = new RibbonMenu(categories);
    let container = document.querySelector('[data-ribbon-holder]');
    container.append(this.ribbonMenu.elem);

    this.stepSlider = new StepSlider({
      steps: 5,
      value: 3,
    });
    document.querySelector('[data-slider-holder]').append(this.stepSlider.elem);

    let cartIcon = new CartIcon();
    let cartIconHolder = document.querySelector('[data-cart-icon-holder]');
    cartIconHolder.append(cartIcon.elem);

    this.cart = new Cart(cartIcon);

    document.body.addEventListener("product-add", (e) => {
      let productToAdd = this.products.find((product) => product.id === e.detail);
      this.cart.addProduct(productToAdd);
    });

    this.stepSlider.elem.addEventListener("slider-change", (e) => {
      this.productsGrid.updateFilter({
        maxSpiciness: e.detail // значение остроты из события 'slider-change'
      });
    });

    this.ribbonMenu.elem.addEventListener("ribbon-select", (e) => {
      this.productsGrid.updateFilter({
        category: e.detail // категория из события 'ribbon-select'
      });
    });

    document.querySelector("#nuts-checkbox").addEventListener("change", (e) => {
      this.productsGrid.updateFilter({
        noNuts: e.target.checked // новое значение чекбокса
      });
    });

    document.querySelector("#vegeterian-checkbox").addEventListener("change", (e) => {
      this.productsGrid.updateFilter({
        vegeterianOnly: e.target.checked // новое значение чекбокса
      });
    });
  }

  async render() {
    this.products = await fetch("products.json").then((response) => {
      return response.json();
    });
    this.productsGrid = new ProductsGrid(this.products);
    document.querySelector('[data-products-grid-holder]').innerHTML = "";
    document.querySelector('[data-products-grid-holder]').append(this.productsGrid.elem);

    this.productsGrid.updateFilter({
      noNuts: document.getElementById('nuts-checkbox').checked,
      vegeterianOnly: document.getElementById('vegeterian-checkbox').checked,
      maxSpiciness: this.stepSlider.value,
      category: this.ribbonMenu.value
    });
  }
}
