function sumSalary (salaries) {
  let sumSalaries = 0;

  for (let key in salaries) {
    let isSalary = typeof (salaries[key]) === 'number' && Number.isFinite(salaries[key]);

    if (isSalary) {
      sumSalaries += salaries[key];
    }
  }

  return sumSalaries;
}
