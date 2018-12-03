// Implementation class for A* search

let dijkstra = () => {
    return {
        source: -1,
        target: -1,
        done: false,
        init: function (graph, source, target = null) {
            function comparator(a, b) {
                return a.f - b.f;
            }

            this.source = getNode(graph, source);
            this.source.type = SOURCE;
            this.source.stroke = SOURCE;

            this.target = getNode(graph, target);
            this.target.type = TARGET;
            this.target.stroke = TARGET;

            sourceObj = {
                node: this.source,
                g: 0,
                f: this.distanceBetween(this.source, this.target)
            };

            this.open = new TinyQueue([sourceObj], comparator);
            this.openSet = new Set([this.source]); // easy lookup
            this.closed = new Set();
        },
        step: function (graph) {
            if (this.done || this.open.length == 0) { return true; }
            x = this.open.pop();
            this.openSet.delete(x.node);
            if (x.node === this.target) {
                markVisited(x.node);
                this.done = true;
                return true;
            }
            this.closed.add(x.node);
            markVisited(x.node);
            adjEdges = getAdjEdges(graph, x.node);
            adjEdges.forEach((edge) => {
                var next = edge.source === x.node ?
                    edge.target : edge.source;
                if (!this.closed.has(next) && !this.openSet.has(next)) {
                    gPrime = x.g + this.distanceBetween(x.node, next);
                    fPrime = gPrime;
                    this.open.push({
                        node: next,
                        g: gPrime,
                        f: fPrime
                    });
                    this.openSet.add(next);
                    markFrontier(next);
                }
            });
        },
        distanceBetween: function (a, b) {
            return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
        }
    }
}