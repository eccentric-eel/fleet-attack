<template>
    <div :class="{ hide: !placeShipsPhase }">
        <h1>POSITIONING PHASE</h1>
        <p>
            Position your ships on the game board below.
            You can space them out to try and avoid heavy losses or group them together in an attempt to avoid detection.
        </p>
        <h4>PLACE SHIP: <span>{{ placeShipType }}</span></h4>
        <h4 class="mobileSelectOrient">SHIP ORIENTATION: <button @click="$store.commit('togglePlaceOrient')">{{ placeOrient }}</button></h4>   
        <h5 class="mobileConfirmPlacement">Double tap to confirm ship placement</h5>
    </div>
</template>

<script>
export default {
    name: 'PositionInstruct',
    computed: {
        placeShipsPhase: function() { return this.$store.getters.getPlaceShipsPhase },
        placeShipType: function() { return this.$store.getters.getPlaceShipType },
        placeOrient: function() { return this.$store.getters.getPlaceOrient }
    }
}
</script>

<style scoped lang="scss">
    div {
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: center;
        text-align: center;

        &.hide { display: none }
    }
     button { 
        font-weight: normal;
        text-transform: uppercase;    
    }
    h4 {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: normal;
        text-transform: uppercase;
        width: 15rem;
        margin: 0 auto;

        span { 
            font-weight: bold;
            color: #ffdb4d;
        }
        &.mobileSelectOrient { display: none }
    }
    p {
        font-size: .8rem;
        line-height: 1.5;
        padding: .5rem 0 3rem 0;
        color: #d9d9d9;
    }
    .mobileConfirmPlacement {
        display: none;
        font-weight: bold;
        padding: 1rem 0;
    }

    @media (max-width: 1250px) {
        div {
            
            h1 { font-size: 1.3rem } 
   
            h4 { 
                margin: 2px 0;
                font-size:  0.8rem;
                width: auto;

                span {
                    width: 7rem;
                    text-align: center;
                    font-weight: normal;
                }
                button {
                    padding: 5px 0;
                    width: 7rem;
                    color: #ffdb4d;
                    background: rgba(255, 219, 77, 0.1);
                    border: 1px solid #ffdb4d;
                    border-radius: 3px;
                }
                &.mobileSelectOrient { display: flex }
            }
        }
    }
    @media (max-width: 750px) {
        .mobileConfirmPlacement { display: block }
    }
    @media (max-width: 500px) {

    }
</style>