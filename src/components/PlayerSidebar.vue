<template>
    <div id="gameBoard__p1" :class="{ active: isActiveP1 }" v-if="playerType === 'player'">
        <div class="boardPic player">
            <span>{{ playerName }}</span>
        </div>

        <button @click="$store.commit('toggleP1')"></button>
        <div class="boatContainer">
            <img src="../assets/battleship.svg" alt="battleship">
            <img v-if="pBattleship === 0" class="boatContainer__x" src="../assets/x-icon.svg" alt="x">
            <div class="boatHits">
                <div v-for="hitPnt in pBattleship" class="boatHits__mark"></div>
            </div>
        </div> 
        <div class="boatContainer">
            <img src="../assets/cruiser.svg" alt="cruiser">
            <img v-if="pCruiser === 0" class="boatContainer__x" src="../assets/x-icon.svg" alt="x">
            <div class="boatHits">
                <div v-for="hitPnt in pCruiser" class="boatHits__mark"></div>
            </div>
        </div>
        <div class="boatContainer">
            <img src="../assets/destroyer.svg" alt="destroyer">
            <img v-if="pDestroyer === 0" class="boatContainer__x" src="../assets/x-icon.svg" alt="x">
            <div class="boatHits">
                <div v-for="hitPnt in pDestroyer" class="boatHits__mark"></div>
            </div>
        </div>                    
        <div class="boatContainer">
            <img src="../assets/submarine.svg" alt="submarine">
            <img v-if="pSubmarine === 0" class="boatContainer__x" src="../assets/x-icon.svg" alt="x">
            <div class="boatHits">
                <div v-for="hitPnt in pSubmarine" class="boatHits__mark"></div>
            </div>
        </div>
    </div>

    <div id="gameBoard__p2" :class="{ active: isActiveP2 }" v-if="playerType === 'enemy'">
        <div class="boardPic enemy">
            <span>{{ enemyName }}</span>
        </div>
                
        <button @click="$store.commit('toggleP2')"></button>
        <div class="boatContainer">
            <img src="../assets/battleship.svg" alt="battleship">
            <img v-if="eBattleship === 0" class="boatContainer__x" src="../assets/x-icon.svg" alt="x">
        </div> 
        <div class="boatContainer">
            <img src="../assets/cruiser.svg" alt="cruiser">
            <img v-if="eCruiser === 0" class="boatContainer__x" src="../assets/x-icon.svg" alt="x">
        </div>
        <div class="boatContainer">
            <img src="../assets/destroyer.svg" alt="destroyer">
            <img v-if="eDestroyer === 0" class="boatContainer__x" src="../assets/x-icon.svg" alt="x">
        </div>                    
        <div class="boatContainer">
            <img src="../assets/submarine.svg" alt="submarine">
            <img v-if="eSubmarine === 0" class="boatContainer__x" src="../assets/x-icon.svg" alt="x">
        </div>
    </div>
</template>

<script>
    export default {
        name: 'PlayerSidebar',
        computed: {
            isActiveP1: function()  { return this.$store.getters.getIsActiveP1 },
            isActiveP2: function()  { return this.$store.getters.getIsActiveP2 },
            playerName: function()  { return this.$store.getters.getPlayerName },
            enemyName: function()   { return this.$store.getters.getEnemyName },

            pBattleship: function() { return this.$store.getters.getPBattleship },
            pCruiser: function()    { return this.$store.getters.getPCruiser },
            pDestroyer: function()  { return this.$store.getters.getPDestroyer },
            pSubmarine: function()  { return this.$store.getters.getPSubmarine },

            eBattleship: function() { return this.$store.getters.getEBattleship },
            eCruiser: function()    { return this.$store.getters.getECruiser },
            eDestroyer: function()  { return this.$store.getters.getEDestroyer },
            eSubmarine: function()  { return this.$store.getters.getESubmarine }
        },
        props: {
            playerType: {
                type: String,
                required: true
            }
        }
    }
</script>

<style scoped lang="scss">
    #gameBoard__p1, #gameBoard__p2 { 
        position: absolute;
        height: 100%;
        width: 10rem;
        text-align: center;
        z-index: 3;
        
        img {
            margin-top: 1rem;
            width: 7rem;

            &:first-of-type { margin-top: 2rem }
        }
        button {
            display: none;
            position: absolute;
            top: 50%;
            height: 7rem;
            width: 3px;
            border: none;
            background: #5c9900;
            transform: translateY(-50%);
        }
    }
    #gameBoard__p1 {
        left: -10rem;
        transition: left .2s;

        button { right: -5px }
        &.active { left: 0 }  
    }
    #gameBoard__p2 {
        right: -10rem;
        transition: right .2s;

        button { left: -5px }
        &.active { right: 0 }
    }
    .boatHits {
        position: absolute;
        display: flex;
        align-items: center;
        bottom: -.8rem;
        left: 1.5rem;

        &__mark {
            height: .8rem;
            width: .8rem;
            margin: 0 2px;
            background: rgba(153, 255, 51, 0.6);
            border: 2px solid #00cc00;
            border-radius: 50%;
        }
    }
    .boatContainer {
        position: relative;

        &__x {
            position: absolute;
            height: 2.5rem;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }
    .boardPic {
        position: relative;
        height: 8.5rem;
        background-color: #333333;
        background-image: url("data:image/svg+xml,%3Csvg width='40' height='1' viewBox='0 0 40 1' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20v1H0z' fill='%23000000' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E");

        &.player { background: url("../assets/player-flag.svg") center .5rem / 9rem no-repeat }
        &.enemy { background: url("../assets/enemy-flag.svg") center .5rem / 9rem no-repeat }

        span {
            position: absolute;
            background: #333;
            padding: 5px 1rem;
            border-radius: 5px;
            font-size: .7rem;
            bottom: 0;
            right: .5rem;
        }
    }

    @media (max-width: 1250px) {

    }
    @media (max-width: 750px) {
        #gameBoard__p1, #gameBoard__p2 { 
            background-color: #262626;

            button { display: block } 
        }
        #gameBoard__p1 { box-shadow: 5px 0 10px #1a1a1a }
        #gameBoard__p2 { box-shadow: -5px 0 10px #1a1a1a }
    }
    @media (max-width: 500px) {
    
    }
</style>