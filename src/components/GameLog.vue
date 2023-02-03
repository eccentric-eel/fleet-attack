<template>
    <section id="gameLog" :class="{ active: isActiveGameLog }">
        <button @click="$store.commit('toggleGameLog')"></button>
        <div v-for="event in eventsLog" :class="event.class" class="logMsg">{{ event.text }}</div>
        <span id="gameLog__monitoring">Analyzing Game Events{{ ellipsis }}</span>
    </section>
</template>

<script>
export default {
    name: 'GameLog',
    computed: {
        isActiveGameLog: function() { return this.$store.getters.getIsActiveGameLog },
        eventsLog: function() { return this.$store.getters.getEventsLog },
        ellipsis: function() { return this.$store.getters.getEllipsis }
    }
}
</script>

<style scoped lang="scss">
    #gameLog {
        position: fixed;
        bottom: 0;
        left: 5px;
        font-size: .9rem;
        height: 10rem;
        width: 18rem;
        padding: 10px;
        background: #0d0d0d;
        color: #009900;
        font-family: monospace;
        text-transform: uppercase;

        transition: bottom .2s;

        button {
            display: none;
            position: absolute;
            top: -5px;
            left: 50%;
            height: 3px;
            width: 7rem;
            border: none;
            background: #5c9900;
            transform: translateX(-50%);
        }
        &__monitoring {
            position: absolute;
            bottom: 10px;
            color: #00b300;
        }
        &.active { bottom: 0 }
        
        .logMsg {
            padding-bottom: 2px;
            font-size: .6rem;
        }
    }
    .pSink, .pHit, .eSink, .eHit { font-weight: bold }
    .eHit  { color: #e60000 }
    .eSink { color: #e60000 }
    .pHit  { color: #00ff00 }
    .pSink { color: #00ff00 }
    
    @media (max-width: 1250px) {

    }
    @media (max-width: 750px) {
        #gameLog {
            bottom: -10rem;
            left: 0; 
            width: 100%; 
            box-shadow: 0 -4px 10px #1a1a1a;

            button { display: block }
        }
    }
    @media (max-width: 500px) { 
    
    }
</style>