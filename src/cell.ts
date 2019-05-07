interface Position {
    readonly row: number;
    readonly col: number;
}

class Cell {
    /** @var string holds cell's value to be colored */
    value: string;
    /** @var number|null cell's row position */
    row: number | null;
    /** @var number|null cell's column position */
    col: number | null;

    constructor(type: string) {
        this.value = type;
        this.row = null;
        this.col = null;
    }

    /**
     * Get cell specific color
     * 
     * @return string
     */
    getColor (): string {
        let color: string;

        switch (this.value) {
            case 'w':
                color = '#212121';
                break;
            case 'e':
                color = '#fff';
                break;
            case 's':
                color = '#22cc5b';
                break;
            case 'f':
                color = '#e52727';
                break;
            default:
                color = 'gray';
                break;
        }

        return color;
    }

    /**
     * Set cell's row|colun
     * 
     * @return void
     */
    setPosition (position: Position): void {
        this.row = position.row;
        this.col = position.col;
    }
};
