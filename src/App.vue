<template>
    <main-modal @startNewGame="startNewGame()" />
    <restart-btn />
    <prevent-clicks />
    <notification-queue />

    <main>
        <section id="gameBoard">
            <player-sidebar playerType="player" />

            <div id="gameBoard__main">
                <position-instruct />
                <game-boards ref="gameBoards" />
            </div>

            <player-sidebar playerType="enemy" />
        </section>
        <game-log />
        <orient-select />
    </main>
</template>

<script>
    function launchConfetti(repeat) {
        for(let i=0; i<repeat; i++) {
            confetti({
                particleCount: 100,
                startVelocity: 50,
                spread: 360,
                origin: { x: Math.random(), y: Math.random() - 0.2 }
            });
        }
    }

    import RestartBtn from './components/RestartBtn.vue';
    import MainModal  from './components/MainModal.vue';
    import PreventClicks from './components/PreventClicks.vue';
    import GameBoards from './components/GameBoards.vue';
    import NotificationQueue from './components/NotificationQueue.vue';
    import PlayerSidebar from './components/PlayerSidebar.vue';
    import PositionInstruct from './components/PositionInstruct.vue';
    import OrientSelect from './components/OrientSelect.vue';
    import GameLog from './components/GameLog.vue';

export default {
    name: 'App',
    components: {
        RestartBtn,
        MainModal,
        PreventClicks,
        NotificationQueue,
        PlayerSidebar,
        PositionInstruct,
        OrientSelect,
        GameBoards,
        GameLog
    },
    computed: {
        isActiveGameLog: function() { return this.$store.getters.getIsActiveGameLog },
        isActiveOrient: function()  { return this.$store.getters.getIsActiveOrient },
        isActiveModal: function()   { return this.$store.getters.getIsActiveModal },
        isActiveP1: function()      { return this.$store.getters.getIsActiveP1 },
        isActiveP2: function()      { return this.$store.getters.getIsActiveP2 },
        isMobile: function()        { return this.$store.getters.getIsMobile },

        notificationCounter: function() { return this.$store.getters.getNotificationCounter },
        gameInProgress: function()      { return this.$store.getters.getGameInProgress },
        playerName: function()          { return this.$store.getters.getPlayerName },
        enemyName: function()           { return this.$store.getters.getEnemyName },

        pBattleship: function() { return this.$store.getters.getPBattleship },
        pCruiser: function()    { return this.$store.getters.getPCruiser },
        pDestroyer: function()  { return this.$store.getters.getPDestroyer },
        pSubmarine: function()  { return this.$store.getters.getPSubmarine },

        eBattleship: function() { return this.$store.getters.getEBattleship },
        eCruiser: function()    { return this.$store.getters.getECruiser },
        eDestroyer: function()  { return this.$store.getters.getEDestroyer },
        eSubmarine: function()  { return this.$store.getters.getESubmarine },
    },
    created() {
        let self = this;

        setInterval(() => this.$store.commit('updateEllipsis'), 600); //animate ellipsis in eventsLog  
        
        window.addEventListener('resize', resizeForMobile);    
        resizeForMobile(); //call on startup to determine initial screen size

        function resizeForMobile(){
            if(window.innerWidth > 750) {
                self.$store.commit('updateIsMobile', { 'val': false });
                self.$store.commit('updateIsActiveGameLog', { 'val': true });
                self.$store.commit('updateIsActiveP1', { 'val': true });
                self.$store.commit('updateIsActiveP2', { 'val': true });
            } 
            else {
                self.$store.commit('updateIsMobile', { 'val': true });
                self.$store.commit('updateIsActiveGameLog', { 'val': false });
                self.$store.commit('updateIsActiveP1', { 'val': false });
                self.$store.commit('updateIsActiveP2', { 'val': false });
            }
        }
    },
    mounted() {
        document.addEventListener('swiped-left', ()=> {
            if(!this.isActiveModal) {
                if(this.isActiveP1) {
                    this.$store.commit('updateIsActiveP1', {'val': false});
                    return;
                }               
                if(!this.isActiveP2) {
                    this.$store.commit('updateIsActiveP1', {'val': false});
                    this.$store.commit('updateIsActiveGameLog', {'val': false});
                    this.$store.commit('updateIsActiveP2', {'val': true});
                }
            }
        });    
        document.addEventListener('swiped-right', () => {
            if(!this.isActiveModal) {
                if(this.isActiveP2) {
                    this.$store.commit('updateIsActiveP2', {'val': false});
                    return;
                }
                if(!this.isActiveP1) {
                    this.$store.commit('updateIsActiveP2', {'val': false});
                    this.$store.commit('updateIsActiveGameLog', {'val': false});
                    this.$store.commit('updateIsActiveP1', {'val': true});
                }
            }
        });
        document.addEventListener('swiped-up', () => {
            if(!this.isActiveModal) {
                if(!this.isActiveGameLog) {
                    this.$store.commit('updateIsActiveP1', {'val': false});
                    this.$store.commit('updateIsActiveP2', {'val': false});
                    this.$store.commit('updateIsActiveGameLog', {'val': true});
                }
            }
        });
        document.addEventListener('swiped-down', () => {
            if(!this.isActiveModal) {
                if(this.isActiveGameLog) 
                    this.$store.commit('updateIsActiveGameLog', {'val': false});
            }
        });
        document.addEventListener('click', () => {
            if(window.innerWidth <= 750) { //close sidebars on click for mobile
                this.$store.commit('updateIsActiveP1', {'val': false});
                this.$store.commit('updateIsActiveP2', {'val': false});
                this.$store.commit('updateIsActiveGameLog', {'val': false});
            }
        });
    },
    watch: {
        pBattleship(val) { this.hitOnShip(val, "battleship", "player") },
        pCruiser(val)    { this.hitOnShip(val, "cruiser",    "player") },
        pDestroyer(val)  { this.hitOnShip(val, "destroyer",  "player") },
        pSubmarine(val)  { this.hitOnShip(val, "submarine",  "player") },

        //values reset after new game, prevent hitOnShip from firing during this
        //(prevent not needed for player ships)
        eBattleship(val) { 
            if(val < 5) //initial value
                this.hitOnShip(val, "battleship", "enemy");
        },
        eCruiser(val)    {
            if(val < 4) //initial value
                this.hitOnShip(val, "cruiser", "enemy");
        },
        eDestroyer(val)  {
            if(val < 3) //initial value
                this.hitOnShip(val, "destroyer", "enemy");
        },
        eSubmarine(val)  { 
            if(val < 2) //initial value
                this.hitOnShip(val, "submarine", "enemy");
        },
    },
    methods: {
        checkShips() {
            if(!this.eBattleship && !this.eCruiser && !this.eDestroyer && !this.eSubmarine) {
                this.$store.commit('updateEventsLog', { class: 'pSink', text: `${this.playerName} wins!` });
                this.$store.commit('updateWinner', {'val': this.playerName});
                this.$store.commit('updateTotalTime');
                this.$store.commit('toggleIsActiveModal');
                this.$store.commit('toggleIsHiddenModal');

                launchConfetti(10);
                return 1; //Player has won, end the game
            }
            if(!this.pBattleship && !this.pCruiser && !this.pDestroyer && !this.pSubmarine) {
                this.$store.commit('updateEventsLog', { class: 'eSink', text: `${this.enemyName} wins!` });
                this.$store.commit('updateWinner', {'val': this.enemyName});
                this.$store.commit('updateTotalTime');
                this.$store.commit('closePreventClicks');
                this.$store.commit('toggleIsActiveModal');
                this.$store.commit('toggleIsHiddenModal');

                //player lost, dont launch confetti
                return 1; //Enemy has won, end the game
            }
        },        
        hitOnShip(val, shipType, playerType) { //playerType is boat being hit, NOT player whose turn it is 
            if(val === 0) {
                if(playerType === "player") {
                    this.$store.commit('updateEHit1', {'val': null});  
                    this.$store.commit('updateEHit2', {'val': null}); 
                    this.$store.commit('resetEHitOrient'); 
                    this.$store.commit('updateBoatOrientFound', {'val': false});
                    this.$store.commit('addToNotificationQueue', {id: this.notificationCounter, class: "redBG", text: `${this.playerName} ${shipType} Sunk!`});
                    this.$store.commit('updateEventsLog', { class: 'eSink', text: `${this.enemyName} has destroyed ${this.playerName}'s ${shipType}!` });
                    this.checkShips();
                }
                else if(playerType === "enemy") {       
                    this.$store.commit('addToNotificationQueue', {id: this.notificationCounter, class: "greenBG", text: `${this.enemyName} ${shipType} Sunk!`});
                    this.$store.commit('updateEventsLog', { class: 'pSink', text: `${this.playerName} has destroyed ${this.enemyName}'s ${shipType}!` });

                    if(this.checkShips() !== 1) { // checkShips() returns 1 -> a player has won
                        this.$store.commit("togglePreventClicks");
                        setTimeout(()=> this.$refs.gameBoards.enemyHit(), 1000); //switch to enemy's turn after built-in delay
                    }
                }
                setTimeout(()=> this.$store.commit('removeFromNotificationQueue', { id: this.notificationCounter }), 15000); 
                this.$store.commit('incrementNotificationCounter');
            }
            else if(val !== 0 && playerType === "enemy") {
                this.$store.commit("togglePreventClicks"); 
                setTimeout(()=> this.$refs.gameBoards.enemyHit(), 1000); //switch to enemy's turn after built-in delay
            }
        },

        startNewGame() {
            this.$store.commit('clearEventsLog');
            this.$store.commit('clearNotificationQueue');
            this.$store.commit('resetTurnCounter');
            this.$store.commit('resetNotificationCounter');
            this.$store.commit('updatePlaceShipType', {'val': 'battleship'});
            this.$store.commit('updateIsActiveOrient', {'val': true});
        
            this.$refs.gameBoards.clearBoards();
            this.$store.commit('resetShips');
            this.$store.commit('resetShipsArray'); 

            this.$store.commit('startPlaceShipPhase');
            this.$store.commit('resetShipsHitPts'); //reset (emptied during 'place ships' phase)
            this.$store.commit('updateEventsLog', { class: '', text: `${this.playerName} has started a new game` });
            this.$store.commit('recordStartTime');

            this.genShips() //set enemy ships on board
        },
        genShips() {
            this.$refs.gameBoards.placeEnemyShip("battleship", 5);
            this.$refs.gameBoards.placeEnemyShip("cruiser", 4);
            this.$refs.gameBoards.placeEnemyShip("destroyer", 3);
            this.$refs.gameBoards.placeEnemyShip("submarine", 2);
        },
    }
}
</script>

<style lang="scss">
    * {
        margin: 0;
        padding: 0;
        user-select: none;
        box-sizing: border-box;
    }
    html { 
        position: fixed;
        height: 100%;
        width: 100%;
    }
    body {
        height: 100%;
        background: #1a1a1a;
        color: #fff;
        font-family: sans-serif;
        overscroll-behavior: none;
    }
    main { height: 100% }
    #gameBoard {
        position: relative;
        display: flex;
        height: 100%; 
        overflow-x: hidden;
        color: #fff;
        
        &__main {
            display: flex;
            flex-direction: column;
            margin: 4rem auto .5rem auto;
            max-width: 500px;
            flex: 1;
        }
    }

    @media (max-width: 1250px) {

    }
    @media (max-width: 750px) {
        #gameBoard__main { 
            max-width: 460px;
            margin: 4rem auto 1rem auto;
        }
    }
    @media (max-width: 500px) {
        #gameBoard__main { 
            max-width: 500px;
            margin: 4rem .5rem 1rem 1.5rem;
        }
    }
</style>
