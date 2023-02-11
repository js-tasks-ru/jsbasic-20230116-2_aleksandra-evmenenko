/**
 * Компонент, который реализует таблицу
 * с возможностью удаления строк
 *
 * Пример одного элемента, описывающего строку таблицы
 *
 *      {
 *          name: 'Ilia',
 *          age: 25,
 *          salary: '1000',
 *          city: 'Petrozavodsk'
 *      }
 *
 */
export default class UserTable {
  constructor(rows) {
    this.rows = rows;
    this.elem = this.render();
    this.elem.addEventListener('click', (event) => {           
      if (event.target.tagName === 'BUTTON') {
        event.target.parentElement.remove();
      }
    });
  }

  render() {
    
    const headers = ['Имя', 'возраст', 'зарплата', 'город'];

    const table = document.createElement('table');
    document.body.append(table);

    let header = document.createElement('thead');
    table.append(header);

    const headerRow = document.createElement('tr');
    header.append(headerRow);

    headerRow.innerHTML = headers.map(item =>`<th>${item}</th>`).join('');
  
    
    const tableBody = document.createElement('tbody');
    table.append(tableBody);
  
    this.rows.map(
      item => {
        let tableRow = document.createElement('tr');
        let deleteButton = document.createElement('button');
        deleteButton.textContent = 'X';
        for (let prop in item) {
          let td = document.createElement('td') ;
          td.textContent = item[prop];
          tableRow.append(td);
        }
    
        tableRow.append(deleteButton);
        tableBody.append(tableRow);
      });

    return table;
  }
}
