/* globals moment */
moment.locale("sl");
// array objektov - vsak objekt je nakup
var podatki = [];
// vse kategorije, ki so se pojavile
var arrayOfCategories = [];
// array datumov oblike MMMM YYYY
var arrayOfDatesForFilter = [];
// array kategorij ki so se ponovile vsaj 3x
var arrayOfTopCategories;
// v arrayu so shranjeni vsi izbrani nakupi kategorije izbrane iz gumba .tag-category
var arrayOfSelectedCategoryToDraw = [];
// v arrayu so shranjeni vsi izbrani nakupi izbrane po datumu
var arrayOfSelectedDateToDraw = [];
// array uporabnikov
var arrayOfUsers = [];

// funkcija za risanje HTML elementov glede na vhodni podatek.
var drawTableOfSelectedData = function(inputArrayOfData) {
  // poiscemo obstojeco tabelo
  var tableContents = document.querySelector(".table-contents");
  // genriramo novo tabelo
  var newTableContents = generateTableContents(inputArrayOfData);
  // zamenjamo staro tabelo z novo
  tableContents.replaceWith(newTableContents);
};

// funkcija za branje file (Mato)
// function readFile(files) {
//   var fileToRead = files[0];
//   var reader = new window.FileReader();
//   reader.readAsText(fileToRead);
//   reader.onload = loadHandler;
// }
// document.querySelector("#csvFileInput")
//         .addEventListener("change", function() {
//           readFile(this.files);
//         });
// // funkcija load File (Mato)
// function loadHandler(event) {
//   var csv = event.target.result;
//   processData(csv);
// }

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
      var tagDate = createHTMLElement("div", "", arrayOfDatesForFilter[i].label);
      tagDate.dataset.filter = arrayOfDatesForFilter[i].id;
      dropdownContent.append(tagDate);
      tagDate.addEventListener("click", function(event) {
        var date = event.srcElement.dataset.filter;
        arrayOfSelectedDateToDraw = getSelectedDate(podatki, date);
        drawTableOfSelectedData(sortByDate(arrayOfSelectedDateToDraw));
        // narišemo še graf TESTNO!!!
        drawGraph(arrayOfSelectedDateToDraw, date);
      });
    }
  });

  // risanje tabele ob kliku na izbran "KATEGORIJE" filter dropdown
  var categoriesDropdownButton = document.querySelector(".filter-categories-dropdown-button");
  categoriesDropdownButton.addEventListener("click", function(event) {
    // vse elemente izbrišemo, če kliknem dvakrat jih naredi dvakrat!!!
    var dropdownContent = document.querySelector(".categories-dropdown-content");
    dropdownContent.innerHTML = "";
    // omogočimo prikazovanje dropdown menija preko .show class-a
    dropdownContent.classList.toggle("show");
    for (var i = 0; i < arrayOfCategories.length; i++) {
      var tagDate = createHTMLElement("div", "", arrayOfCategories[i].label);
      tagDate.dataset.filter = arrayOfCategories[i].id;
      dropdownContent.append(tagDate);
      tagDate.addEventListener("click", function(event) {
        arrayOfSelectedDateToDraw = getSelectedCategories(podatki, event.srcElement.innerText);
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
      var tagDate = createHTMLElement("div", "", arrayOfUsers[i]);
      document.querySelector(".users-dropdown-content").append(tagDate);
      tagDate.addEventListener("click", function(event) {
        arrayOfSelectedDateToDraw = getSelectedUsers(podatki, event.srcElement.innerText);
        drawTableOfSelectedData(sortByDate(arrayOfSelectedDateToDraw));
      });
    }
  });
};
// funkcija preuredi surove podatke v array v katerem je vsako plačilo objekt

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
    arrayLabels[i] = moment(inputDataObject[i].date).format("MMMM YYYY");
  }
  for (var j = 0; j < inputDataObject.length; j++) {
    arrayLabelsValue[j] = inputDataObject[j].amount;
  }
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

function start(csv) {
  podatki = processData(csv);

  arrayOfDatesForFilter = getFilterDates(podatki);
  arrayOfCategories = getAllCategories(podatki);
  arrayOfTopCategories = getTopCategories(podatki);
  // zanka nam ustvari element za vsako kategorijo v array-u
  for (var i = 0; i < arrayOfTopCategories.length; i++) {
    var tagCategories = createHTMLElement("div", "tag-category", arrayOfTopCategories[i]);
    document.querySelector(".glava-nastavitve").append(tagCategories);
    tagCategories.addEventListener("click", function(event) {
      arrayOfSelectedCategoryToDraw = getSelectedCategories(podatki, event.srcElement.innerText);
      drawTableOfSelectedData(sortByDate(arrayOfSelectedCategoryToDraw));
      drawGraphLine(arrayOfSelectedCategoryToDraw, event.srcElement.innerText);
    });
  };

}

fetch('https://raw.githubusercontent.com/Bam3/Stroski-Log/master/stroski-log.csv')
  .then(response => response.text())
  .then(start)
