<template>
    <div id="modal" :class="{ active: isActiveModal, hidden: isHiddenModal }">
        <div id="modal__start" :class="{ active: isActiveModal, hidden: isHiddenModal }">
            <template v-if="confirmReset">
                <h2 class="surrender">Surrender?</h2>
                <p>Game currently in progress. Reset ships and start a new game?</p>
                <div class="btnContain">
                    <button class="gray" @click="closeModalWithoutReset">CANCEL</button>
                    <button class="red" @click="closeModal">RESET</button>
                </div>
            </template>

            <template v-else-if="!gameInProgress">
                <h2 class="start">WAR!</h2>
                <p>FLEET ATTACK is a turn-based strategy game based on the popular <i>BATTLESHIP</i> board game.</p>
                <p>Hone your naval skills by firing at coordinates on the map in an attempt to destroy the enemy's fleet before it destroys yours.</p>
                <div class="btnContain">
                    <button @click="closeModal" class="blue">START GAME</button>
                </div>
            </template>

            <template v-else>
                <h2 class="end">{{ winner }} wins!</h2>
                <p>{{ winner }} wins the game after <span>{{ turnCounter }} turns</span>. Total game time: <span>{{ totalTime }}</span>. Double or nothing?</p>
                <div class="btnContain">
                    <button @click="closeModal" class="blue">PLAY AGAIN</button>
                </div>
            </template>                
        </div>
    </div>
</template>

<script>
    export default {
        name: 'MainModal',
        computed: {
            gameInProgress: function() { return this.$store.getters.getGameInProgress },
            confirmReset:   function() { return this.$store.getters.getConfirmReset },
            isActiveModal:  function() { return this.$store.getters.getIsActiveModal },
            isHiddenModal:  function() { return this.$store.getters.getIsHiddenModal },
            turnCounter:    function() { return this.$store.getters.getTurnCounter },
            totalTime:      function() { return this.$store.getters.getTotalTime },
            winner:         function() { return this.$store.getters.getWinner }
        },
        methods: {
            closeModal() {
                this.$emit('startNewGame')
                this.$store.commit('toggleIsActiveModal'); //move modal off screen then display: none;

                setTimeout(() => {
                    this.$store.commit('toggleIsHiddenModal');
                    this.$store.commit('toggleGameInProgress');
                }, 700);
            },
            closeModalWithoutReset() { //close without resetting game ('cancel' button clicked)
                this.$store.commit('toggleIsActiveModal'); //move modal off screen then display: none;
                setTimeout(() => this.$store.commit('toggleIsHiddenModal'), 700);
            },
        }
    }
</script>

<style scoped lang="scss">
    #modal {
        position: fixed;
        height: 100%;
        width: 100vw;
        background: transparent;
        z-index: 5;

        transition: background-color .5s;

        &__start {
            width: 90%;
            max-width: 20rem;
            font-size: .8rem;
            background: #1a1a1a;
            position: absolute;
            top: -10rem;
            left: 50%;
            transform: translate(-50%, -50%);

            transition: all .7s;

            h2 {
                text-align: center;
                text-transform: uppercase;

                &.start {
                    background: url("../assets/splatter.svg") no-repeat center / 6rem;
                    height: 6rem;
                    line-height: 5.5rem;
                    margin-top: -2rem;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 1.3rem;
                    color: #fff;
                    text-shadow: 2px 2px 1px #000;
                }
                &.end { padding: 1rem }
                &.surrender { padding: 1rem }
            }
            h3 {
                text-align: center;
                font-weight: normal;
                margin: 2rem 0;
            }
            p {
                margin: .5rem 1rem;
                line-height: 1.5;
                color: #d9d9d9;

                span { 
                    font-weight: bold;
                    color: #ff4d4d;
                }
            }
            button {
                border: none;
                flex: 1;
                height: 4rem;
                color: #fff;
                cursor: pointer;
                font-weight: bold;
                letter-spacing: 6px;
                text-shadow: 2px 2px 4px black;
                background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='f2f2f2' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E");

                transition: letter-spacing .3s, font-weight .3s;

                &.gray { background-color: #333 }
                &.blue { background-color: #2d2d86 } 
                &.red { background-color: #990000 }  
            }

            &.active { top: 50% }
            &.hidden { display: none }
            .btnContain { 
                display: flex;
                margin-top: 2rem;     
            }
        }
        &.active { background: rgba(0,0,0,0.5) }
        &.hidden { display: none }
    }
</style>