// funkcija preuredi surove podatke v array v katerem je vsako plačilo objekt
function processData(csv) {
  var arrayCSV = [];
  var arrayCSV2D = [];
  var allPayments = [];
  var arrayOfUsers = [];

  // vsaka vrstica v csv-ju je en element v areju
  arrayCSV = csv.split("\n");
  // ustvarimo 2D array, ker ima vsaka vrstica "arrayCSV" več željenih podatkov
  arrayCSV.forEach(function(line, i) {
    arrayCSV2D[i] = line.split(", ");
  });
  /* for (var i = 0; i < arrayCSV.length; i++) {
    arrayCSV2D[i] = arrayCSV[i].split(', ');
  } */
  // preureditev zapisov; odstranjevanje ; presledkov in "
  for (var i = 0; i < arrayCSV2D.length; i++) {
    for (var j = 0; j < arrayCSV2D[i].length; j++) {
      arrayCSV2D[i][j] = arrayCSV2D[i][j].replace(/"/g, "");
    }
  }
  arrayOfUsers = ["Mato", "Maja", "Miha", "Anja"];
  // Zanka nam naredi objekt za vsako plačilo
  for (var k = 0; k < arrayCSV2D.length; k++) {
    if (arrayCSV2D[k][0].length === 10) {
        // [0]Date [1]Whopaid [2]Type [3]Amount [4]Currency [5]Description [6]Mato [7]Maja [8]Miha [9]Anja
      var allCostsObj = {};
      allCostsObj.date = arrayCSV2D[k][0];
      allCostsObj.whoPaid = String(arrayCSV2D[k][1]);
      allCostsObj.type = String(arrayCSV2D[k][2]);
      allCostsObj.amount = Number(arrayCSV2D[k][3]);
      allCostsObj.currency = String(arrayCSV2D[k][4]);
      allCostsObj.description = String(arrayCSV2D[k][5]);
      allCostsObj.mato = Number(arrayCSV2D[k][6]);
      allCostsObj.maja = Number(arrayCSV2D[k][7]);
      allCostsObj.miha = Number(arrayCSV2D[k][8]);
      allCostsObj.anja = Number(arrayCSV2D[k][9]);

      if (allCostsObj.type === 'Expense') {
        allPayments.push(allCostsObj);
      }
    }
  }



  return allPayments;
}

// funkcija razvršča nakupe po datumu
function sortByDate(ArrayToSort) {
  return ArrayToSort.sort(function(prvi, drugi) {
    return prvi.date - drugi.date;
  });
};

// Vrne array vseh datumov
function getFilterDates(inputData) {
  var allDates = [];
  for (var i = 0; i < inputData.length; i++) {
    allDates[i] = inputData[i].date;
  }
  allDates = reduceMultipleNames(allDates);

  allDates = allDates.map(date => {
    return {
      label: moment(date).format("MMMM YYYY"),
      id: date
    }
  })
  return allDates;
}

// Vrne array vseh kategorij
function getAllCategories(inputData) {
  var allCategories = [];
  for (var i = 0; i < inputData.length; i++) {
    allCategories[i] = inputData[i].description;
  }
  allCategories = reduceMultipleNames(allCategories);
  allCategories = allCategories.map(category => {
    return {
      label: category,
      id: category
    }
  })

  return allCategories;
}

// Vrne array top kategorij
function getTopCategories(inputData) {
  var allCategories = [];
  var selectedCategories = [];
  for (var i = 0; i < inputData.length; i++) {
    allCategories[i] = inputData[i].description;
  }
  // ustvarimo objekt katerega ključi so kategorije iz CSV-ja, vrednosti ključev so ponovitve kategorije
  var countedNames = allCategories.reduce(function(allNames, name) {
    if (name in allNames) {
      allNames[name]++;
    } else {
      allNames[name] = 1;
    }
    return allNames;
  }, {});
  // iz objekta dobimo vse nešene kategorije, ki so ključi
  allCategories = Object.keys(countedNames).sort(function(a, b) { return countedNames[b] - countedNames[a]; });
  // izberemo kategorije ki se omenijo vsaj 8x
  for (var j = 0; j < 10; j++) {
    selectedCategories.push(allCategories[j]);
  }
  return selectedCategories;
}

// iz objekta dobimo array izbranih kategorij. npr. če imamo 20 hofer in 5 mercator nam vrne [hofer, mercator]
function reduceMultipleNames(inputDataArray) {
  var countedNames = inputDataArray.reduce(function(allNames, name) {
    if (name in allNames) {
      allNames[name]++;
    } else {
      allNames[name] = 1;
    }
    return allNames;
  }, {});
  return Object.keys(countedNames);
};

// funkcija za kreiranje elementov
var createHTMLElement = function(tag = "div", klas, inputText, appendToWhat) {
  var newElement = document.createElement(tag);
  if (klas) {
    newElement.classList.add(klas);
  }
  if (inputText) {
    newElement.append(inputText);
  }
  if (appendToWhat) {
    appendToWhat.append(newElement);
  }
  return newElement;
};

// Sesteje vse stroske v poslanem objektu
function sumStroskov(object) {
  var sum = 0;
  object.forEach(function(row) {
    sum += row.amount;
  });
  return sum;
}

// Posljes vse stroske za en mesec in kategorijo (npr Hofer), vrne sestevek
// vseh hoferjev; klice se, ko rises pie chart.
function sumStroskovPosamezneKategorije(inputDataObject, category) {
  var sum = 0;
  for (var i = 0; i < inputDataObject.length; i++) {
    if (inputDataObject[i].description === category) {
      sum += inputDataObject[i].amount;
    }
  }
  return sum;
}

// funkcija, ki nam napolni array samo z izbranimi objekti(kategorijo)
function getSelectedCategories(podatki, selectedCategory) {
  var arrayOfSelectedCategory = [];
  for (var i = 0; i < podatki.length; i++) {
    if (podatki[i].description === selectedCategory) {
      arrayOfSelectedCategory.push(podatki[i]);
    }
  }
  return arrayOfSelectedCategory;
}

// funkcija, ki nam napolni array samo z izbranimi objekti(uporabniki)
function getSelectedUsers(podatki, selectedCategory) {
  var arrayOfSelectedCategory = [];
  for (var i = 0; i < podatki.length; i++) {
    if (podatki[i].whoPaid === selectedCategory) {
      arrayOfSelectedCategory.push(podatki[i]);
    }
  }
  return arrayOfSelectedCategory;
}
function getSelectedDate(podatki, selectedDate) {
  var arrayOfSelectedDate = [];
  for (var i = 0; i < podatki.length; i++) {
    if (podatki[i].date === selectedDate) {
      arrayOfSelectedDate.push(podatki[i]);
    }
  }
  return arrayOfSelectedDate;
};

// določamo barvo glede na kategorijo nakupa
function setColorForLabel(categories) {
  var arrayOfColours = [];
  for (var i = 0; i < categories.length; i++) {
    switch (categories[i]) {
      case "Telemach":
        arrayOfColours.push("#58308F");
        break;
      case "DM":
        arrayOfColours.push("yellow");
        break;
      case "Mercator":
        arrayOfColours.push("red");
        break;
      case "Plin in ogrevanje":
        arrayOfColours.push("#E37518");
        break;
      case "Snaga":
        arrayOfColours.push("green");
        break;
      case "Hofer":
        arrayOfColours.push("blue");
        break;
      case "Elektrika":
        arrayOfColours.push("#A2E38B");
        break;
      case "Voda":
        arrayOfColours.push("#4E5FE3");
        break;
      default:
        arrayOfColours.push("black");
    }
  }
  return arrayOfColours;
}

function generateTableContents(inputArrayOfData) {
  // prostor kjer bo tabla
  var tableElement = createHTMLElement('div', 'table-contents');
  // for zanka katera gre skozi en objekt in ga narise
  inputArrayOfData.forEach(function(row) {
    var newRowElement = createHTMLElement("div", "table-data", "", tableElement);
    var newCellElement = createHTMLElement("div", "type", moment(row.date).format("D. M. YYYY"), newRowElement);
    newCellElement = createHTMLElement("div", "type", row.whoPaid, newRowElement);
    newCellElement = createHTMLElement("div", "type", row.type, newRowElement);
    newCellElement = createHTMLElement("div", "type", row.amount + " €", newRowElement);
    newCellElement = createHTMLElement("div", "type", row.description, newRowElement);
    newCellElement = createHTMLElement("div", "type", row.mato + " €", newRowElement);
    newCellElement = createHTMLElement("div", "type", row.maja + " €", newRowElement);
    newCellElement = createHTMLElement("div", "type", row.miha + " €", newRowElement);
    newCellElement = createHTMLElement("div", "type", row.anja + " €", newRowElement);
  });
  // narisemo zadnjo vrstico katera nam poda sestevek vseh stroskov izbrane kategorije
  var newSumElement = createHTMLElement("div", "type", "Skupni Strošek: " + sumStroskov(inputArrayOfData) + " €", tableElement);
  return tableElement;
};
