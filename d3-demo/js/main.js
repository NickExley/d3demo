//execute script when window is loaded
window.onload = function(){

    //SVG dimension variables
    var w = 1200, h = 600;

    //create the outer container
    var container = d3.select("body") //get the <body> element from the DOM
        .append("svg") //put a new svg in the body
        .attr("width", w) //assign the width
        .attr("height", h) //assign the height
        .attr("class", "container") //assign 'container' as the class name
        .style("background-color", "rgba(0,0,0,0.2)"); 

	//create the inner rectangle
    var innerRect = container.append("rect") //put a new rect in the svg
        .datum(490) //a single value is a datum
        .attr("width", function(d){ //rectangle width
            return d * 2; 
        }) 
        .attr("height", function(d){ //rectangle height
            return d; 
        })
		.attr("class", "innerRect") //class name
        .attr("x", 100) //position from left on the x (horizontal) axis
        .attr("y", 50) //position from top on the y (vertical) axis
        .style("fill", "#FFFFFF"); //fill color
	
	//create an array of city names and population values
	var cityPop = [
		{ 
			city: 'Tokyo',
			population: 9273000
		},
		{
			city: 'New Delhi',
			population: 21750000
		},
		{
			city: 'São Paulo',
			population: 14710000
		},
		{
			city: 'Mexico City',
			population: 8851000
		}
	];

	
    //find the minimum value of the array
    var minPop = d3.min(cityPop, function(d){
        return d.population;
    });

    //find the maximum value of the array
    var maxPop = d3.max(cityPop, function(d){
        return d.population;
    });

    //scale for circles center y coordinate
    var y = d3.scaleLinear()
        .range([540, 50])
        .domain([7000000, 23000000]); 

		
    //scale for circles center x coordinate 
    var x = d3.scaleLinear() //create the scale
        .range([300, 1000]) //output min and max
        .domain([0, 3.5]); //input min and max

    //color scale generator 
    var color = d3.scaleLinear()
        .range([
            "#f28080",
            "#c91e1e"
        ])
        .domain([
            minPop, 
            maxPop
        ]);
		
    //create the circles and use the population values to determine proportional size 
    var circles = container.selectAll(".circles") //create an empty selection
        .data(cityPop) //here we feed in an array
        .enter() //one of the great mysteries of the universe
        .append("circle") 
        .attr("class", "circles")
        .attr("id", function(d){
            return d.city;
        })
        .attr("r", function(d){
            //calculate the radius based on population value as circle area
            var area = d.population * 0.0001;
            return Math.sqrt(area/Math.PI);
        })
		//place the circles horizontally 
        .attr("cx", function(d, i){
            return x(i);
        })
		//place the circles vertically 
        .attr("cy", function(d){
            return y(d.population);
        })
		.style("fill", function(d, i){ //add a fill based on the color scale generator
           return color(d.population);
        })
        .style("stroke", "#000"); //black circle stroke
		
	//create y axis generator
    var yAxis = d3.axisLeft(y);
	
	//Create axis g element and add axis
    var axis = container.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(100, 0)")
        .call(yAxis);

	//create a text element and add the title
    var title = container.append("text")
        .attr("class", "title")
        .attr("text-anchor", "middle")
        .attr("x", 600)
        .attr("y", 35)
        .text("World City Populations");
		
	//Create circle labels
    var labels = container.selectAll(".labels")
        .data(cityPop)
        .enter()
        .append("text")
        .attr("class", "labels")
        .attr("text-anchor", "left")
        .attr("y", function(d){
            //vertical position centered on each circle
            return y(d.population);
        });

    //first line of label
    var nameLine = labels.append("tspan")
        .attr("class", "nameLine")
        .attr("x", function(d,i){
            //horizontal position to the right of each circle
            return x(i) + Math.sqrt(d.population * 0.0001 / Math.PI) + 5;
        })
        .text(function(d){
            return d.city;
        });

	//create format generator
    var format = d3.format(",");
		
    //second line of label
    var popLine = labels.append("tspan")
        .attr("class", "popLine")
        .attr("x", function(d,i){
            return x(i) + Math.sqrt(d.population * 0.0001 / Math.PI) + 5;
        })
        .attr("dy", "15") //vertical offset
        .text(function(d){
            return "Pop. " + format(d.population);
        });
};

