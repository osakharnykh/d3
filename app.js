d3.select(window).on("resize", makeResponsive);
makeResponsive();

function makeResponsive() {

  var svgArea = d3.select("body").select("svg");

  if (!svgArea.empty()) {
    svgArea.remove();
  }

  var svgWidth = window.innerWidth;
  var svgHeight = window.innerHeight;

  margin = {
    top: 50,
    bottom: 50,
    right: 150,
    left: 70
  };

  var height = svgHeight - margin.top - margin.bottom;
  var width = svgWidth - margin.left - margin.right;

  // Append SVG element
  var svg = d3
    .select(".chart")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

  // Append group element
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Read CSV
  d3.csv("data/data_d3.csv", function(err, response) {

    response.forEach(function(data){
      data.foreign_pop = +data.foreign_pop;
      data.rent_low_income = +data.rent_low_income;
    });
    var pop=[];
    for (i=0;i<response.length;i++){
      pop[i]=response[i]['foreign_pop']
    }
    console.log(pop);
    //console.log(response);
    // create scales
    var popScale = d3.scaleLinear()
      .domain([0,d3.max(pop)])
      .range([0, width]);

    var rentScale = d3.scaleLinear()
      .domain([0, d3.max(response, d => d.rent_low_income)])
      .range([height, 0]);

    // create axes
    var xAxis = d3.axisBottom(popScale);
    var yAxis = d3.axisLeft(rentScale);

    // append axes
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
    //  .attr("stroke", "green")
      .call(xAxis);

    chartGroup.append("g")
    //  .attr("stroke", "orange")
      .call(yAxis);

    // line generator
    var line = d3.line()
      .x(d => popScale(d.foreign_pop))
      .y(d => rentScale(d.rent_low_income));

     // create path
    chartGroup.append("path")
      .attr("d", line(response))
      .attr("fill", "none")
    //  .attr("stroke", "blue");

    // append circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(response)
      .enter()
      .append("circle")
      .attr("cx", d => popScale(d.foreign_pop))
      .attr("cy", d => rentScale(d.rent_low_income))
      .attr("r", "10")
      .attr("fill", "silver")
      .attr("stroke-width", "1")
      .attr("stroke", "gray")
      .attr("opacity", ".75")
    var textGroup = chartGroup.selectAll('circle')
      .data(response)
      .enter()
      .append("text")
      .attr("cx", d => popScale(d.foreign_pop))
      .attr("cy", d => rentScale(d.rent_low_income))
      .attr("text-anchor", "middle")  
      .style("font-size", "14px")
      .attr('fill','black')
      .text('test');

    

      svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width-10)
        .attr("y", height+26)
        .style("font-size", "18px")
        .style('fill', 'darkRed')
        .text("Foreign-born population by state"); 
      svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 33)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .style("font-size", "14px")
        .style('fill', 'darkRed')
        .text("Rental housing, Low income (%)");

    
     var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([60, 60])
      .html(function(d){
        return (`<strong>${d.state}</strong><hr><i>Foreign population</i><br>${d.foreign_pop}`)
      })

     chartGroup.call(toolTip)
     circlesGroup.on("mouseover", function(d){
         toolTip.show(d)
     })
       .on("mouseout", function(d){
         toolTip.hide(d)
       });

  });
};
