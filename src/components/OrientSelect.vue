<template>
    <section :class="{ active: isActiveOrient }">
        <div><h5>Ship orientation:</h5><span>{{ placeOrient }}</span></div>
        <button @click="$store.commit('togglePlaceOrient')">Rotate</button>
    </section>
</template>

<script>
    export default {
        name: 'OrientSelect',
        computed: {
            isActiveOrient: function() { return this.$store.getters.getIsActiveOrient },
            placeOrient: function() { return this.$store.getters.getPlaceOrient }
        }
    }
</script>

<style scoped lang="scss">
    section {
        position: fixed;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        bottom: -10rem;
        right: 0;
        text-transform: uppercase;
        height: 10rem;
        width: 17rem;
        z-index: 3;

        transition: bottom .3s;

        div { 
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 80%;

            h5 {
                font-weight: normal; 
                font-size: .8rem;
            }
            span { 
                font-weight: bold;
                font-size: .8rem;
                color: #ffdb4d;
            }
        }
        button {
            margin: 7px 0;
            line-height: 3rem;
            height: 3rem;
            width: 8rem;
            background:  #00cc44;
            box-shadow: 1px 7px #006600;
            border: none;
            border-radius: 10px;
            color: #1a1a1a;
            font-weight: bold;
            font-size: .9rem;
            text-transform: uppercase;
            cursor: pointer;

            transition: all .2s;

            &:hover {
                background: #00b33c;
                box-shadow: 1px 7px #004d00;
            }
            &:active {
                transform: translateY(4px);
                box-shadow: 1px 3px #006600;
            }
        }
        &.active { bottom: 0 }
    }

    @media (max-width: 1250px) {
        section { display: none }
    }
    @media (max-width: 750px) {
    
    }
    @media (max-width: 500px) { 

    }
</style>