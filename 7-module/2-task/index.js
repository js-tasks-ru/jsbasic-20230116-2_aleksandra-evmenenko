import createElement from '../../assets/lib/create-element.js';

export default class Modal {
  constructor() {
    this.modal = this.render();
  }
  
  render() {
    let modal = createElement(`
    <div class="modal">
    
    <div class="modal__overlay"></div>
    <div class="modal__inner">
      <div class="modal__header">
        
        <button type="button" class="modal__close">
          <img src="/assets/images/icons/cross-icon.svg" alt="close-icon" />
        </button>
        <h3 class="modal__title">
          
        </h3>
      </div>
      <div class="modal__body">
        
      </div>
    </div>
  </div>
    `);

    return modal;
  }

  open() {

    document.body.append(this.modal);
    document.body.classList.add('is-modal-open');
    document.body.addEventListener('click', this.modalCloseHandler.bind(this));
    document.body.addEventListener('keydown', this.modalCloseHandler.bind(this));

  }

  setTitle (title) {
    this.modal.querySelector('.modal__title').textContent = title;
  }

  setBody(node) {
    this.modal.querySelector('.modal__body').append(node);
  }

  modalCloseHandler(event) {
    if (event.target.closest('.modal__close') || event.code === 'Escape') {this.close();}
  }

  close() {
    this.modal.remove();
    document.body.classList.remove('is-modal-open');
  }
}
