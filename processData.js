// funkcija preuredi surove podatke v array v katerem je vsako plačilo objekt
function processData(csv) {
  var arrayCSV = [];
  var arrayCSV2D = [];
  var vsaPlacila = [];
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

  return vsaPlacila;
}
