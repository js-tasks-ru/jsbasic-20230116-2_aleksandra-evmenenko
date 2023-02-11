import createElement from '../../assets/lib/create-element.js';

export default class Carousel {
  constructor(slides) {
    this.slides = slides;
    this.container = document.createElement('div');
    this.container.classList.add('carousel');

    this.carouselInner = document.createElement('div');
    this.carouselInner.classList.add('carousel__inner');
    this.slides.forEach(element => this.carouselInner.append(this.render(element)));

    this.container.append(this.arrowRight());
    this.container.append(this.arrowLeft());
    this.container.append(this.carouselInner);

    this.elem = this.container;

    this.elem.addEventListener('click', this.clickHandler.bind(this));

    this.position = 0;
  }
  render(item) {

    const carouselSlide = createElement(`
<div class="carousel__slide" data-id=${item.id}>
  <img src="/assets/images/carousel/${item.image}" class="carousel__img" alt="slide">
  <div class="carousel__caption">
    <span class="carousel__price">€${item.price}</span>
    <div class="carousel__title">${item.name}</div>
    <button type="button" class="carousel__button">
      <img src="/assets/images/icons/plus-icon.svg" alt="icon">
    </button>
  </div>
</div>
`);
    return carouselSlide;

  }

  arrowRight () {

    const arrow = createElement(`
    <div class="carousel__arrow carousel__arrow_right">
      <img src="/assets/images/icons/angle-icon.svg" alt="icon">
    </div>
    `);

    return arrow;
  }

  arrowLeft () {

    const arrow = createElement(`
    <div style = "display: none" class="carousel__arrow carousel__arrow_left">
      <img src="/assets/images/icons/angle-left-icon.svg" alt="icon">
    </div>
    `);

    return arrow;
  }

  clickHandler(event) {

    this.rightArrow = document.querySelector('.carousel__arrow_right');
    this.leftArrow = document.querySelector('.carousel__arrow_left');


    if (event.target.closest('.carousel__button')) {
      this.elem.dispatchEvent(new CustomEvent("product-add", {
        detail: event.target.closest('.carousel__slide').dataset.id, 
        bubbles: true 
      }));
    } 

    this.slidesAmount = this.carouselInner.childElementCount;

    if (event.target.closest('.carousel__arrow_right')) {
      if (this.position < ((this.slidesAmount - 1) * this.carouselInner.offsetWidth)) {
        this.position += this.carouselInner.offsetWidth;
        this.carouselInner.style.transform = `translateX(-${this.position}px)`;
        this.leftArrow.style.display = '';
      }

      if (this.position == ((this.slidesAmount - 1) * this.carouselInner.offsetWidth)) {this.rightArrow.style.display = 'none';}
    } 

    if (event.target.closest(".carousel__arrow_left")) {
      if (this.position > 0) {
        this.position -= this.carouselInner.offsetWidth;
        this.carouselInner.style.transform = `translateX(-${this.position}px)`;
        this.rightArrow.style.display = '';
      }

      if (this.position === 0) {this.leftArrow.style.display = 'none';}
    }
  }

}