//для 0 не получается написать другое условие
function factorial(n) {
  if (n == 0) {
    return 1;
  } else {
    let result = n;
    for (let a = n - 1; a > 1; --a) {
      result *= a;
    }
    return result;
  }
}

/* сугубо для меня комментарий
function factorial(n){
  if (a < 0) 
        return -1;
  else if (a == 0) 
      return 1;
  else {
      return (a * factorial(num - 1));
  }
}
*/
