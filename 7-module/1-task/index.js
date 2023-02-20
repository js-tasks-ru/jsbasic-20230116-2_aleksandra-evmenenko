import createElement from '../../assets/lib/create-element.js';

export default class RibbonMenu {
  constructor(categories) {
    this.categories = categories;
    this.elem = this.render();
  }
  render() {
    let ribbon = document.createElement('DIV');
    ribbon.classList.add('ribbon');

    let leftArrow = document.createElement('BUTTON');
    leftArrow.className = 'ribbon__arrow ribbon__arrow_left';
    leftArrow.innerHTML = '<img src="/assets/images/icons/angle-icon.svg" alt="icon">';
    ribbon.append(leftArrow);

    let rightArrow = document.createElement('BUTTON');
    rightArrow.className = 'ribbon__arrow ribbon__arrow_right ribbon__arrow_visible';
    rightArrow.innerHTML = '<img src="/assets/images/icons/angle-icon.svg" alt="icon">';
    ribbon.append(rightArrow);

    let nav = document.createElement('NAV');
    nav.classList.add('ribbon__inner');
    ribbon.append(nav);

    this.categories.forEach(item =>{
      nav.innerHTML += `<a href="#" class="ribbon__item" data-id="${item.id}">${item.name}</a>`;});

    ribbon.addEventListener('click', this.ribbonClickHandler.bind(this));

    nav.addEventListener('scroll', this.ribbonScrollHandler.bind(this));

    return ribbon;

  }

  ribbonClickHandler(event) {
    let ribbonInner = document.querySelector('.ribbon__inner');
    let rightArrow = document.querySelector('.ribbon__arrow_right');
    let leftArrow = document.querySelector('.ribbon__arrow_left');

    if (event.target.closest('.ribbon__arrow')) {
      if (event.target.closest('.ribbon__arrow_left')) {
        ribbonInner.scrollBy(-350, 0);
        rightArrow.classList.add('ribbon__arrow_visible');
      }


      if (event.target.closest('.ribbon__arrow_right')) {
        ribbonInner.scrollBy(350, 0);
        leftArrow.classList.add('ribbon__arrow_visible');
      }
    }

    if (event.target.closest('.ribbon__item')) {
      event.preventDefault();
      let temp = document.querySelector('.ribbon__item_active');
      if (temp) {temp.classList.remove('ribbon__item_active');}
      event.target.classList.add('ribbon__item_active');


      this.elem.dispatchEvent(new CustomEvent('ribbon-select', {
        detail: event.target.closest('.ribbon__item').dataset.id, 
        bubbles: true 
      })
      );
    }
  }

  ribbonScrollHandler(event) {
    let ribbonInner = document.querySelector('.ribbon__inner');
    let rightArrow = document.querySelector('.ribbon__arrow_right');
    let leftArrow = document.querySelector('.ribbon__arrow_left');

    let scrollWidth = ribbonInner.scrollWidth;
    let scrollLeft = ribbonInner.scrollLeft;
    let clientWidth = ribbonInner.clientWidth;

    let scrollRight = scrollWidth - scrollLeft - clientWidth;

    if (scrollLeft === 0) {
      leftArrow.classList.remove('ribbon__arrow_visible');
    }
    if (scrollRight < 1) {
      rightArrow.classList.remove('ribbon__arrow_visible');
    }
  }
}