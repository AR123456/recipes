// Need to get searchCountry var to this page and use in to search the API
// find out what the syntax is for 2 word search terms and convert using regex
//TODO look at way to take "searchCountry and convert the country name in it to a better recipe search term for the API " for example Argentina is Argentine - is there a Wiki API ? to get ths search terms from the WIKI lis t of "dishes" see this example https://en.wikipedia.org/wiki/List_of_Argentine_dishes

//need function that takes in searchCountry and returns one of an array of cusieans  terms, which search term is used should be randomly generated
var rawSearch = localStorage.getItem("searchCountry");
// var country = localStorage.getItem("searchCountry");
console.log(
  " Raw Search This should be showing the clicked on country : " + rawSearch
);
// object country name  search terms to do put this in an external file to grab or in the database
var countryCuisine =
  // could try first item in array is country  then remaining are cuisine
  [
    { countryMatch: "Afghanistan", cuisine: ["Afghanistan"] },
    { countryMatch: "Åland Islands", cuisine: ["Åland Islands"] },
    { countryMatch: "Albania", cuisine: ["Albania"] },
    { countryMatch: "Algeria", cuisine: ["Algeria"] },
    { countryMatch: "American Samoa", cuisine: ["American Samoa"] },
    { countryMatch: "Andorra", cuisine: ["Andorra"] },
    {
      countryMatch: "Angola",
      cuisine: ["okra", "makara", "Egusi soup", "peanut soup"]
    },
    { countryMatch: "Anguilla", cuisine: ["Anguilla"] },
    {
      countryMatch: "Antarctica",
      cuisine: ["Antarctica", "Bannocks", "Pemmican", "Antarctica"]
    },
    { countryMatch: "Antigua and Barbuda", cuisine: ["Antigua and Barbuda"] },
    { countryMatch: "Argentina", cuisine: ["Argentina"] },
    { countryMatch: "Armenia", cuisine: ["Armenia"] },
    { countryMatch: "Aruba", cuisine: ["Aruba"] },
    {
      countryMatch: "Australia",
      cuisine: [
        "Australia",
        "Barramundi",
        "Pavlova",
        "Vegemite",
        "Damper",
        "Anzac"
      ]
    },
    { countryMatch: "Austria", cuisine: ["Austria"] },
    { countryMatch: "Azerbaijan", cuisine: ["Azerbaijan"] },
    { countryMatch: "Bahamas", cuisine: ["Bahamas"] },
    { countryMatch: "Bahrain", cuisine: ["Bahrain"] },
    { countryMatch: "Bangladesh", cuisine: ["Bangladesh"] },
    { countryMatch: "Barbados", cuisine: ["Barbados"] },
    { countryMatch: "Belarus", cuisine: ["Belarus"] },
    { countryMatch: "Belgium", cuisine: ["Belgium"] },
    { countryMatch: "Belize", cuisine: ["Belize"] },
    { countryMatch: "Benin", cuisine: ["Benin"] },
    { countryMatch: "Bermuda", cuisine: ["Bermuda"] },
    { countryMatch: "Bhutan", cuisine: ["Bhutan"] },
    {
      countryMatch: "Bolivia, Plurinational State of",
      cuisine: ["Bolivia, Plurinational State of"]
    },
    {
      countryMatch: "Bonaire, Sint Eustatius and Saba",
      cuisine: ["Bonaire, Sint Eustatius and Saba"]
    },
    {
      countryMatch: "Bosnia and Herzegovina",
      cuisine: ["Bosnia and Herzegovina"]
    },
    { countryMatch: "Botswana", cuisine: ["Botswana"] },
    { countryMatch: "Bouvet Island", cuisine: ["Bouvet Island"] },
    {
      countryMatch: "Brazil",
      cuisine: [
        "manioc",
        "feijoada",
        "polenta",
        "acaraje",
        "coxinhas",
        "Esfiha",
        "Pasteis",
        "Pinhao"
      ]
    },
    {
      countryMatch: "British Indian Ocean Territory",
      cuisine: ["British Indian Ocean Territory"]
    },
    { countryMatch: "Brunei Darussalam", cuisine: ["Brunei Darussalam"] },
    { countryMatch: "Bulgaria", cuisine: ["Bulgaria"] },
    { countryMatch: "Burkina Faso", cuisine: ["Burkina Faso"] },
    { countryMatch: "Burundi", cuisine: ["Burundi"] },
    { countryMatch: "Cambodia", cuisine: ["Cambodia"] },
    {
      countryMatch: "Cameroon",
      cuisine: ["okra", "makara", "Egusi soup", "peanut soup"]
    },
    {
      countryMatch: "Canada",
      cuisine: [
        "Poutine",
        "Pierogi",
        "fiddleheads",
        "Cloudberry",
        "Dulse",
        "Tourtiere",
        "Pemmican",
        "Cretons",
        "donair"
      ]
    },
    { countryMatch: "Cape Verde", cuisine: ["Cape Verde"] },
    { countryMatch: "Cayman Islands", cuisine: ["Cayman Islands"] },
    {
      countryMatch: "Central African Republic",
      cuisine: ["okra", "makara", "Egusi soup", "peanut soup", "Fufu"]
    },
    {
      countryMatch: "Chad",
      cuisine: ["okra", "makara", "Egusi soup", "peanut soup", "Fufu"]
    },
    {
      countryMatch: "Chile",
      cuisine: [
        "Completo",
        "Chilean Empanadas",
        "Chile",
        "Porotos Granados",
        "Pastel de Choclo"
      ]
    },
    { countryMatch: "China", cuisine: ["China"] },
    { countryMatch: "Christmas Island", cuisine: ["Christmas Island"] },
    {
      countryMatch: "Cocos (Keeling) Islands",
      cuisine: ["Cocos (Keeling) Islands"]
    },
    { countryMatch: "Colombia", cuisine: ["Colombia"] },
    { countryMatch: "Comoros", cuisine: ["Comoros"] },
    {
      countryMatch: "Congo",
      cuisine: ["okra", "makara", "Egusi soup", "peanut soup", "Fufu"]
    },
    {
      countryMatch: "Congo, the Democratic Republic of the",
      cuisine: ["Congo, the Democratic Republic of the"]
    },
    { countryMatch: "Cook Islands", cuisine: ["Cook Islands"] },
    { countryMatch: "Costa Rica", cuisine: ["Costa Rica"] },
    { countryMatch: "Côte d'Ivoire", cuisine: ["Côte d'Ivoire"] },
    { countryMatch: "Croatia", cuisine: ["Croatia"] },
    { countryMatch: "Cuba", cuisine: ["Cuba"] },
    { countryMatch: "Curaçao", cuisine: ["Curaçao"] },
    { countryMatch: "Cyprus", cuisine: ["Cyprus"] },
    { countryMatch: "Czech Republic", cuisine: ["Czech Republic"] },
    { countryMatch: "Denmark", cuisine: ["Denmark"] },
    { countryMatch: "Djibouti", cuisine: ["Djibouti"] },
    { countryMatch: "Dominica", cuisine: ["Dominica"] },
    { countryMatch: "Dominican Republic", cuisine: ["Dominican Republic"] },
    { countryMatch: "Ecuador", cuisine: ["Ecuador"] },
    {
      countryMatch: "Egypt",
      cuisine: ["Egypt", "fava beans", "Koshary", "Kofta", "Duqqa"]
    },
    { countryMatch: "El Salvador", cuisine: ["El Salvador"] },
    {
      countryMatch: "Equatorial Guinea",
      cuisine: ["okra", "makara", "Egusi soup", "peanut soup", "Fufu"]
    },
    { countryMatch: "Eritrea", cuisine: ["Eritrea"] },
    { countryMatch: "Estonia", cuisine: ["Estonia"] },
    {
      countryMatch: "Ethiopia",
      cuisine: ["Injera", "Tibs", "Kitfo", "Doro wot"]
    },
    {
      countryMatch: "Falkland Islands (Malvinas)",
      cuisine: ["Falkland Islands (Malvinas)"]
    },
    { countryMatch: "Faroe Islands", cuisine: ["Faroe Islands"] },
    { countryMatch: "Fiji", cuisine: ["Fiji"] },
    { countryMatch: "Finland", cuisine: ["Finland"] },
    { countryMatch: "France", cuisine: ["France"] },
    { countryMatch: "French Guiana", cuisine: ["French Guiana"] },
    { countryMatch: "French Polynesia", cuisine: ["French Polynesia"] },
    {
      countryMatch: "French Southern Territories",
      cuisine: ["French Southern Territories"]
    },
    { countryMatch: "Gabon", cuisine: ["Gabon"] },
    { countryMatch: "Gambia", cuisine: ["Gambia"] },
    { countryMatch: "Georgia", cuisine: ["Georgia"] },
    { countryMatch: "Germany", cuisine: ["Germany"] },
    { countryMatch: "Ghana", cuisine: ["Ghana"] },
    { countryMatch: "Gibraltar", cuisine: ["Gibraltar"] },
    { countryMatch: "Greece", cuisine: ["Greece"] },
    { countryMatch: "Greenland", cuisine: ["Greenland"] },
    { countryMatch: "Grenada", cuisine: ["Grenada"] },
    { countryMatch: "Guadeloupe", cuisine: ["Guadeloupe"] },
    { countryMatch: "Guam", cuisine: ["Guam"] },
    { countryMatch: "Guatemala", cuisine: ["Guatemala"] },
    { countryMatch: "Guernsey", cuisine: ["Guernsey"] },
    { countryMatch: "Guinea", cuisine: ["Guinea"] },
    { countryMatch: "Guinea-Bissau", cuisine: ["Guinea-Bissau"] },
    { countryMatch: "Guyana", cuisine: ["Guyana"] },
    { countryMatch: "Haiti", cuisine: ["Haiti"] },
    {
      countryMatch: "Heard Island and McDonald Islands",
      cuisine: ["Heard Island and McDonald Islands"]
    },
    {
      countryMatch: "Holy See (Vatican City State)",
      cuisine: ["Holy See (Vatican City State)"]
    },
    { countryMatch: "Honduras", cuisine: ["Honduras"] },
    { countryMatch: "Hong Kong", cuisine: ["Hong Kong"] },
    { countryMatch: "Hungary", cuisine: ["Hungary"] },
    { countryMatch: "Iceland", cuisine: ["Iceland"] },
    { countryMatch: "India",cuisine: ["ALU GOBI","Saag Paneer","India",   "BEEF VINDALOO","BUTTER CHICKEN"] },
    { countryMatch: "Indonesia", cuisine: ["Indonesia"] },
    {
      countryMatch: "Iran, Islamic Republic of",
      cuisine: ["Iran, Islamic Republic of"]
    },
    { countryMatch: "Iraq", cuisine: ["Iraq"] },
    { countryMatch: "Ireland", cuisine: ["Ireland"] },
    { countryMatch: "Isle of Man", cuisine: ["Isle of Man"] },
    {
      countryMatch: "Israel",
      cuisine: ["Israel", "Falafel", "Hummus", "Shwarma", "Shakshooka"]
    },
    {
      countryMatch: "Italy",
      cuisine: [
        "arancini",
        "Carbonara",
        "Fiorentina Steak",
        "Ossobuco",
        "Italy",
        "Ribollita",
        "Risotto"
      ]
    },
    { countryMatch: "Jamaica", cuisine: ["Jamaica"] },
    { countryMatch: "Japan", cuisine: ["Japan"] },
    { countryMatch: "Jersey", cuisine: ["Jersey"] },
    { countryMatch: "Jordan", cuisine: ["Jordan"] },
    { countryMatch: "Kazakhstan", cuisine: ["Kazakhstan"] },
    { countryMatch: "Kenya", cuisine: ["Kenya"] },
    { countryMatch: "Kiribati", cuisine: ["Kiribati"] },
    {
      countryMatch: "Korea, Democratic People's Republic of",
      cuisine: ["Korea, Democratic People's Republic of"]
    },
    { countryMatch: "Korea, Republic of", cuisine: ["Korea, Republic of"] },
    { countryMatch: "Kosovo", cuisine: ["Kosovo"] },
    { countryMatch: "Kuwait", cuisine: ["Kuwait"] },
    { countryMatch: "Kyrgyzstan", cuisine: ["Kyrgyzstan"] },
    {
      countryMatch: "Lao People's Democratic Republic",
      cuisine: ["Lao People's Democratic Republic"]
    },
    { countryMatch: "Latvia", cuisine: ["Latvia"] },
    { countryMatch: "Lebanon", cuisine: ["Lebanon"] },
    { countryMatch: "Lesotho", cuisine: ["Lesotho"] },
    { countryMatch: "Liberia", cuisine: ["Liberia"] },
    { countryMatch: "Libya", cuisine: ["Libya"] },
    { countryMatch: "Liechtenstein", cuisine: ["Liechtenstein"] },
    { countryMatch: "Lithuania", cuisine: ["Lithuania"] },
    { countryMatch: "Luxembourg", cuisine: ["Luxembourg"] },
    { countryMatch: "Macao", cuisine: ["Macao"] },
    {
      countryMatch: "Macedonia, the former Yugoslav Republic of",
      cuisine: ["Macedonia, the former Yugoslav Republic of"]
    },
    { countryMatch: "Madagascar", cuisine: ["Brochettes", "Madagascar"] },
    { countryMatch: "Malawi", cuisine: ["Malawi"] },
    { countryMatch: "Malaysia", cuisine: ["Malaysia"] },
    { countryMatch: "Maldives", cuisine: ["Maldives"] },
    {
      countryMatch: "Mali",
      cuisine: ["Mali", "poulet yassa", "Jollof rice", "couscous"]
    },
    { countryMatch: "Malta", cuisine: ["Malta"] },
    { countryMatch: "Marshall Islands", cuisine: ["Marshall Islands"] },
    { countryMatch: "Martinique", cuisine: ["Martinique"] },
    { countryMatch: "Mauritania", cuisine: ["Mauritania"] },
    { countryMatch: "Mauritius", cuisine: ["Mauritius"] },
    { countryMatch: "Mayotte", cuisine: ["Mayotte"] },
    {
      countryMatch: "Mexico",
      cuisine: [
        "Mexico",
        "Tacos al pastor",
        "Chilaquiles",
        "Elote",
        "Chiles en nogada",
        "Mole",
        "Guacamole"
      ]
    },
    {
      countryMatch: "Micronesia, Federated States of",
      cuisine: ["Micronesia, Federated States of"]
    },
    { countryMatch: "Moldova, Republic of", cuisine: ["Moldova, Republic of"] },
    { countryMatch: "Monaco", cuisine: ["Monaco"] },
    { countryMatch: "Mongolia", cuisine: ["Mongolia"] },
    { countryMatch: "Montenegro", cuisine: ["Montenegro"] },
    { countryMatch: "Montserrat", cuisine: ["Montserrat"] },
    { countryMatch: "Morocco", cuisine: ["Morocco"] },
    { countryMatch: "Mozambique", cuisine: ["Mozambique"] },
    { countryMatch: "Myanmar", cuisine: ["Myanmar"] },
    { countryMatch: "Namibia", cuisine: ["Namibia"] },
    { countryMatch: "Nauru", cuisine: ["Nauru"] },
    { countryMatch: "Nepal", cuisine: ["Nepal"] },
    { countryMatch: "Netherlands", cuisine: ["Netherlands"] },
    { countryMatch: "New Caledonia", cuisine: ["New Caledonia"] },
    { countryMatch: "New Zealand", cuisine: ["New Zealand"] },
    { countryMatch: "Nicaragua", cuisine: ["Nicaragua"] },
    { countryMatch: "Niger", cuisine: ["Niger"] },
    { countryMatch: "Nigeria", cuisine: ["Nigeria"] },
    { countryMatch: "Niue", cuisine: ["Niue"] },
    { countryMatch: "Norfolk Island", cuisine: ["Norfolk Island"] },
    { countryMatch: "Northern Cyprus", cuisine: ["Northern Cyprus"] },
    {
      countryMatch: "Northern Mariana Islands",
      cuisine: ["Northern Mariana Islands"]
    },
    { countryMatch: "Norway", cuisine: ["Norway"] },
    { countryMatch: "Oman", cuisine: ["Oman"] },
    { countryMatch: "Pakistan", cuisine: ["Pakistan"] },
    { countryMatch: "Palau", cuisine: ["Palau"] },
    {
      countryMatch: "Palestinian Territory, Occupied",
      cuisine: ["Palestinian Territory, Occupied"]
    },
    { countryMatch: "Panama", cuisine: ["Panama"] },
    { countryMatch: "Papua New Guinea", cuisine: ["Papua New Guinea"] },
    { countryMatch: "Paraguay", cuisine: ["Paraguay"] },
    {
      countryMatch: "Peru",
      cuisine: ["Juane", "causa", "humitas", "ceviche", "bollos"]
    },
    { countryMatch: "Philippines", cuisine: ["Philippines"] },
    { countryMatch: "Pitcairn", cuisine: ["Pitcairn"] },
    { countryMatch: "Poland", cuisine: ["Poland"] },
    { countryMatch: "Portugal", cuisine: ["Portugal"] },
    { countryMatch: "Puerto Rico", cuisine: ["Puerto Rico"] },
    { countryMatch: "Qatar", cuisine: ["Qatar"] },
    { countryMatch: "Réunion", cuisine: ["Réunion"] },
    { countryMatch: "Romania", cuisine: ["Romania"] },
    {
      countryMatch: "Russia",
      cuisine: [
        "Shchi",
        "Pirozhki",
        "Borscht",
        "Pelmeni",
        "Blini",
        "Chicken Kiev",
        "Vinegret",
        "Solyanka"
      ]
    },
    { countryMatch: "Rwanda", cuisine: ["Rwanda"] },
    { countryMatch: "Saint Barthélemy", cuisine: ["Saint Barthélemy"] },
    {
      countryMatch: "Saint Helena, Ascension and Tristan da Cunha",
      cuisine: ["Saint Helena, Ascension and Tristan da Cunha"]
    },
    {
      countryMatch: "Saint Kitts and Nevis",
      cuisine: ["Saint Kitts and Nevis"]
    },
    { countryMatch: "Saint Lucia", cuisine: ["Saint Lucia"] },
    {
      countryMatch: "Saint Martin (French part)",
      cuisine: ["Saint Martin (French part)"]
    },
    {
      countryMatch: "Saint Pierre and Miquelon",
      cuisine: ["Saint Pierre and Miquelon"]
    },
    {
      countryMatch: "Saint Vincent and the Grenadines",
      cuisine: ["Saint Vincent and the Grenadines"]
    },
    { countryMatch: "Samoa", cuisine: ["Samoa"] },
    { countryMatch: "San Marino", cuisine: ["San Marino"] },
    {
      countryMatch: "Sao Tome and Principe",
      cuisine: ["Sao Tome and Principe"]
    },
    { countryMatch: "Saudi Arabia", cuisine: ["Saudi Arabia"] },
    { countryMatch: "Senegal", cuisine: ["Senegal"] },
    { countryMatch: "Serbia", cuisine: ["Serbia"] },
    { countryMatch: "Seychelles", cuisine: ["Seychelles"] },
    { countryMatch: "Sierra Leone", cuisine: ["Sierra Leone"] },
    { countryMatch: "Singapore", cuisine: ["Singapore"] },
    {
      countryMatch: "Sint Maarten (Dutch part)",
      cuisine: ["Sint Maarten (Dutch part)"]
    },
    { countryMatch: "Slovakia", cuisine: ["Slovakia"] },
    { countryMatch: "Slovenia", cuisine: ["Slovenia"] },
    { countryMatch: "Solomon Islands", cuisine: ["Solomon Islands"] },
    { countryMatch: "Somalia", cuisine: ["Somalia"] },
    { countryMatch: "Somaliland", cuisine: ["Somaliland"] },
    { countryMatch: "South Africa", cuisine: ["South Africa"] },
    {
      countryMatch: "South Georgia and the South Sandwich Islands",
      cuisine: ["South Georgia and the South Sandwich Islands"]
    },
    { countryMatch: "South Sudan", cuisine: ["South Sudan"] },
    {
      countryMatch: "Spain",
      cuisine: [
        " Pisto",
        "Tortilla Española",
        "Paella",
        "Gambas al ajillo",
        "Pimientos de Padron",
        "Fideuà",
        "Patatas bravas",
        "Empanadas"
      ]
    },
    { countryMatch: "Sri Lanka", cuisine: ["Sri Lanka"] },
    {
      countryMatch: "Sudan",
      cuisine: ["Molokhia", "banana", "Fenugreek", "kisra"]
    },
    { countryMatch: "Suriname", cuisine: ["Suriname"] },
    {
      countryMatch: "Svalbard and Jan Mayen",
      cuisine: ["Svalbard and Jan Mayen"]
    },
    { countryMatch: "Swaziland", cuisine: ["Swaziland"] },
    { countryMatch: "Sweden", cuisine: ["Sweden"] },
    { countryMatch: "Switzerland", cuisine: ["Switzerland"] },
    { countryMatch: "Syrian Arab Republic", cuisine: ["Syrian Arab Republic"] },
    {
      countryMatch: "Taiwan, Province of China",
      cuisine: ["Taiwan, Province of China"]
    },
    { countryMatch: "Tajikistan", cuisine: ["Tajikistan"] },
    {
      countryMatch: "Tanzania",
      cuisine: ["Chapatti", "Coconut Bean Soup", "Ugali"]
    },
    { countryMatch: "Thailand", cuisine: ["Thailand"] },
    { countryMatch: "Timor-Leste", cuisine: ["Timor-Leste"] },
    { countryMatch: "Togo", cuisine: ["Togo"] },
    { countryMatch: "Tokelau", cuisine: ["Tokelau"] },
    { countryMatch: "Tonga", cuisine: ["Tonga"] },
    { countryMatch: "Trinidad and Tobago", cuisine: ["Trinidad and Tobago"] },
    { countryMatch: "Tunisia", cuisine: ["Tunisia"] },
    { countryMatch: "Turkey", cuisine: ["Turkey"] },
    { countryMatch: "Turkmenistan", cuisine: ["Turkmenistan"] },
    {
      countryMatch: "Turks and Caicos Islands",
      cuisine: ["Turks and Caicos Islands"]
    },
    { countryMatch: "Tuvalu", cuisine: ["Tuvalu"] },
    { countryMatch: "Uganda", cuisine: ["Uganda"] },
    { countryMatch: "Ukraine", cuisine: ["Ukraine"] },
    { countryMatch: "United Arab Emirates", cuisine: ["United Arab Emirates"] },
    { countryMatch: "United Kingdom", cuisine: ["United Kingdom"] },
    { countryMatch: "United States", cuisine: ["United States"] },
    {
      countryMatch: "United States Minor Outlying Islands",
      cuisine: ["United States Minor Outlying Islands"]
    },
    { countryMatch: "Uruguay", cuisine: ["Uruguay"] },
    { countryMatch: "Uzbekistan", cuisine: ["Uzbekistan"] },
    { countryMatch: "Vanuatu", cuisine: ["Vanuatu"] },
    {
      countryMatch: "Venezuela, Bolivarian Republic of",
      cuisine: ["Venezuela, Bolivarian Republic of"]
    },
    { countryMatch: "Viet Nam", cuisine: ["Viet Nam"] },
    {
      countryMatch: "Virgin Islands, British",
      cuisine: ["Virgin Islands, British"]
    },
    { countryMatch: "Virgin Islands, U.S.", cuisine: ["Virgin Islands, U.S."] },
    { countryMatch: "Wallis and Futuna", cuisine: ["Wallis and Futuna"] },
    { countryMatch: "Western Sahara", cuisine: ["Western Sahara"] },
    { countryMatch: "Yemen", cuisine: ["Yemen"] },
    {
      countryMatch: "Zambia",
      cuisine: ["pumpkin leaves", "mealie meal", "okra"]
    },
    { countryMatch: "Zimbabwe", cuisine: ["Zimbabwe"] }
  ];

// console.log(countryCuisine[0].countryMatch);
// console.log(countryCuisine[0].cuisine);

// dont forget about the indexOf , could write this using it look at the Bands exrcise in the bootcamp javascritp section
for (let i = 0; i < countryCuisine.length; i++) {
  // console.log(countryCuisine[i].countryMatch);
  // console.log(rawSearch);
  if (rawSearch == countryCuisine[i].countryMatch) {
    // console.log(countryCuisine[i].cuisine.length);
    var randomCuisine =
      countryCuisine[i].cuisine[
        Math.floor(Math.random() * countryCuisine[i].cuisine.length)
      ];

    // console.log(randomCuisine);
  } else if (rawSearch !== countryCuisine[i].countryMatch) {
    console.log("hit the else if");
    // var randomCuisine = rawSearch;
    // console.log(randomCuisine);
  }

  //need function that takes in searchCountry and returns one of an array of cusieans  terms, which search term is used should be randomly generated
  // console.log(countryCuisine.country);
  // console.log(countryCuisine.cuisine[2]);
}
console.log(randomCuisine);
searchTerm = randomCuisine;
const queryURL =
  "https://api.edamam.com/search?q=" +
  searchTerm +
  "&app_id=7f505e41&app_key=c431472652d71ea7fad63f915856366d&from=0&to=3&health=alcohol-free";

$.ajax({
  url: queryURL,
  method: "GET"
}).done(function(response) {
  // console.log(response);
  // console.log(response.hits);
  console.log(response.hits[1].recipe.label);
  console.log(response.hits[1].recipe.url);
  console.log(response.hits[1].recipe.image);
  console.log(response.hits[1].recipe.ingredients);
  // re write all of this if vanilla javscript to eventualy use d3 to draw bubble chart of macro nutriants
  // // The nutriants
  console.log("total cal " + response.hits[1].recipe.calories);
  console.log("Fat " + response.hits[1].recipe.totalNutrients.FAT.quantity);
  console.log(
    "Carbs " + response.hits[1].recipe.totalNutrients.CHOCDF.quantity
  );
  console.log("pro " + response.hits[1].recipe.totalNutrients.PROCNT.quantity);

  for (let i = 0; i < response.hits.length; i++) {
    let recipeDiv = $("<div>");

    let image = $("<img class ='pic'>");

    image.attr("src", response.hits[i].recipe.image);

    let p = $("<p>").append(
      "<a target ='_blank' href='" +
        response.hits[i].recipe.url +
        "'>" +
        response.hits[i].recipe.label +
        "</a>"
    );
    recipeDiv.append(image);
    recipeDiv.append(p);

    $("#recipe-div").append(recipeDiv);

    //  ////////////////////////// render nut data

    const data = [
      //root category the parent of the blog so parent is empty
      {
        name: "calories",
        parent: "",
        amount: response.hits[i].recipe.calories
      }, // recipe.calories
      //three sub categories FAT , CHOCDF and PROCNT - their parent is calories
      {
        name: "FAT",
        parent: "calories",
        amount: response.hits[i].recipe.totalNutrients.FAT.quantity * 8
      }, // recipe.totalNutrients.FAT.quantity *8
      {
        name: "CHOCDF",
        parent: "calories",
        amount: response.hits[i].recipe.totalNutrients.CHOCDF.quantity * 4
      }, //recipe.totalNutrients.CHCCDF.quantity*4
      {
        name: "PROCNT",
        parent: "calories",
        amount: response.hits[i].recipe.totalNutrients.PROCNT.quantity * 4
      }, //recipe.totalNutrients.PROCNT.quantity*4

      {
        name: "Fat",
        parent: "FAT",
        amount:
          ((response.hits[i].recipe.totalNutrients.FAT.quantity * 8) /
            response.hits[i].recipe.calories) *
          100
      }, //
      //((response.hits[i].recipe.totalNutrients.FAT.quantity * 8)/response.hits[i].recipe.calories)*100
      //then sub categores of each sub CHOCDF amount is the amount of each
      {
        name: "Carbs",
        parent: "CHOCDF",
        amount:
          ((response.hits[i].recipe.totalNutrients.CHOCDF.quantity * 4) /
            response.hits[i].recipe.calories) *
          100
      }, //
      // ((response.hits[i].recipe.totalNutrients.CHOCDF.quantity * 4/response.hits[i].recipe.calories)*100

      {
        name: "Protein",
        parent: "PROCNT",
        amount:
          ((response.hits[i].recipe.totalNutrients.PROCNT.quantity * 4) /
            response.hits[i].recipe.calories) *
          100
        // "((response.hits[i].recipe.totalNutrients.PROCNT.quantity * 4)/response.hits[i].recipe.calories)*100"
      } // (PROCNT.quantity / ("FAT.quantity" +CHOCDR.quantity + PROCNT.quantity))*100
      // ((response.hits[i].recipe.totalNutrients.PROCNT.quantity * 4)/response.hits[i].recipe.calories)*100
    ];

    // create the svg
    const svg = d3
      .select(".canvas")
      .append("svg")
      .attr("width", 346)
      .attr("height", 346);
    // .append("text")
    // .text(response.hits[i].recipe.label);

    // create graph group
    const graph = svg.append("g").attr("transform", "translate(10,10)"); // to give a 50px margin
    // use the d3.js stratify method - attach some extra properties that d3 can use to generate the visualizations. Tells d3 which is the parent and the identifier
    const stratify = d3
      .stratify()
      // takes a call back function in whihc we have access to the data  - in it tell d3 what the ID will be in this case it is name which is the id of the objects
      .id(d => d.name)
      // this is the parentId to tell d3 what the parent property is called in this case it is parent
      .parentId(d => d.parent);
    // this sends the data through the stratify method - attach to a data property
    // returns depth, height and id in the data property
    // depth - how far from the root node the data is
    // height - distance from  the leaves of the tree
    // it also returns the  children array which are the direct decentdts of the parent - in this case calories so FAT ,CHOCDF and PROCNT
    // need to run data through this methond so that d3 knows what form it is in to make the visualiztion , mormalizeds it into what d3 can understand

    // console.log(stratify(data));

    // now use stratify method on data and store in const name root node
    const rootNode = stratify(data)
      // add value to different objects, tell d3 what propteryt to sum up to get this .
      // this will add the value property for things in each node
      .sum(d => d.amount);
    /// generate the bubble pack which is a d3 function
    const pack = d3
      .pack()

      //tack on the size of the bubble pack, the big circle
      .size([295, 295])
      // add padding size , the distance between circles within the circles withn the big circe
      .padding(5);

    // console.log(pack(rootNode));
    // join data in the form of an array
    // apply the descendants methond - this adds the data to array format so that it can be joined to shapes, makes all the info avalible
    // console.log(pack(rootNode).descendants());

    // storing the bubble data in a const - so it can be added to shapes
    const bubbleData = pack(rootNode).descendants();
    //add data to a selection of group elements - each bubble will eventualy be its own group  with a circe and text to output name . Both bubble and circe will have  access to the data that is joined to it in the group

    // adding logic for an ordinal scale to apply color
    const color = d3.scaleOrdinal(["#65D8A0", "#52B07C", "#000000"]);
    // use the depth property to pass through the ordinal scale
    // the higher the depth the lower in the tree of data
    /////////////////

    // join data and add group for each node
    const nodes = graph
      .selectAll("g")
      // join data to the groups - there is nothing in the dom yet so this will creat an enter selection for each individual group element
      .data(bubbleData)
      // apppend for  each group selecton
      .enter()
      .append("g")
      // use attr method to transform each group so that it is positioned according to the x and y coordinates given in the data
      // return the value inside a function so use template,  access to the data in the node each time around , along x property on the data that has already been generated in the pack const above. Also the y dircetion defined by the pack generator
      //move each  according to its position inside the pack const (pack generator)
      .attr("transform", d => `translate(${d.x},${d.y})`);
    // the return value of this is an array of nodes or groups  that have been entered into the dom

    // now add circe to the nodes (groups)
    // stroke width
    nodes
      .append("circle")
      // the radius of the circles will be driven by the data in the object we got from the pack methond above
      .attr("r", d => d.r)
      // make the boarder white
      .attr("stroke", "white")
      //boarder widthh
      .attr("stroke-width", 2)
      // circle  fill color - will eventualy run through an ordinal color scale
      // .attr("fill", "purple");
      // updating color attr to use ordinal scale l
      .attr("fill", d => color(d.depth));
    // append text to nodes with no children
    // check for no children  in the filter by looking for faulsy or trunthy ( children)
    nodes
      .filter(d => !d.children)
      //add text to each bubble
      .append("text")
      // puts text in middle
      .attr("text-anchor", "middle")
      //this gives it a offset in the y direction
      .attr("dy", ".0.3em")
      //set the fill color of the text
      .attr("fill", "white")
      // font size determined by the actual value,  times some number
      .style("font-size", d => d.value)
      .text(d => d.data.name);
    ////////////////////////////
  }
});
