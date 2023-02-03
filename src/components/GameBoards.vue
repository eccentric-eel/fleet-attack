<template>
    <section class="board" :class="{ hide: hideBoard }">
        <div class="xIndex">
            <span>A</span><span>B</span><span>C</span><span>D</span>
            <span>E</span><span>F</span><span>G</span><span>H</span>
        </div>
        <div class="yIndex">
            <span>1</span><span>2</span><span>3</span><span>4</span>
            <span>5</span><span>6</span><span>7</span><span>8</span>
        </div>
        <div id="gameBoard__main__enemy">
            <div v-for="(coordinate, index) in this.$store.getters.getEnemyBoard" @click="playerHit($event, index)" class="active" :ref="enemyBoardRefs"></div>
        </div>
    </section>

    <section class="board">
        <div class="xIndex">
            <span>A</span><span>B</span><span>C</span><span>D</span>
            <span>E</span><span>F</span><span>G</span><span>H</span>
        </div>
        <div class="yIndex">
            <span>1</span><span>2</span><span>3</span><span>4</span>
            <span>5</span><span>6</span><span>7</span><span>8</span>
        </div>
        <div id="gameBoard__main__player">
            <div v-for="(coordinate, index) in this.$store.getters.getPlayerBoard" class="active" :ref="playerBoardRefs" @mouseover="highlightShip(index)"  @click="placePlayerShip(index)"></div>
        </div>
    </section>
</template>

<script>
    export default {
        name: 'GameBoards',
        data: function() {
            return {
                eRefs:      [], //array of refs to each tile on enemy board
                pRefs:      [], //array of refs to player board tiles
                pHighlight: [], //array of tiles currently highlighted during player ship placement
            }
        },
        props: { playerType: String },
        computed: {
            mobileHighlightIsSet: function() { return this.$store.getters.getMobileHighlightIsSet },

            placeShipsPhase: function() { return this.$store.getters.getPlaceShipsPhase },
            boatOrientFound: function() { return this.$store.getters.getBoatOrientFound },
            playerBoard: function()     { return this.$store.getters.getPlayerBoard },
            playerName: function()      { return this.$store.getters.getPlayerName },
            enemyName: function()       { return this.$store.getters.getEnemyName },
            placeOrient: function()     { return this.$store.getters.getPlaceOrient },
            eHitOrient: function()      { return this.$store.getters.getEHitOrient },
            eHit1: function()           { return this.$store.getters.getEHit1 },
            eHit2: function()           { return this.$store.getters.getEHit2 },
            shipsHitPts: function()     { return this.$store.getters.getShipsHitPts },
            ships: function()           { return this.$store.getters.getShips },
            hideBoard: function()       { return this.placeShipsPhase }, //hide enemy board during place ships phase
            isMobile: function()        { return this.$store.getters.getIsMobile }
        },
        methods: {
            enemyBoardRefs(element)  { this.eRefs.push(element) },
            playerBoardRefs(element) { this.pRefs.push(element) },
            highlightShip(index) {    
                this.$store.commit('updateMobileHighlightIsSet', { 'val': true });
                   
                if(this.placeShipsPhase === true) {
                    let initialTileAt = index;
                    let tileCount = this.shipsHitPts[0] //number of tiles to be highlighted (depending on ship type)
                    let rowNum = Math.floor(index / 8); //determine if placement is all on same row
                    let nextTileAt = (this.placeOrient === "up/down") ? 8 : 1; //how many tiles to skip for same row(1)/column(8)

                    this.removeHighlights(); 

                    if(!this.checkValidHighlight(index)) {
                        this.removeHighlights();
                        return;
                    }

                    this.pHighlight.push(index);
                    this.pRefs[index].classList.add("temp"); //highlight tile cursor is hovering on

                    for(let i=1; i<tileCount; i++) { //highlight additional tiles according to hit size
                        index += nextTileAt;

                        if((index < this.playerBoard.length  && this.placeOrient === "up/down") ||
                        (Math.floor(index / 8) === rowNum && this.placeOrient === "left/right")) {
                            this.pRefs[index].classList.add("temp");
                            this.pHighlight.push(index);

                            if(!this.checkValidHighlight(index)) {
                                this.removeHighlights(); 
                                return;
                            }
                        }
                        else {
                            this.pRefs[initialTileAt - nextTileAt].classList.add("temp")
                            this.pHighlight.push(initialTileAt - nextTileAt);
                            initialTileAt -= nextTileAt;

                            if(!this.checkValidHighlight(initialTileAt)) {
                                this.removeHighlights(); 
                                return;
                            }
                        }
                    }
                }
            },
            checkValidHighlight(index) {
                if(this.pRefs[index].classList.contains("battleship") || this.pRefs[index].classList.contains("cruiser") || 
                this.pRefs[index].classList.contains("destroyer")  || this.pRefs[index].classList.contains("submarine"))
                    return false;
                else
                    return true;
            },
            removeHighlights() {
                while(this.pHighlight.length !== 0 ) { 
                    this.pRefs[this.pHighlight[0]].classList.remove("temp");
                    this.pHighlight.shift();
                }
            },
            placePlayerShip(index) { 
                if(this.isMobile) { 
                    if(this.mobileHighlightIsSet) {
                        this.$store.commit('updateMobileHighlightIsSet', { 'val': false });
                        return;
                    }
                }

                //check if ships still need to be placed && if new ship placement is valid
                if(this.ships.length !== 0 && this.pHighlight.length !== 0) {
                    this.pHighlight.forEach(tile => {
                        this.pRefs[tile].classList.remove("temp");
                        this.pRefs[tile].classList.add(this.ships[0]);
                    });

                    this.$store.commit('nextShipType'); //update to next ship type (ex: battleship->cruiser)
                    this.$store.commit('updateShipArrays');
                    this.pHighlight = [];

                    if(this.ships.length === 0)
                        this.$store.commit('endPlaceShipsPhase');
                }
            },
            placeEnemyShip(shipType, hitSize) {
                //board width is 8 tiles -------> left: -1; right: +1; up: -8; down: +8;
                const orientations = [-1, 1, -8, 8];
                let orientation = orientations[Math.floor(Math.random() * 4)];
                let position = 0;

                for(let i=1; i<hitSize; i++) {
                    if(i === 1) { //determine if places are valid before placing
                        let validPlacement = false;

                        while(!validPlacement) {
                            position = Math.floor(Math.random() * 64);

                            for(let j=0; j<hitSize; j++) {

                                let xPos = position % 8;
                                let yPos = Math.floor(position / 8); //CHECK FOR DIVIDE BY ZERO!!!!!!!!!!!!-------------------------

                                if((orientation === -1 && (xPos - hitSize >= -1)) || (orientation ===  1 && (xPos + hitSize <=  8)) ||
                                   (orientation === -8 && (yPos - hitSize >= -1)) || (orientation ===  8 && (yPos + hitSize <=  8))) {

                                    validPlacement = true;
                                    let tmpPosition = position;

                                    for(let k=0; k<hitSize; k++) {
                                        if(this.eRefs[tmpPosition].classList.contains('battleship') || this.eRefs[tmpPosition].classList.contains('cruiser') ||
                                           this.eRefs[tmpPosition].classList.contains('destroyer')  || this.eRefs[tmpPosition].classList.contains('submarine')) {
                                            
                                            validPlacement = false;
                                            break;
                                        }  
                                        tmpPosition = tmpPosition + orientation;
                                    }
                                    if(!validPlacement)
                                        break;
                                }
                                if(!validPlacement)
                                    break;
                            }
                        }
                        this.eRefs[position].classList.add(shipType);     
                    }
                    position = position + orientation; //ex: position = 38 + -1 (or 37) 
                    this.eRefs[position].classList.add(shipType);
                }
            },
            playerHit(event, index) {
                if(event.target.classList.contains('active')) { //dont register click if user has already clicked on particular tile

                    index = this.formatIndexNum(index); // ex: format to 'A5', 'B7', etc for output
                    let noMatch = true; //user did or didn't hit a ship

                    this.ships.forEach(ship => {
                        if(event.target.classList.contains(ship)) {
                            event.target.classList.add('hit');
                            event.target.classList.remove('active');

                            noMatch = false; //user hit a ship 
                            this.$store.commit('updateEventsLog', { class: 'pHit', text: `${this.playerName} scores a hit at block ${index}` });

                            switch(ship) {
                                case "battleship":
                                    this.$store.commit('decrementEBattleship');
                                    break;
                                case "cruiser":
                                    this.$store.commit('decrementECruiser');
                                    break;
                                case "destroyer":
                                    this.$store.commit('decrementEDestroyer');
                                    break;
                                case "submarine":
                                    this.$store.commit('decrementESubmarine');
                            }   
                        }
                    });

                    if(noMatch) { //user did not hit a ship
                        event.target.classList.remove('active');
                        this.$store.commit('updateEventsLog', { class: '', text: `${this.playerName} misses at block ${index}` });
                        this.$store.commit('togglePreventClicks');

                        setTimeout(()=> this.enemyHit(), 1000); //switch to enemy's turn after built-in delay
                    }
                    this.$store.commit('incrementTurnCounter');
                }
            },
            enemyHit() {
                let selectedEl = Math.floor(Math.random() * this.playerBoard.length);
                let orientations = this.eHitOrient;               

                if(this.eHit2) { //2 hits on target (boat orientation determined)
                    while(true) {
                        let tmp1 = this.eHit1 + orientations[0];
                        let tmp2 = this.eHit2 + orientations[0];

                        let a = Math.floor(this.eHit2 / 8);
                        let b = Math.floor((this.eHit2 + orientations[0]) / 8);

                        if((tmp2 >= 0 && tmp2 < this.playerBoard.length) && this.pRefs[tmp2].classList.contains("active")) {
                            if(((orientations[0] === 1 || orientations[0] === -1) && a === b) || orientations[0] === 8 || orientations[0] === -8) {
                                selectedEl = tmp2;
                                break;
                            }
                        }
                            
                        orientations.shift(); 

                        if(orientations.length === 0) {
                            this.$store.commit('updateEHit2', { 'val': null }); //no suitable move on this end, go back to other end
                            this.$store.commit('findShipOrientation'); //reset eHitOrient to all orientations again
                            
                            orientations = this.eHitOrient;
                            selectedEl = this.hitAfterOneHit(selectedEl, orientations);
                            break;
                        }
                    }
                }
                else if(this.eHit1) //only 1 hit on target, hit adjacent tile
                    selectedEl = this.hitAfterOneHit(selectedEl, orientations);
                else //no hits on target, choose a random tile
                    selectedEl = this.getRandomActiveTile();
                
                let index = this.formatIndexNum(selectedEl);
                let hitOnShip = this.checkHitOnShip(selectedEl, index);

                if(!hitOnShip) {
                    this.pRefs[selectedEl].classList.remove("active");
                    this.$store.commit('updateEventsLog', { class: '', text: `${this.enemyName} misses at block ${index}` });
                    this.$store.commit('updateEHit2', {'val': null});   
                }
                setTimeout(()=> this.$store.commit('closePreventClicks'), 500);
            },
            clearBoards() {
                this.eRefs.forEach(el => {
                    el.className = ""; //remove any/all classes attached to el
                    el.classList.add("active"); //add default 'active' class to el
                });
                this.pRefs.forEach(el => {
                    el.className = "";
                    el.classList.add("active");
                });
            },
            formatIndexNum(index) {
                let xArray = ['A','B','C','D','E','F','G','H'];
                let indexLetter = xArray[(index % 8)];
                let indexNumber = (Math.floor(index / 8)) + 1; //+1 to convert indexNum from 0-based array

                return indexLetter + indexNumber;
            },
            getRandomActiveTile() {
                //pick any random tile on player board
                let randomTile = Math.floor(Math.random() * this.playerBoard.length);

                while(!this.pRefs[randomTile].classList.contains("active"))
                    randomTile = Math.floor(Math.random() * this.playerBoard.length);  //already hit, retry

                //random tile with 'active' class found; return its value
                return randomTile;
            },
            checkHitOnShip(selectedEl, index) {
                let hitOnShip = false;

                this.ships.forEach(ship => {
                    if(this.pRefs[selectedEl].classList.contains(ship)) {

                        hitOnShip = true;
                        this.pRefs[selectedEl].classList.add("hit");
                        this.pRefs[selectedEl].classList.remove("active");
                        this.$store.commit('updateEventsLog', { class: 'eHit', text: `${this.enemyName} scores a hit at block ${index}`});               
        
                        if(this.eHit1) {
                            this.$store.commit('updateEHit2', { 'val': selectedEl });

                            if(!this.boatOrientFound)
                                this.$store.commit('findShipOrientation');
                        }
                        else
                            this.$store.commit('updateEHit1', { 'val': selectedEl });

                        switch(ship) {
                            case "battleship":
                                this.$store.commit('decrementPBattleship');
                                break;
                            case "cruiser":
                                this.$store.commit('decrementPCruiser');
                                break;
                            case "destroyer":
                                this.$store.commit('decrementPDestroyer');
                                break;
                            case "submarine":
                                this.$store.commit('decrementPSubmarine');
                        }
                    }
                });
                return hitOnShip;
            },
            hitAfterOneHit(selectedEl, orientations) {
                let flag = false;

                while(true) {
                    let tmp = this.eHit1 + orientations[0];
                    //a and b used to make sure next hit is on the same row or different rows and same column
                    let a = Math.floor(this.eHit1 / 8);
                    let b = Math.floor((this.eHit1 + orientations[0]) / 8);

                    //selectedEl is within board bounds and is active
                    if((tmp >= 0 && tmp < this.playerBoard.length) && this.pRefs[tmp].classList.contains("active")) {       
                        if(((orientations[0] === 1 || orientations[0] === -1) && a === b) || orientations[0] === 8 || orientations[0] === -8) {
                            selectedEl = tmp;
                            break;
                        }
                    }
                    orientations.shift();

                    if(orientations.length === 0 && flag === false) {
                        orientations = [-1, 1, -8, 8];
                        flag = true;
                    }
                    if(orientations.length === 0 && flag === true) {
                        selectedEl = this.getRandomActiveTile(); //no valid tile in any direction, pick random tile
                        break;
                    } 
                }
                return selectedEl;
            }
        }
    }
</script>

<style scoped lang="scss">
    .board {
        position: relative;
        display: flex;
        flex: 1;
    
        .xIndex, .yIndex {
            position: absolute;
            display: flex; 
            justify-content: space-between; 

            span {
                flex: 1;
                margin: 2px;
                text-align: center;
                font-size: .6rem;
                font-weight: bold;
            }
        }
        .xIndex {
            width: 100%;
            margin-top: -1rem;
        }
        .yIndex {
            height: 100%;
            margin-left: -1rem;
            flex-direction: column;

            span {
                display: flex;
                flex-direction: column;
                justify-content: center;
            }
        }

        &:nth-child(3) { margin-top: 1.5rem }
        &.hide { display: none }
    }
    #gameBoard__main__player, #gameBoard__main__enemy {
        flex: 1;
        text-align: center;
        display: grid;
        grid-template-columns: repeat(8, 1fr);

        div {
            margin: 1px;
            border: 1px solid #333;
            border-radius: 4px;

            &.active, &.hit { border: 1px solid transparent }
        }
    }
    #gameBoard__main__enemy {

        div {
            background: none;
            transition: all .3s linear;

            &.active {
                cursor: pointer;
                background: #0059b3;
                

                &:hover {
                    background: #ff3333;
                    box-shadow: 0px 0px 5px #ff3333;
                }
            }
            &.hit {
                background: #ff944d;
                box-shadow: 0px 0px 5px #ff944d;
            }
        }
    }
    #gameBoard__main__player {

        div {
            &.active { background: #333 }
            &.battleship, &.cruiser, &.destroyer, &.submarine { background: #595959 }
            &.temp { 
                background: #00cc44;
                cursor: pointer;
            }
            &.hit {                
                background: #ff944d;
                box-shadow: 0px 0px 5px #ff944d;
            }
        }
    }
</style>