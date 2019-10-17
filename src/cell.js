"use strict";
// spots
var STARTER_WALL = "s";
var END_WALL = "f";
var ROUTE_WALL = "e";
var BLACK_WALL = "w";
var EDGE_WALL = "edge";
var Cell = /** @class */ (function () {
    function Cell(type) {
        this.value = type;
        this.row = 0;
        this.col = 0;
        this.x = 0;
        this.y = 0;
    }
    /**
     * Get cell specific color
     *
     * @return string
     */
    Cell.prototype.getColor = function () {
        var color;
        switch (this.value) {
            case "w":
                color = "#212121";
                break;
            case "e":
                color = "#fff";
                break;
            case "s":
                color = "#22cc5b";
                break;
            case "f":
                color = "#e52727";
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
    return Cell;
}());
