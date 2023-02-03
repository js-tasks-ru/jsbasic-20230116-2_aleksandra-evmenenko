function toggleText() {
  let textElement = document.querySelector('#text');
  
  for (let button of document.querySelectorAll('.toggle-text-button')) {
    button.onclick = () => { textElement.hidden = textElement.hidden ? undefined : 'true';};
  }  
}
