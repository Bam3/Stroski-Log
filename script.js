/* globals moment */
moment.locale("sl");
// array objektov - vsak objekt je nakup
var podatki = [];
// vse kategorije, ki so se pojavile
var arrayKategorij = [];
// array datumov oblike MMMM YYYY
var arrayOfDatesForFilter = [];
// array kategorij ki so se ponovile vsaj 3x
var arrayPogostihKategorij;
// v arrayu so shranjeni vsi izbrani nakupi kategorije izbrane iz gumba .tag-category
var arrayOfSelectedCategoryToDraw = [];
// v arrayu so shranjeni vsi izbrani nakupi izbrane po datumu
var arrayOfSelectedDateToDraw = [];
// funkcija za kreiranje elementov
var ustvariElement = function(tag = "div", klas, besedilo) {
  var novElement = document.createElement(tag);
  if (klas) {
    novElement.classList.add(klas);
  }
  if (besedilo) {
    novElement.append(besedilo);
  }
  return novElement;
};
// funkcija za risanje HTML elementov glede na kategorijo.
var drawTableOfSelectedCategories = function(inputArrayOfCategory) {
  // prostor kjer bo tabla
  var tableElement = document.querySelector(".table-contents");
  // spraznimo tabelo preden jo ponovno ustvarimo
  tableElement.innerHTML = "";
  // for zanka katera gre skozi en objekt in ga narise
  inputArrayOfCategory.forEach(function(row) {
    var newRowElement = ustvariElement("div", "table-data");
    tableElement.append(newRowElement);

    var newCellElement = ustvariElement("div", "type", row.date.format("D. M. YYYY"));
    newRowElement.append(newCellElement);
    newCellElement = ustvariElement("div", "type", row.whoPaid);
    newRowElement.append(newCellElement);
    newCellElement = ustvariElement("div", "type", row.type);
    newRowElement.append(newCellElement);
    newCellElement = ustvariElement("div", "type", row.amount + " €");
    newRowElement.append(newCellElement);
    newCellElement = ustvariElement("div", "type", row.description);
    newRowElement.append(newCellElement);
    newCellElement = ustvariElement("div", "type", row.mato + " €");
    newRowElement.append(newCellElement);
    newCellElement = ustvariElement("div", "type", row.maja + " €");
    newRowElement.append(newCellElement);
    newCellElement = ustvariElement("div", "type", row.miha + " €");
    newRowElement.append(newCellElement);
    newCellElement = ustvariElement("div", "type", row.anja + " €");
    newRowElement.append(newCellElement);
  });
  // narisemo zadnjo vrstico katera nam poda sestevek vseh stroskov izbrane kategorije
  var newSumElement = ustvariElement("div", "type", "Skupni Strošek: " + sumStroskovIzbraneKategorije(inputArrayOfCategory) + " €");
  tableElement.append(newSumElement);
};
// funkcija za branje file (Mato)
function readFile(files) {
  var fileToRead = files[0];
  var reader = new window.FileReader();
  reader.readAsText(fileToRead);
  reader.onload = loadHandler;
}
document.querySelector("#csvFileInput")
        .addEventListener("change", function() {
          readFile(this.files);
        });
// funkcija load File (Mato)
function loadHandler(event) {
  var csv = event.target.result;
  processData(csv);
}
// funkcija za seštevanje vseh stroškov izbrane kategorije
function sumStroskovIzbraneKategorije(izbrnaKategorija) {
  var sum = 0;
  izbrnaKategorija.forEach(function(row) {
    sum += row.amount;
  });
  return sum;
}
// funkcija razvršča nakupe po datumu
var razvrstiPoDatumu = function(inputArray) {
  return inputArray.sort(function(prvi, drugi) {
    return prvi.date - drugi.date;
  });
};
// funkcija katera naredi: [array pogostih kategorije] [array vseh kategorij]
function getCategories(inputData) {
  var izbraneKategorije = [];
  for (var i = 0; i < inputData.length; i++) {
    arrayKategorij[i] = inputData[i].description;
    arrayOfDatesForFilter[i] = inputData[i].date.format("MMMM YYYY");
  }
  // ustvarimo objekt katerega ključi so kategorije iz CSV-ja, vrednosti ključev so ponovitve kategorije
  var countedNames = arrayKategorij.reduce(function(allNames, name) {
    if (name in allNames) {
      allNames[name]++;
    } else {
      allNames[name] = 1;
    }
    return allNames;
  }, {});
  var countedDates = arrayOfDatesForFilter.reduce(function(allNames, name) {
    if (name in allNames) {
      allNames[name]++;
    } else {
      allNames[name] = 1;
    }
    return allNames;
  }, {});
  // iz objekta dobimo vse nešene kategorije, ki so ključi
  arrayKategorij = Object.keys(countedNames);
  arrayOfDatesForFilter = Object.keys(countedDates);
  // izberemo kategorije ki se omenijo vsaj 3x
  for (var j = 0; j < arrayKategorij.length; j++) {
    if (countedNames[arrayKategorij[j]] >= 8) {
      izbraneKategorije.push(arrayKategorij[j]);
    }
  }
  arrayPogostihKategorij = izbraneKategorije;
};
// funkcija, ki nam napolni array samo z izbranimi objekti(kategorijo)
function getSelectedCategories(selectedCategory) {
  var arrayOfSelectedCategory = [];
  for (var i = 0; i < podatki.length; i++) {
    if (podatki[i].description === selectedCategory) {
      arrayOfSelectedCategory.push(podatki[i]);
    }
  }
  return arrayOfSelectedCategory;
}
function getSelectedDate(selectedDate) {
  var arrayOfSelectedDate = [];
  for (var i = 0; i < podatki.length; i++) {
    if (podatki[i].date.format("MMMM YYYY") === selectedDate) {
      arrayOfSelectedDate.push(podatki[i]);
    }
  }
  return arrayOfSelectedDate;
};
function attachEvents() {
  var confirmButton = document.querySelector(".confirm-button");
  confirmButton.addEventListener("click", function(event) {
    getCategories(podatki);
    // zanka nam ustvari element za vsako kategorijo v array-u
    for (var i = 0; i < arrayPogostihKategorij.length; i++) {
      var tagCategories = ustvariElement("div", "tag-category", arrayPogostihKategorij[i]);
      document.querySelector(".glava-nastavitve").append(tagCategories);
      tagCategories.addEventListener("click", function(event) {
        arrayOfSelectedCategoryToDraw = getSelectedCategories(event.srcElement.innerText);
        drawTableOfSelectedCategories(razvrstiPoDatumu(arrayOfSelectedCategoryToDraw));
      });
    };
  });
  var dateDropdownButton = document.querySelector(".filter-date-dropdown");
  var dropdownContent = document.querySelector(".dropdown-content");
  dateDropdownButton.addEventListener("click", function(event) {
    // vse elemente izbrišemo, če kliknem dvakrat jih naredi dvakrat!!!
    dropdownContent.innerHTML = "";
    // omogočimo prikazovanje dropdown menija
    dropdownContent.classList.toggle("show");
    for (var i = 0; i < arrayOfDatesForFilter.length; i++) {
      var tagDate = ustvariElement("div", "", arrayOfDatesForFilter[i]);
      document.querySelector(".dropdown-content").append(tagDate);
      tagDate.addEventListener("click", function(event) {
        arrayOfSelectedDateToDraw = getSelectedDate(event.srcElement.innerText);
        drawTableOfSelectedCategories(razvrstiPoDatumu(arrayOfSelectedDateToDraw));
      });
    }
  });
};
// funkcija preuredi surove podatke v array v katerem je vsako plačilo objekt
function processData(csv) {
  var arrayCSV = [];
  var arrayCSV2D = [];
  var vsaPlacila = [];

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
  // Zanka nam naredi objekt za vsako plačilo
  for (var k = 0; k < arrayCSV2D.length; k++) {
    if (arrayCSV2D[k][0].length === 10) {
        // [0]Date [1]Whopaid [2]Type [3]Amount [4]Currency [5]Description [6]Mato [7]Maja [8]Miha [9]Anja
      var strosekObj = {};
      strosekObj.date = moment(arrayCSV2D[k][0]);
      strosekObj.whoPaid = String(arrayCSV2D[k][1]);
      strosekObj.type = String(arrayCSV2D[k][2]);
      strosekObj.amount = Number(arrayCSV2D[k][3]);
      strosekObj.currency = String(arrayCSV2D[k][4]);
      strosekObj.description = String(arrayCSV2D[k][5]);
      strosekObj.mato = Number(arrayCSV2D[k][6]);
      strosekObj.maja = Number(arrayCSV2D[k][7]);
      strosekObj.miha = Number(arrayCSV2D[k][8]);
      strosekObj.anja = Number(arrayCSV2D[k][9]);
      vsaPlacila.push(strosekObj);
    }
  }
  podatki = razvrstiPoDatumu(vsaPlacila);
}
attachEvents();
