import createElement from '../../assets/lib/create-element.js';

function sliderTemplate(config) {
  return `
  <div class="slider">
    <div class="slider__thumb" style="left: ${config.currentStep}%;">
      <span class="slider__value">${config.value}</span>
    </div>
    <div class="slider__progress" style="width: ${config.currentStep}%;"></div>
    <div class="slider__steps">
      ${sliderStepsTemplate(config.steps)}
    </div>
  </div>`;
}

function sliderStepsTemplate(stepsCount) {
  let steps = '';
  for (let i = 0; i < stepsCount; ++i) {
    steps += '<span></span>\n';
  }
  return steps;
}

export default class StepSlider {
  _config = {};
  constructor({ steps, value = 0 }) {
    this._initConfig({steps, value});
    this._render();  
  }

  get elem() {
    return this._elem;
  }

  get thumb() {
    return this._thumb;
  }

  _initConfig({steps, value}) {
    this._config.steps = steps;
    this._config.value = value;
    this._config.currentStep = (100 / (steps - 1)) * value;
  }

  _onClick = (event) => {
    let left = event.clientX - this._elem.getBoundingClientRect().left;
    let leftRelative = left / this._elem.offsetWidth;
    let segments = this._config.steps - 1;
    let approximateValue = leftRelative * segments;
    let value = Math.round(approximateValue);
    let valuePercents = value / segments * 100;

    this.thumb.style.left = `${valuePercents}%`;
    this._elem.querySelector('.slider__progress').style.width = `${valuePercents}%`;

    this._elem.querySelector('.slider__value').innerText = value;
    this._elem.querySelector('.slider__step-active').classList.remove('slider__step-active');
    this._elem.querySelectorAll('.slider__steps span')[value].classList.add('slider__step-active');
    const customEvent = new CustomEvent('slider-change', { 
      detail: value,
      bubbles: true
    });
    this._elem.dispatchEvent(customEvent);
  }
  
  _onPointerDown = (event) => {
    this._thumb.style.position = 'absolute';

    const onMove = (event) => {
  
      this._elem.classList.add('slider_dragging');
  
      this._thumb.style.left = `${event.pageX}px`;
  
      let left = event.clientX - this._elem.getBoundingClientRect().left;
      let leftRelative = left / this._elem.offsetWidth;
      if (leftRelative < 0) {
        leftRelative = 0;
      }
      if (leftRelative > 1) {
        leftRelative = 1;
      }
      let leftPercents = leftRelative * 100;
      this.thumb.style.left = `${leftPercents}%`;
      this._elem.querySelector('.slider__progress').style.width = `${leftPercents}%`;
  
      let segments = this._config.steps - 1;
      let approximateValue = leftRelative * segments;
      this._config.value = Math.round(approximateValue);
      this._elem.querySelector('.slider__value').innerText = this._config.value;
      this._elem.querySelector('.slider__step-active').classList.remove('slider__step-active');
      this._elem.querySelectorAll('.slider__steps span')[this._config.value].classList.add('slider__step-active');
    };
  
    document.addEventListener('pointermove', onMove);

    document.addEventListener('pointerup', () => {

      this._elem.classList.remove('slider_dragging');
      document.removeEventListener('pointermove', onMove);

      const customEvent = new CustomEvent('slider-change', { 
        detail: this._config.value,
        bubbles: true
      });
      this._elem.dispatchEvent(customEvent);
    }, { once: true });
  }

  _render = () => {
    this._elem = createElement(`${sliderTemplate(this._config)}`);
    this._elem.querySelector('.slider__steps span').classList.add('slider__step-active');
    this._thumb = this.elem.querySelector('.slider__thumb');
    this._thumb.ondragstart = () => false;

    this._elem.addEventListener('click', (event) =>
      this._onClick(event));

    this._thumb.addEventListener('pointerdown', (event) => this._onPointerDown(event));
  }

}
