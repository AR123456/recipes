// Need to get searchMe var to this page and use in to search the API
// find out what the syntax is for 2 word search terms and convert using regex
var searchTerm = localStorage.getItem("searchMe");

// find html to write search term into the #current div

console.log("This is searchMe ", searchTerm);

const queryURL =
  "https://api.edamam.com/search?q=" +
  searchTerm +
  "&app_id=7f505e41&app_key=#d&from=0&to=3&health=alcohol-free";

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

  for (let i = 0; i < response.hits.length; i++) {
    let gifDiv = $("<div>");

    let p = $("<p>").append(
      "<a target ='_blank' href='" +
        response.hits[i].recipe.url +
        "'>" +
        response.hits[i].recipe.label +
        "</a>"
    );

    let image = $("<img class ='gif'>");
    image.attr("src", response.hits[i].recipe.image);

    gifDiv.append(p);
    gifDiv.append(image);

    $("#recipe-div").prepend(gifDiv);
  }
});
