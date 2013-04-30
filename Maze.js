//Key codes for arrow keys.
function Position(x,y){
    this.x = x;
    this.y = y;
    this.getCoords = function(){
                        return "" + this.x + "/" + this.y;
    };
    this.equals =
        function(other){
            return (other.x == this.x && other.y == this.y);
    };
}

function Layout(sqSize, xLength, yLength){
    this.sqSize = sqSize;
    this.xLength = xLength;
    this.yLength = yLength;
    this.color = "#45c5f7";
    this.color2 = "#e05f26"; //orange
    this.color3 = "#2a1f47"; //purple
    this.heroPosition = new Position(0,0);
    this.portalPosition; 
    this.hero = new Piece(this.sqSize, this.heroPosition, "hero");
    this.sqaures;
    this.level = 1;
    this.score = 0;
    this.time = 0;
    this.canAccessTime = true;
    this.squaresUsed = 1;
    this.createBoard();
}

//Change into classes that inherit shit

function Piece(size, pos, name){
    this.elem = document.createElement("img");
    this.elem.src = "images/" + name + ".png" ;
    this.elem.setAttribute("id", name);
    this.elem.setAttribute("height", size);
    this.elem.setAttribute("width", size );
    this.name = name;
    this.pos = pos;
}

function Square(sqSize, color, x, y){
    this.x = x;
    this.y = y;
    this.canWalk = false;
    this.id = "" + x + "/" + y;
    this.sqSize = sqSize;
    this.has;
    var div = "<div id=" + this.id + " style = \"";
    div += "background-color: " + color +";";
    div += "position : absolute; left: " + x * this.sqSize+  "; ";
    div += "top : " + y * this.sqSize + "; ";
    div += "width : " + this.sqSize + "; ";
    div += "height : " + this.sqSize + " \">"; //End of style tag.
    div += "</div>";
    this.divTag = div;
    this.bombs = 0;
}

function Square_changeColor(color){
    document.getElementById(this.id).background.color = color;
}

Square.prototype.changeColor = Square_changeColor;


function Layout_createBoard(){
    this.hero = new Piece(this.sqSize, this.heroPosition, "hero");
    this.squares = new Array(this.yLength);
    for(var i = 0; i < this.squares.length; i++){
        this.squares[i] = new Array(this.xLength);
    }

    if(document.getElementById("womp") == null){
        document.write("<audio id=\"womp\" src=\"womp.mp3\" preload = \"auto\" > </audio>");
    }

    document.write((document.getElementById("board") == null) ? "<div id = \"board\">" : "");
    for(var x = 0; x < this.xLength; x++){
        for(var y = 0; y < this.yLength; y++){
            var sq = new Square(this.sqSize, this.color2, x, y);
            this.squares[y][x] = sq;
            if(document.getElementById("board") == null){
                document.getElementById("board").appendChild(sq.divTag);
            } else {
                document.write(sq.divTag);
            }
        }
    }

    document.write(this.createText());
    
    document.write((document.getElementById("board") == null) ?  "" : "");

    
    this.makeRandomPath();
    document.getElementById(this.heroPosition.getCoords()).appendChild(this.hero.elem);
    this.squares[this.heroPosition.y][this.heroPosition.x].has = "hero";
    //this.putBombs();

}

function Layout_createText(){
    var leftPos = (this.xLength + 1) * this.sqSize;
    return  ("<p id = \"score\" style = \"position: absolute; left: " + leftPos + ";font-size: 14pt; font-family: Arial, Helvetica, sans-serif;\"> Level: " + this.level + "<br>Score: " + this.score + "<br><br>Time: " + this.time + "</p>");
}


function Layout_deleteBoard(){
     var board = document.getElementById("board");
     while(board.hasChildNodes()){
         board.removeChild(board.firstChild);
     }
     this.squaresUsed = 1;
}

Layout.prototype.createBoard = Layout_createBoard;
Layout.prototype.deleteBoard = Layout_deleteBoard;
Layout.prototype.createText = Layout_createText;

function Layout_validPos(pos){
    return (pos.x >= 0 && pos.x < this.xLength && pos.y >= 0 && pos.y < this.yLength);
}

Layout.prototype.validPos = Layout_validPos;

function Layout_moveGuy(x, y){
    var xPos = this.heroPosition.x + x,
        yPos = this.heroPosition.y + y,
        newPos = new Position(xPos, yPos);

    if(this.validPos(newPos) && (this.squares[yPos][xPos].canWalk)){
        document.getElementById(this.heroPosition.getCoords()).removeChild(this.hero.elem);
        this.heroPosition =  newPos;
        if(this.squares[this.heroPosition.y][this.heroPosition.x].has == "portal"){
            this.nextLevel();
        } else {
            this.squares[this.heroPosition.y][this.heroPosition.x].has == "hero";
            document.getElementById(this.heroPosition.getCoords()).innerHTML = "";
            document.getElementById(this.heroPosition.getCoords()).appendChild(this.hero.elem);
        }
    } else {
        document.getElementById("womp").play();
        alert("EXPLOSION! .\nTry climbing again.");
        this.restart();
    }
}

function Layout_restart(){
    this.level = 1;
    this.score = 0;

    if(this.canAccessTime){ //Is this necessary?
        this.canAccessTime = false;
        this.time = 0;
        this.canAccessTime = true;
    }
        
    this.heroPosition = new Position(0,0);
    this.deleteBoard();
    this.createBoard();
}

function Layout_nextLevel(){
    this.level++;
    this.score += (10000 / this.time >> 0) + 500;
    if(this.canAccessTime){
        this.canAccessTime = false;
        this.time = 0;
        this.canAccessTime = true;
    }
    this.heroPosition = new Position(0, this.portalPosition.y);
    this.deleteBoard();
    this.createBoard();
}

Layout.prototype.nextLevel = Layout_nextLevel;
Layout.prototype.restart = Layout_restart;

function Layout_keyPressDoer(obj){
    var LEFT = '37',
        UP = '38',
        RIGHT = '39',
        DOWN = '40';
    function wrap(e){
        var key = e.keyCode;
        if(key == LEFT || key == 'A'.charCodeAt(0)){
            obj.moveGuy(-1,0);
        } else if (key == RIGHT || key == 'D'.charCodeAt(0)) { 
            obj.moveGuy(1,0);
        } else if (key == UP || key == 'W'.charCodeAt(0)) { 
            obj.moveGuy(0,-1);
        } else if (key == DOWN || key == 'S'.charCodeAt(0)) { 
            obj.moveGuy(0,1);
        }
    }
    return wrap;
}

Layout.prototype.moveGuy = Layout_moveGuy;
Layout.prototype.keyPressDoer = Layout_keyPressDoer;

function Layout_makeRandomPath(){
    var currPos = new Position(this.heroPosition.x, this.heroPosition.y);
    document.getElementById(currPos.getCoords()).style.background = this.color;
    var U = 0,
        D = 1,
        R = 2,
        L = 3,  
        previous = 5, 
        counter = 0,
        random;

    do{
        random = Math.floor(Math.random() * 3);
        var newPos = new Position(currPos.x, currPos.y);
        
        if(previous == random){
            continue;
        }
        previous = random;

        if (random == D){
            newPos.y = currPos.y + 1;
        } else if (random == R){
            newPos.x = currPos.x + 1; 
        } else if (random == L){ 
            newPos = currPos.x - 1;
        } else if (random == U){
            newPos.y = currPos.y - 1;
        }
        if(!currPos.equals(newPos) && this.validPos(newPos) && !this.squares[newPos.y][newPos.x].canWalk && !newPos.equals(this.heroPosition)){
            var node = document.getElementById(newPos.getCoords());
            node.style.background = this.color;
            this.squares[newPos.y][newPos.x].canWalk = true;
            counter = 0;
            currPos = newPos;
            this.squaresUsed++;
        } else {
            counter++;
        }
    }while(currPos.x < this.xLength - 1 && counter < 10);

    var portal = new Piece(this.sqSize, currPos, "portal");
    document.getElementById(currPos.getCoords()).appendChild(portal.elem);
    this.squares[currPos.y][currPos.x].has = "portal";
    this.portalPosition = currPos;
}

Layout.prototype.makeRandomPath = Layout_makeRandomPath;

function Layout_putBombs(){
    var numOfBombs = this.level * 3 + 40.
        x,
        y;
    if(numOfBombs >= (this.xLength * this.yLength) - this.squaresUsed){
        //iterate through every square. If i cant walk on it, the increment bombs
        //I should change this. Game becomes stupidly easy.
        for(x = 0; x < this.squares[0].length; x++){
            for(y = 0; y < this.squares.length; y++){
                if(!this.squares[y][x].canWalk){
                    this.updateAdjBombs(this.squares[y][x]);
                }
            }
        }
    } else {
        var counter = 0;
        while(numOfBombs > 0 && counter < 20){
             x = (Math.random() * this.xLength) >> 0;
             y = (Math.random() * this.yLength) >> 0;
            if(this.squares[y][x].canWalk || this.squares[y][x].has == "bomb"){
                counter++;
            } else {
                counter = 0;
                this.squares[y][x].has = "bomb";
                this.updateAdjBombs(this.squares[y][x]);
                numOfBombs--;
            }
        }
    }
    for(x = 0; x < this.squares[0].length; x++){
        for(y = 0; y < this.squares.length; y++){
            var text = "<p class = \"number\">";
            text += this.squares[y][x].bombs + "</p>";
            if(document.getElementById(this.squares[y][x].id).innerHTML === ""){
                document.getElementById(this.squares[y][x].id).innerHTML = text;
            }
        }
    }
}

Layout.prototype.putBombs = Layout_putBombs;

function Layout_updateAdjBombs(square){
    var x, 
        y;
    for(x = square.x - 1; x <= square.x + 1 ; x++){
        if(x >= 0 && x < this.squares[0].length){
            for(y = square.y - 1; y <= square.y + 1; y++){
                if(y >= 0 && y < this.squares.length){
                    this.squares[y][x].bombs++;
                }
            }
        }
    }
    this.squares[square.y][square.x].bombs--;
    this.squares[square.y][square.x].has = "bomb";
}
            
Layout.prototype.updateAdjBombs = Layout_updateAdjBombs;


function load(){
    var layout = new Layout(50,20,10);

    //Time increaser
    setInterval(function(){
        if(layout.canAccessTime){
            layout.canAccessTime = false;
            layout.time++;
            document.getElementById("score").parentNode.removeChild(document.getElementById("score"));
            document.write(layout.createText());
            layout.canAccessTime = true;
        }
    }, 1000);

    document.onkeydown = layout.keyPressDoer(layout);
}
