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
// array uporabnikov
var arrayOfUsers = [];
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
// funkcija za risanje HTML elementov glede na vhodni podatek.
var drawTableOfSelectedData = function(inputArrayOfData) {
  // prostor kjer bo tabla
  var tableElement = document.querySelector(".table-contents");
  // spraznimo tabelo preden jo ponovno ustvarimo
  tableElement.innerHTML = "";
  // for zanka katera gre skozi en objekt in ga narise
  inputArrayOfData.forEach(function(row) {
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
  var newSumElement = ustvariElement("div", "type", "Skupni Strošek: " + sumStroskovIzbraneKategorije(inputArrayOfData) + " €");
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
function sumStroskovIzbraneKategorije(izbranaKategorijaObject) {
  var sum = 0;
  izbranaKategorijaObject.forEach(function(row) {
    sum += row.amount;
  });
  return sum;
}
function sumStroskovPosamezneKategorije(inputDataObject, category) {
  var sum = 0;
  for (var i = 0; i < inputDataObject.length; i++) {
    if (inputDataObject[i].description === category) {
      sum += inputDataObject[i].amount;
    }
  }
  return sum;
}
// funkcija razvršča nakupe po datumu
var sortByDate = function(ArrayToSort) {
  return ArrayToSort.sort(function(prvi, drugi) {
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
  arrayOfDatesForFilter = reduceMultipleNames(arrayOfDatesForFilter);
  var countedNames = arrayKategorij.reduce(function(allNames, name) {
    if (name in allNames) {
      allNames[name]++;
    } else {
      allNames[name] = 1;
    }
    return allNames;
  }, {});
  // iz objekta dobimo vse nešene kategorije, ki so ključi
  arrayKategorij = Object.keys(countedNames).sort(function(a, b) { return countedNames[b] - countedNames[a]; });
  // izberemo kategorije ki se omenijo vsaj 8x
  for (var j = 0; j < 10; j++) {
    izbraneKategorije.push(arrayKategorij[j]);
  }
  arrayPogostihKategorij = izbraneKategorije;
}
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
// funkcija, ki nam napolni array samo z izbranimi objekti(uporabniki)
function getSelectedUsers(selectedCategory) {
  var arrayOfSelectedCategory = [];
  for (var i = 0; i < podatki.length; i++) {
    if (podatki[i].whoPaid === selectedCategory) {
      arrayOfSelectedCategory.push(podatki[i]);
    }
  }
  return arrayOfSelectedCategory;
}
function getSelectedDate(selectedDate) {
  var arrayOfSelectedDate = [];
  for (var i = 0; i < podatki.length; i++) {
    if ((podatki[i].date.format("MMMM YYYY") === selectedDate) && (podatki[i].type === "Expense")) {
      arrayOfSelectedDate.push(podatki[i]);
    }
  }
  return arrayOfSelectedDate;
};
function attachEvents() {
  // risanje tabele ob kliku na izbran "DATUM" (MMMM YYYY) filter dropdown
  var dateDropdownButton = document.querySelector(".filter-date-dropdown-button");
  dateDropdownButton.addEventListener("click", function(event) {
    // vse elemente izbrišemo, če kliknem dvakrat jih naredi dvakrat!!!
    var dropdownContent = document.querySelector(".date-dropdown-content");
    dropdownContent.innerHTML = "";
    // omogočimo prikazovanje dropdown menija preko .showw class-a
    dropdownContent.classList.toggle("show");
    for (var i = 0; i < arrayOfDatesForFilter.length; i++) {
      var tagDate = ustvariElement("div", "", arrayOfDatesForFilter[i]);
      document.querySelector(".date-dropdown-content").append(tagDate);
      tagDate.addEventListener("click", function(event) {
        arrayOfSelectedDateToDraw = getSelectedDate(event.srcElement.innerText);
        drawTableOfSelectedData(sortByDate(arrayOfSelectedDateToDraw));
        console.log(sortByDate(arrayOfSelectedDateToDraw));
        // narišemo še graf TESTNO!!!
        drawGraph(arrayOfSelectedDateToDraw, event.srcElement.innerText);
      });
    }
  });
  // risanje tabele ob kliku na izbran "KATEGORIJE" filter dropdown
  var categoriesDropdownButton = document.querySelector(".filter-categories-dropdown-button");
  categoriesDropdownButton.addEventListener("click", function(event) {
    // vse elemente izbrišemo, če kliknem dvakrat jih naredi dvakrat!!!
    var dropdownContent = document.querySelector(".categories-dropdown-content");
    dropdownContent.innerHTML = "";
    // omogočimo prikazovanje dropdown menija preko .showw class-a
    dropdownContent.classList.toggle("show");
    for (var i = 0; i < arrayKategorij.length; i++) {
      var tagDate = ustvariElement("div", "", arrayKategorij[i]);
      document.querySelector(".categories-dropdown-content").append(tagDate);
      tagDate.addEventListener("click", function(event) {
        arrayOfSelectedDateToDraw = getSelectedCategories(event.srcElement.innerText);
        drawTableOfSelectedData(sortByDate(arrayOfSelectedDateToDraw));
      });
    }
  });
  // risanje tabele ob kliku na izbran "UPORABNIK" filter dropdown
  var usersDropdownButton = document.querySelector(".filter-users-dropdown-button");
  usersDropdownButton.addEventListener("click", function(event) {
    // vse elemente izbrišemo, če kliknem dvakrat jih naredi dvakrat!!!
    var dropdownContent = document.querySelector(".users-dropdown-content");
    dropdownContent.innerHTML = "";
    // omogočimo prikazovanje dropdown menija preko .showw class-a
    dropdownContent.classList.toggle("show");
    for (var i = 0; i < arrayOfUsers.length; i++) {
      var tagDate = ustvariElement("div", "", arrayOfUsers[i]);
      document.querySelector(".users-dropdown-content").append(tagDate);
      tagDate.addEventListener("click", function(event) {
        arrayOfSelectedDateToDraw = getSelectedUsers(event.srcElement.innerText);
        drawTableOfSelectedData(sortByDate(arrayOfSelectedDateToDraw));
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
  arrayOfUsers = ["Mato", "Maja", "Miha", "Anja"];
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
  podatki = sortByDate(vsaPlacila);

  getCategories(podatki);
  // zanka nam ustvari element za vsako kategorijo v array-u
  for (var i = 0; i < arrayPogostihKategorij.length; i++) {
    var tagCategories = ustvariElement("div", "tag-category", arrayPogostihKategorij[i]);
    document.querySelector(".glava-nastavitve").append(tagCategories);
    tagCategories.addEventListener("click", function(event) {
      arrayOfSelectedCategoryToDraw = getSelectedCategories(event.srcElement.innerText);
      drawTableOfSelectedData(sortByDate(arrayOfSelectedCategoryToDraw));
      console.log(arrayOfSelectedCategoryToDraw);
      drawGraphLine(arrayOfSelectedCategoryToDraw, event.srcElement.innerText);
    });
  };

}
attachEvents();
// funkcija iz Chart.js ki nariše graf TEST!!!
function drawGraph(inputDataObject, nameOfMonthYear) {
  var ctx = document.getElementById("myChart");
  var arrayLabels = [];
  var arrayData = [];
  for (var i = 0; i < inputDataObject.length; i++) {
    arrayLabels[i] = inputDataObject[i].description;
  }
  // izločimo ponavljajoča imena
  arrayLabels = reduceMultipleNames(arrayLabels);
  // seštejemo vse za eno kategorijo
  for (var j = 0; j < arrayLabels.length; j++) {
    arrayData[j] = sumStroskovPosamezneKategorije(inputDataObject, arrayLabels[j]);
  }
  var myChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: arrayLabels,
      datasets: [{
        label: nameOfMonthYear,
        data: arrayData,
        backgroundColor: setColorForLabel(arrayLabels),
        borderColor: [],
        borderWidth: 1
      }]
    },
    options: {
      cutoutPercentage: 25
    }
  });
};

function drawGraphLine(inputDataObject, nameOfCategory) {
  var ctx = document.getElementById("myChart");
  var arrayLabels = [];
  var arrayLabelsValue = [];
  for (var i = 0; i < inputDataObject.length; i++) {
    arrayLabels[i] = inputDataObject[i].date.format("MMMM YYYY");
  }
  for (var j = 0; j < inputDataObject.length; j++) {
    arrayLabelsValue[j] = inputDataObject[j].amount;
  }
  console.log(arrayLabelsValue);
  var myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: arrayLabels,
      datasets: [{
        label: nameOfCategory,
        data: arrayLabelsValue,
        backgroundColor: setColorForLabel(arrayLabels),
        borderColor: [],
        borderWidth: 1
      }]
    },
    options: {
    }
  });
};

fetch('https://raw.githubusercontent.com/Bam3/Stroski-Log/master/stroski-log.csv')
  .then(response => response.text())
  .then(processData)
