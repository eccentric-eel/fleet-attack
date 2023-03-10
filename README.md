## Features
* Built with Vue and Vuex
* Support for desktop and mobile
## Gameplay
Fleet Attack is a turn-based strategy game with one player facing off against a computer opponent. You must use a combination of skill and luck to destroy the enemy's fleet before it can destroy your own.
#### Positioning Phase
The game is played on an 8x8 board with each player having 4 ships to position as they choose:
 - Battleship (5 hit pts)
 - Cruiser (4 hit pts)
 - Destroyer (3 hit pts)
 - Submarine (2 hit pts)
 
Once a ship has been placed in a valid location on the game board, it's position will be highlighted and other ships will be unable to occupy those same tiles. Clicking on the green 'ROTATE' button at the bottom of the screen will toggle the orientation of the ship about to be placed. Continue placing ships until the entire fleet is positioned on the board.
 
#### Attack Phase
The first attack goes to player 1. Choose a tile on the enemy's board to fire upon and reveal whether or not the tile is occupied. If a hit is scored, the tile will be shaded in orange. if not, it becomes transparent and is removed from the board.
After firing on a tile the game progresses and the computer has a turn to do the same. This process continues until all ships in the player or computer's fleet have been completely destroyed. 

## License
Fleet Attack is released without restriction on use under the terms of the MIT License. © Brandon Sterling 2023
