var pointinpoly = function (point, vs) {
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
    var x = point[0], y = point[1];
    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];
        var intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect){
            inside = !inside;
        }
    }
    return inside;
};

// tests

var vs = [[1,0],[1,2],[0,2],[0,3],[1,3],[1,4],[2,4],[2,3],[3,3],[3,2],[4,2],[4,1],[3,1],[3,2],[2,2],[2,0]];

console.assert(pointinpoly([1.5, 2.5], vs));
console.assert(pointinpoly([1.99, 3.99], vs));
console.assert(pointinpoly([3.1, 1.1], vs));
console.assert(!pointinpoly([0.5, 0.5], vs));
console.assert(!pointinpoly([3.1, 2.1], vs));

