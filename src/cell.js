"use strict";
// spots
var STARTER_WALL = "s";
var END_WALL = "f";
var ROUTE_WALL = "e";
var BLACK_WALL = "w";
var EDGE_WALL = "edge";
var PATH_WALL = "p";
var Cell = /** @class */ (function () {
    function Cell(type) {
        this.value = type;
        this.row = 0;
        this.col = 0;
        this.x = 0;
        this.y = 0;
        this.next = null;
        this.bgColor = "trans";
    }
    /**
     * Get cell specific color
     *
     * @return string
     */
    Cell.prototype.getColor = function () {
        var color;
        switch (this.value) {
            case BLACK_WALL:
                color = "#212121";
                break;
            case ROUTE_WALL:
                color = "#fff";
                break;
            case STARTER_WALL:
                color = "#22cc5b";
                break;
            case END_WALL:
                color = "#e52727";
                break;
            case PATH_WALL:
                color = "orange";
                break;
            default:
                color = "gray";
                break;
        }
        return color;
    };
    /**
     * Set cell's row|colun
     *
     * @return void
     */
    Cell.prototype.setPosition = function (position) {
        this.row = position.row;
        this.col = position.col;
        this.x = position.col;
        this.y = position.row;
    };
    Cell.prototype.getNeighbors = function () {
        return [
            [this.y - 1, this.x],
            [this.y, this.x - 1],
            [this.y, this.x + 1],
            [this.y + 1, this.x]
        ];
    };
    return Cell;
}());
