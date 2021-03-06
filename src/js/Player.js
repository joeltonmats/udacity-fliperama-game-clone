var Player = function () {
    Character.call(this);

    //img for player
    this.sprite = '../img/player_1.png';

    //start coordinates positions
    this.INIT_POSITION_X = 416;
    this.INIT_POSITION_Y = 470;

    // coordinates moves
    this.x = this.INIT_POSITION_X;
    this.y = this.INIT_POSITION_Y;

    //xplus and y plus used to manage itemEvilBlock interactivity
    this.xplus = 0;
    this.yplus = 0;

    // max limits to move player right and left
    this.LIMIT_RIGHT = 921;
    this.LIMIT_LEFT = 12;

    // jump coordinates for player movement
    this.JUMP_MOVE_X = 101;
    this.JUMP_MOVE_Y = 90;
};

Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function () {

    //player arrives on wate
    if (this.y === 20) {
        app.levelComplete.play();
        this.x = this.INIT_POSITION_X;
        this.y = this.INIT_POSITION_Y;
        app.levelUp();
    }

    /* flux control to player limits in game area */

    if (this.y >= this.INIT_POSITION_Y)
        this.y = this.INIT_POSITION_Y;

    if (this.x <= this.LIMIT_LEFT)
        this.x = this.LIMIT_LEFT;

    if (this.x >= this.LIMIT_RIGHT)
        this.x = this.LIMIT_RIGHT;

    /* Manage evilBlock */
    if (app.allItems.size > 0) {
        app.allItems.forEach(function (item) {
            if (this.x === item.x && (item.y - this.y >= -64 && item.y - this.y <= 0)) {
                if (item instanceof ItemEvilBlock) {
                    this.x = this.x - this.xplus;
                    this.y = this.y - this.yplus;
                } else {
                    if (item instanceof Treasure) {
                        app.points = app.points + item.TREASURE_VALUE;
                        $('#points').text(app.points);
                        app.allItems.delete(item.key);

                        //animation
                        $('.points-wrapper').addClass('animated slideInDown')
                        window.setTimeout(function () { $('.points-wrapper').removeClass('animated slideInDown '); }, 500);

                    } else {
                        if (item instanceof Life) {
                            app.addLife(true);
                            app.allItems.delete(item.key);
                        }
                    }
                }
            }
        }, this);
    }
};

/**
 * Moves player through the game area
 */
Player.prototype.handleInput = function (key) {
    this.xplus = 0;
    this.yplus = 0;

    switch (key) {
        case 'left':
            this.x = this.x - this.JUMP_MOVE_X;
            this.xplus = - this.JUMP_MOVE_X;
            break;
        case 'up':
            this.y = this.y - this.JUMP_MOVE_Y;
            this.yplus = - this.JUMP_MOVE_Y;
            break;
        case 'right':
            this.x = this.x + this.JUMP_MOVE_X;
            this.xplus = this.JUMP_MOVE_X;
            break;
        case 'down':
            this.y = this.y + this.JUMP_MOVE_Y;
            this.yplus = this.JUMP_MOVE_Y;
            break;
    }
};
