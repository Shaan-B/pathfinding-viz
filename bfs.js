// Implementation class for BFS

var searcher = {
  source: -1,
  target: -1,
  q: [],
  done: false,
  init: function(graph, source, target) {
    this.source = getNode(graph, source);
    this.target = getNode(graph, target);

    getNode(graph, source).type = SOURCE;
    getNode(graph, target).type = TARGET;

    this.q.unshift(this.source);
  },
  step: function(graph) {
    q = this.q;
    if(this.done || q.length == 0) { return true; }
    x = q.pop();
    if(!x.visited) {
      markVisited(x);

      adjEdges = getAdjEdges(graph, x);
      adjEdges.forEach((edge) => {
        var next = edge.source === x ?
          edge.target : edge.source;
        if(!next.visited) {
          if(next === this.target) {
            done = true;
            return true;
          }
          q.unshift(next);
          markFrontier(next);
        }
      });
    }
    return false;
  }
}
