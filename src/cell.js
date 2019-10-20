"use strict";
// spots
var STARTER_WALL = "s";
var END_WALL = "f";
var ROUTE_WALL = "e";
var BLACK_WALL = "w";
var EDGE_WALL = "edge";
var PATH_WALL = "p";
var DFS_PATH_WALL = "dp";
// colors
var BLACK_COLOR = "#212121";
var WHITE_COLOR = "#ffffff";
var GREEN_COLOR = "#22cc5b";
var RED_COLOR = "#e52727";
var ORANGE_COLOR = "#FFA500";
var BLUE_COLOR = "#87CEEB";
var GRAY_COLOR = "#808080";
var TRANSPARENT_COLOR_NAME = "trans";
var BLUE_COLOR_NAME = "blue";
var ORANGE_COLOR_NAME = "orange";
var NONE_COLOR_NAME = "none";
var Cell = /** @class */ (function () {
    function Cell(type) {
        this.value = type;
        this.row = 0;
        this.col = 0;
        this.x = 0;
        this.y = 0;
        this.next = null;
        this.bgColor = "trans";
        this.visited = false;
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
                color = BLACK_COLOR;
                break;
            case ROUTE_WALL:
                color = WHITE_COLOR;
                break;
            case STARTER_WALL:
                color = GREEN_COLOR;
                break;
            case END_WALL:
                color = RED_COLOR;
                break;
            case PATH_WALL:
                color = ORANGE_COLOR;
                break;
            case DFS_PATH_WALL:
                color = BLUE_COLOR;
                break;
            default:
                color = GRAY_COLOR;
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
