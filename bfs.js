// Implementation class for BFS

var searcher = {
  source: -1,
  target: -1,
  q: [],
  done: false,
  init: function(graph, source, target=null) {
    this.source = getNode(graph, source);
    this.source.type = SOURCE;
    this.source.stroke = SOURCE;

    if(target) {
      this.target = getNode(graph, target);
      this.target.type = TARGET;
      this.target.stroke = TARGET;
    }
    else this.target = null;

    this.q.unshift(this.source);
  },
  step: function(graph) {
    q = this.q;
    if(this.done || q.length == 0) { return true; }
    x = q.pop();
    if(!x.visited) {
      markVisited(x);
      if(this.target && x === this.target) {
        this.done = true;
        return true;
      }

      adjEdges = getAdjEdges(graph, x);
      adjEdges.forEach((edge) => {
        var next = edge.source === x ?
          edge.target : edge.source;
        if(!next.visited) {
          q.unshift(next);
          markFrontier(next);
        }
      });
    }
    else {
      //Keep animation speed constant
      this.step(graph);
    }
    return false;
  }
}
