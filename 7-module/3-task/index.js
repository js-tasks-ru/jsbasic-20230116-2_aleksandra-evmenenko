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
    this._elem = createElement(`${sliderTemplate(this._config)}`);
    this._elem.querySelector('.slider__steps span').classList.add('slider__step-active');
    this._elem.addEventListener('click', (event) =>
      this._onClick(event));
  }

  get elem() {
    return this._elem;
  }

  _initConfig({steps, value}) {
    this._config.steps = steps;
    this._config.value = value;
    this._config.currentStep = (100 / (steps - 1)) * value;
  }

  _onClick = (event) => {
    let left = event.clientX - this._elem.getBoundingClientRect().left;
    let leftRelative = left / this.elem.offsetWidth;
    let segments = this._config.steps - 1;
    let approximateValue = leftRelative * segments;
    let value = Math.round(approximateValue);
    let valuePercents = value / segments * 100;
    this._elem.querySelector('.slider__value').innerText = value;
    this._elem.querySelector('.slider__thumb').style.left = `${valuePercents}%`;
    this._elem.querySelector('.slider__progress').style.width = `${valuePercents}%`;
    this._elem.querySelector('.slider__step-active').classList.remove('slider__step-active');
    this._elem.querySelectorAll('.slider__steps span')[value].classList.add('slider__step-active');
    const customEvent = new CustomEvent('slider-change', { 
      detail: value,
      bubbles: true
    });
    this._elem.dispatchEvent(customEvent);
  }  

}
