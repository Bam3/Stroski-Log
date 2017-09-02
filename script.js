/* globals moment */
moment.locale("sl");
var myChart;
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

function attachEvents(dropdownDatasForFilter, allPayments) {
  // najde vse dropdown tipke
  var dropdownButtons = document.querySelectorAll(".filter-dropdown-button");
  // vsakemu doda evenlistnener
  dropdownButtons.forEach(function (dropdownButton, i) {
    dropdownButton.addEventListener("click", function(event) {
      // in v vsakem najde class dropdown-content
      var dropdownContent = dropdownButton.querySelector(".dropdown-content");
      //ga očisti
      dropdownContent.innerHTML = "";
      //ga pokaže s class-om show
      dropdownContent.classList.toggle("show");
      dropdownDatasForFilter[i].forEach(function(item){
        //za vsak podatek naredi element
        var itemElement = createHTMLElement("div", "", item.label);
        itemElement.dataset.filter = item.id;
        // narejen element dodeli v contents
        dropdownContent.append(itemElement);
        //narejenemu elementu doda eventlistener ki bo naredil glvno tabelo
        itemElement.addEventListener("click", function(event) {
          var filter = event.srcElement.dataset.filter;
          // iz vseh podatkov izčrpa samo tiste katere smo izbrali, npr. kategorija, user ali datum
          var newData = filterData(allPayments, filter, dropdownButton.dataset.filterKey);
          // narišemo tabelo
          drawTableOfSelectedData(sortByDate(newData));
          // narišemo graf
          drawGraph(newData, filter);
        })
      })
    })
  });
};

function drawTopCategories(allPayments) {
  //dobimo najpogosteje kategorije
  var topCategories = getTopCategories(allPayments);
  // zanka nam ustvari HTML element za vsako kategorijo v array-u in nam jih nariše v glavo
  // ob kliku na kategorijo nam izriše tabelo stroškov!
  for (var i = 0; i < topCategories.length; i++) {
    var tagCategories = createHTMLElement("div", "tag-category", topCategories[i]);
    document.querySelector(".glava-nastavitve").append(tagCategories);
    tagCategories.addEventListener("click", function(event) {
      var selectedCategoryToDraw = filterData(allPayments, event.srcElement.innerText, 'description');
      drawTableOfSelectedData(sortByDate(selectedCategoryToDraw));
      drawGraphLine(selectedCategoryToDraw, event.srcElement.innerText);
    });
  };
}


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
    arrayData[j] = sumStroskov(inputDataObject, arrayLabels[j]);
  }
  if (myChart) {
    myChart.destroy();
  }
  myChart = new Chart(ctx, {
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
  var sum = 0;

  for (var i = 0; i < inputDataObject.length; i++) {
    arrayLabels[i] = inputDataObject[i].month;
  }
  // izločimo vsak mesec
  arrayLabels = reduceMultipleNames(arrayLabels);
  // seštejemo stroške za vsak mesec
  for (var j = 0; j < arrayLabels.length; j++) {
    var monthForSum = arrayLabels[j];
    for (var k = 0; k < inputDataObject.length; k++) {
      if (monthForSum === inputDataObject[k].month) {
        sum += inputDataObject[k].amount;
      }
    }
    arrayLabelsValue.push(sum);
    sum = 0;
  }
  if (myChart) {
    myChart.destroy();
  }
  myChart = new Chart(ctx, {
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
// MAIN
function start(csv) {
  var allPayments = processData(csv);

  var dropdownDatasForFilter = [
    getAllFilterData(allPayments, 'month'),
    getAllFilterData(allPayments, 'description'),
    getAllFilterData(allPayments, 'whoPaid')
  ];
  attachEvents(dropdownDatasForFilter, allPayments);
  drawTopCategories(allPayments);
  //console.log(dropdownDatasForFilter);
}

fetch('https://raw.githubusercontent.com/Bam3/Stroski-Log/master/stroski-log.csv')
  .then(response => response.text())
  .then(start)
