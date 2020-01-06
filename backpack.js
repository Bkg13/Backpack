/* V: [10,100], całkowite
N = 100
Plecak: 3000
dwuelemetnowa strategia ewolucyjna
wypełniamy randomowo tablice 0, 1 i bierzemy przedmioty z tablicy gdzie są 1
robimy potomka, kopiujemy wartości i dokonujemy mutacji
losujemy indeks gdzie wystąpi mutacja, robimy negacje wartości (potomek rożni się dokładnie jednym genem)
Badamy dla rodzica i potomka w jakim stopniu jest zapełniony plecak:
3 rozwiązania: 
a) oba rozwiązania są dopuszczalne (plecak nie jest przepełniony), prównujemy i wybieramy lepszy
b) jedno rozwiązanie jest dopuszczalne i jedno nie jest dopuszczalne (plecak został przepełniony), wygrywa ten który jest dopuszczalny
c) oba rozwiązania są niedopuszczalne (oba przepełniają plecak), wybieramy to gdzie przepełnienie jest mniejsze
flagi, cot ot jest przerwanie, stos, co jest na stosie, jakie są rejestry, co to jest tryb DMA, przepełnienie, nadmiar, rozkazy działające na łańcuchach danych, flagi */

const n = 200;
const backpackV = 3000;
let parent = [];
let descendant = [];
const things = [];
let finish = false;

const getRand = (a, b) => {
  const min = Math.ceil(a);
  const max = Math.floor(b);
  const result = Math.floor(Math.random() * (max - min + 1)) + min;
  return result;
};

// console.log(Math.ceil(11.1));

const fillParent = () => {
  for (let i = 0; i < n; i++) {
    parent.push(getRand(0, 1));
  }
  // console.log(parent);
};

const copyDescendant = () => {
  descendant = [];
  for (value of parent) {
    descendant.push(value);
  }
  // console.log(descendant);
};

const generateThings = () => {
  for (let i = 0; i < n; i++) {
    things.push(getRand(10, 20));
    //console.log(things.length);
  }
  // console.log(things);
};

const mutatesDescendant = () => {
  const randIndex = getRand(0, n - 1);
  // console.log(descendant[randIndex]);
  descendant[randIndex] = descendant[randIndex] == 1 ? 0 : 1;
  // console.log(descendant[randIndex]);
};

const chooseBetter = () => {
  let parentBackpack = 0;
  let descendantBackpack = 0;
  //console.log(descendant);
  //console.log(things);
  for (const [i, value] of parent.entries()) {
    value ? (parentBackpack += things[i]) : null;
  }
  for (const [i, value] of descendant.entries()) {
    value ? (descendantBackpack += things[i]) : null;
  }
  /*   console.log(`parent backpack:
    ${parentBackpack}`);
  console.log(`descendant backpack:
    ${descendantBackpack}`); */
  if (parentBackpack == backpackV) {
    finish = true;
    return parent;
  }
  if (descendantBackpack == backpackV) {
    finish = true;
    return descendant;
  }

  if (parentBackpack > backpackV && descendantBackpack <= backpackV) {
    // console.log('Winner descendant');
    return descendant;
  }

  if (descendantBackpack > backpackV && parentBackpack <= backpackV) {
    // console.log('Winner parent');
    return parent;
  }

  if (parentBackpack > backpackV && descendantBackpack > backpackV) {
    if (parentBackpack > descendantBackpack) {
      // console.log('Winner descendant');
      return descendant;
    } else {
      // console.log('Winner parent');
      return parent;
    }
  }

  if (parentBackpack <= backpackV && descendantBackpack <= backpackV) {
    if (descendantBackpack >= parentBackpack) {
      // console.log('Winner descendant');
      return descendant;
    } else {
      // console.log('Winner parent');
      return parent;
    }
  }
};

const init = () => {
  fillParent();
  generateThings();
  copyDescendant();
  mutatesDescendant();
};

init();

const returnFinalResult = () => {
  let tempFill = 0;
  for (let i = 0; i < 1000; i++) {
    setTimeout(() => {
      clearBackpack();
      tempFill = 0;
      let tempParent = [];
      for (const value of chooseBetter()) {
        // console.log(value);
        tempParent.push(value);
      }
      parent = [...tempParent];
      copyDescendant();
      mutatesDescendant();
      for (const [i, value] of parent.entries()) {
        value ? (tempFill += things[i]) : null;
      }
      fillBackpack(tempFill);
      console.log(tempFill);
    }, i);
    if (finish) break;
    // console.log(tempFill);
  }
  return tempFill;
};

const fillBackpack = tempFill => {
  const element = document.createElement('div');
  const emptyElement = document.querySelector('.empty');
  const backpackElement = document.querySelector('.backpack');
  const sizeElement = document.querySelector('.size');
  element.className = 'thing';
  element.style.height = `${tempFill / 10}px`;
  sizeElement.innerText = tempFill;
  backpackElement.appendChild(element);
  emptyElement.style.height = `${(3000 - tempFill) / 10}px`;
};

const clearBackpack = () => {
  const thing = document.querySelector('.thing');
  thing ? thing.remove() : null;
};

console.log(returnFinalResult());
