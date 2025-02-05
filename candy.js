
// Define an array of candy colors
var candies = ["Blue", "Orange", "Green", "Yellow", "Red", "Purple"];
// Initialize the game board as an empty array
var board = [];
// Set the number of rows on the game board
var rows = 9;
// Set the number of columns on the game board
var columns = 9;
// Initialize the player's score to 0
var score = 0;

// Declare variables to keep track of the currently selected tile and the tile it is swapped with
var currTile;
var otherTile;

// Execute this function when the window finishes loading
window.onload = function() {
    // Start the game setup
    startGame();

    // Set an interval to continuously check and process game state updates
    window.setInterval(function(){
        // Crush matching candies
        crushCandy();
        // Move candies down if there are empty spaces
        slideCandy();
        // Generate new candies at the top if there are empty spaces
        generateCandy();
    }, 100); // The interval is set at 100 milliseconds
}

// Returns a random candy color from the candies array
function randomCandy() {
    return candies[Math.floor(Math.random() * candies.length)]; // Generate a random index from 0 to the length of the candies array minus one
}

// Initializes the game board with random candies
function startGame() {
    // Loop through each row
    for (let r = 0; r < rows; r++) {
        let row = []; // Temporary array to hold the row's tiles
        // Loop through each column in the current row
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("img"); // Create a new img element for the candy
            tile.id = r.toString() + "-" + c.toString(); // Set the tile's ID to its row-column position
            tile.src = "./images/" + randomCandy() + ".png"; // Assign a random candy image to the tile

            // Add event listeners for drag and drop functionality
            tile.addEventListener("dragstart", dragStart); // Initiates dragging
            tile.addEventListener("dragover", dragOver);  // Allows a drag to occur over this tile
            tile.addEventListener("dragenter", dragEnter); // Triggered when dragging enters the tile
            tile.addEventListener("dragleave", dragLeave); // Triggered when dragging leaves the tile
            tile.addEventListener("drop", dragDrop); // Handles dropping a tile onto this one
            tile.addEventListener("dragend", dragEnd); // Finalizes the drag operation

            document.getElementById("board").append(tile); // Add the tile to the game board in the DOM
            row.push(tile); // Add the tile to the current row array
        }
        board.push(row); // Add the current row to the game board array
    }


    console.log(board);
}

function dragStart() {
    //this refers to tile that was clicked on for dragging
    currTile = this;
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {

}

function dragDrop() {
    //this refers to the target tile that was dropped on
    otherTile = this;
}
// Function to handle the end of a drag event
function dragEnd() {
    // If the current or other tile is a blank space, terminate the function to prevent swapping with a blank
    if (currTile.src.includes("blank") || otherTile.src.includes("blank")) {
        return;
    }

    // Split the ID of the current tile to get its row and column coordinates
    let currCoords = currTile.id.split("-"); // id="0-0" -> ["0", "0"]
    let r = parseInt(currCoords[0]); // Convert row to integer
    let c = parseInt(currCoords[1]); // Convert column to integer

    // Split the ID of the other tile to get its row and column coordinates
    let otherCoords = otherTile.id.split("-");
    let r2 = parseInt(otherCoords[0]); // Convert row to integer
    let c2 = parseInt(otherCoords[1]); // Convert column to integer

    // Determine if the move is to the left, right, up, or down by comparing coordinates
    let moveLeft = c2 == c-1 && r == r2;
    let moveRight = c2 == c+1 && r == r2;
    let moveUp = r2 == r-1 && c == c2;
    let moveDown = r2 == r+1 && c == c2;

    // Check if the other tile is adjacent to the current tile in any direction
    let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

    // If the tiles are adjacent, swap their images
    if (isAdjacent) {
        let currImg = currTile.src;
        let otherImg = otherTile.src;
        currTile.src = otherImg;
        otherTile.src = currImg;

        // Check if the move is valid (typically, if it results in a match)
        let validMove = checkValid();
        // If not a valid move, swap the images back
        if (!validMove) {
            let currImg = currTile.src;
            let otherImg = otherTile.src;
            currTile.src = otherImg;
            otherTile.src = currImg;    
        }
    }
}

// Function to crush candies and update the score
function crushCandy() {
    // Potential function calls to crush different patterns, e.g., five in a row, four in a row
    //crushFive();
    crushFour(); // Crush four in a row
    crushThree(); // Crush three in a row
    document.getElementById("score").innerText = score; // Update the score display
}

// Function to identify and crush three consecutive identical candies
function crushThree() {
    // Check each row for three consecutive matching candies
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns-2; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c+1];
            let candy3 = board[r][c+2];
            // If three consecutive candies match and are not blank, replace them with blank images
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                candy1.src = "./images/blank.png";
                candy2.src = "./images/blank.png";
                candy3.src = "./images/blank.png";
                score += 30; // Increase score for each match
            }
        }
    }

    // Check each column for three consecutive matching candies
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows-2; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r+1][c];
            let candy3 = board[r+2][c];
            // If three consecutive candies match and are not blank, replace them with blank images
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                candy1.src = "./images/blank.png";
                candy2.src = "./images/blank.png";
                candy3.src = "./images/blank.png";
                score += 30; // Increase score for each match
            }
        }
    }
}

//Try on OWN "Four Candy Break"
function crushFour() {
    // Check rows for four in a row
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 3; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c + 1];
            let candy3 = board[r][c + 2];
            let candy4 = board[r][c + 3];
            if (candy1.src == candy2.src && candy2.src == candy3.src && candy3.src == candy4.src && !candy1.src.includes("blank")) {
                candy1.src = "./images/blank.png";
                candy2.src = "./images/blank.png";
                candy3.src = "./images/blank.png";
                candy4.src = "./images/blank.png";
                score += 40; // Adjust the score increment as needed
            }
        }
    }

    // Check columns for four in a row
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 3; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r + 1][c];
            let candy3 = board[r + 2][c];
            let candy4 = board[r + 3][c];
            if (candy1.src == candy2.src && candy2.src == candy3.src && candy3.src == candy4.src && !candy1.src.includes("blank")) {
                candy1.src = "./images/blank.png";
                candy2.src = "./images/blank.png";
                candy3.src = "./images/blank.png";
                candy4.src = "./images/blank.png";
                score += 40; // Adjust the score increment as needed
            }
        }
    }
}

// function crushFive(){
//     for(let r = 0; r < rows; r++){
//         for(let c = 0; c < columns - 4; c++){
//             let candy1 = board[r][c]
//             let candy2 = board[r][c + 1];
//             let candy3 = board[r][c + 2];
//             let candy4 = board[r][c + 3];
//             let candy5 = board[r][c + 4];
//             if (candy1.src == candy2.src && candy2.src == candy3.src && candy3.src == candy4.src && candy4.src == candy5.src && !candy1.src.includes("blank")) {
//                 candy1.src = "./images/blank.png";
//                 candy2.src = "./images/blank.png";
//                 candy3.src = "./images/blank.png";
//                 candy4.src = "./images/blank.png";
//                 candy5.src = "./images/blank.png";
//                 score += 50; // Adjust the score increment as needed
//             }
//         }
//     }

// for(let r = 0; r < rows; r++){
//     for(let c = 0; c < columns - 4; c++){
//         let candy1 = board[r][c]
//         let candy2 = board[r +1][c];
//         let candy3 = board[r + 2][c];
//         let candy4 = board[r + 3][c];
//         let candy5 = board[r + 4][c];
//         if (candy1.src == candy2.src && candy2.src == candy3.src && candy3.src == candy4.src && candy4.src == candy5.src && !candy1.src.includes("blank")) {
//             candy1.src = "./images/blank.png";
//             candy2.src = "./images/blank.png";
//             candy3.src = "./images/blank.png";
//             candy4.src = "./images/blank.png";
//             candy5.src = "./images/blank.png";
//             score += 50; // Adjust the score increment as needed
//         }
//     }
// }
// }

function checkValid() {
    //check rows
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns-2; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c+1];
            let candy3 = board[r][c+2];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                return true;
            }
        }
    }

    //check columns
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows-2; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r+1][c];
            let candy3 = board[r+2][c];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                return true;
            }
        }
    }

    return false;
}


function slideCandy() {
    for (let c = 0; c < columns; c++) {
        let ind = rows - 1;
        for (let r = columns-1; r >= 0; r--) {
            if (!board[r][c].src.includes("blank")) {
                board[ind][c].src = board[r][c].src;
                ind -= 1;
            }
        }

        for (let r = ind; r >= 0; r--) {
            board[r][c].src = "./images/blank.png";
        }
    }
}

function generateCandy() {
    for (let c = 0; c < columns;  c++) {
        if (board[0][c].src.includes("blank")) {
            board[0][c].src = "./images/" + randomCandy() + ".png";
        }
    }
}
