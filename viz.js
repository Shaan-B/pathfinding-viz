const NONE = -1;
const SOURCE = 0;
const TARGET = 1;
const VISITED = 2;
const FRONTIER = 3;
const EDGE = 4

var svg = d3.select('svg'),
  width = +svg.attr('width'),
  height = +svg.attr('height');

var simulation = d3.forceSimulation()
  .force('link', d3.forceLink()
    .id(function(d) {
      return d.id;
    })
    .distance(50))
  .force('charge', d3.forceManyBody().strength(-100))
  .force('center', d3.forceCenter(width / 2, height / 2));

graph = {
  nodes: [],
  links: []
};

for (let i = 0; i < graphEncoding.numNodes; i++) {
  graph.nodes.push({
    id: i,
    type: NONE,
    visited: false
  });
}

graphEncoding.edges.forEach((edge) => {
  graph.links.push({
    source: edge[0],
    target: edge[1],
    type: EDGE
  });
});

var node = svg.select('.nodes')
  .selectAll('g')
  .data(graph.nodes)
  .enter()
  .append('circle')
  .attr('r', 5)
  .call(d3.drag()
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended))

node.append('title')
    .text(function(d) {
      return d.id;
    });

var text = svg.select('.nodes')
    .selectAll('text')
    .data(graph.nodes)
    .enter()
    .append('text')
    .attr("x", function(d) { return d.x; })
    .attr("y", function(d) { return d.y; })
    .text(function(d) {
      return d.id;
    });

var link = svg.select('.links')
  .selectAll('line')
  .data(graph.links)
  .enter().append('line');

function update(graph) {
  link
    .data(graph.links)
    .attr('stroke', getColor);

  node
    .data(graph.nodes)
    .attr('fill', getColor)
    .attr('stroke', assignStroke);

  simulation
    .nodes(graph.nodes)
    .on('tick', ticked);

  simulation.force('link')
    .links(graph.links);

  function ticked() {
    link
      .attr('x1', function(d) {
        return d.source.x;
      })
      .attr('y1', function(d) {
        return d.source.y;
      })
      .attr('x2', function(d) {
        return d.target.x;
      })
      .attr('y2', function(d) {
        return d.target.y;
      });

    node
      .attr('cx', function(d) {
        return d.x;
      })
      .attr('cy', function(d) {
        return d.y;
      });
  }
}

update(graph);

function getColor(d) {
  switch (d.type) {
    case NONE:
      return 'black';
    case SOURCE:
      return 'lightgreen';
    case TARGET:
      return 'lightcoral';
    case VISITED:
      return 'lightskyblue';
    case FRONTIER:
      return 'mediumslateblue';
    case EDGE:
      return 'lightgrey';
    default:
      return 'red';
  }
}

function assignStroke(d) {
  switch (d.stroke) {
    case SOURCE:
      return 'lightgreen';
    case TARGET:
      return 'lightcoral';
    default:
      return 'none';
  }
}

let frozen = false;

function dragstarted(d) {
  console.log(d.id);
  if(!frozen) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
}

function dragged(d) {
  if(!frozen) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

function freeze() {
  frozen = true;
  simulation.alphaTarget(0);
}

function unfreeze() {
  frozen = false;
}

// Utility Funtions
function markVisited(node) {
  if(node.type != SOURCE) {
    node.type = VISITED;
  }
  node.visited = true;
}

function getNode(graph, id) {
  return graph.nodes.filter(node => node.id == id)[0];
}

function getAdjEdges(graph, node, undirected = true) {
  let test = undirected ?
    link => link.source == node || link.target == node :
    link => link.source == node;
  return graph.links.filter(test);
}

function markFrontier(node) {
  node.type = FRONTIER;
}

function resetGraph() {
  graph.nodes.forEach((node) => {
    node.type = NONE,
    node.visited = false
  });
}