// Need to get searchMe var to this page and use in to search the API
// find out what the syntax is for 2 word search terms and convert using regex

var searchTerm = localStorage.getItem("searchMe");
// var searchTerm = localStorage.getItem("searchMe");

// find html to write search term into the #current div

console.log("This is searchMe ", searchTerm);

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
  console.log(response.hits[1].recipe.calories);
  console.log(response.hits[1].recipe.totalNutrients.FAT.quantity);
  console.log(response.hits[1].recipe.totalNutrients.CHOCDF.quantity);
  console.log(response.hits[1].recipe.totalNutrients.PROCNT.quantity);

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

    $("#recipe-div").prepend(recipeDiv);

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

    // create graph group
    const graph = svg.append("g").attr("transform", "translate(10,50)"); // to give a 50px margin
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
      //tack on the size of the bubble pack
      .size([295, 295])
      // add padding size , the distance between circles
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
