<template>
    <ul>
        <li v-for="msg in notificationQueue" :class="msg.class" @click="$store.commit('removeFromNotificationQueue', msg.id)">{{ msg.text }}</li>
    </ul>
</template>

<script>
    export default {
        name: 'NotificationQueue',
        computed: {
            notificationQueue: function() { return this.$store.getters.getNotificationQueue }
        } 
    }
</script>

<style scoped lang="scss">
    ul {
        position: absolute;
        top: 0;
        right: 10rem;
        width: 12rem;
        list-style-type: none;
        text-align: center;
        z-index: 3;      
    }
    li {
        margin: 5px 0;
        padding: .8rem 5px;
        font-size: .7rem;
        font-weight: bold;
        text-transform: uppercase;
        cursor: pointer;
    }
    .greenBG { 
        background: #194d19;
        border: 1px solid greenyellow;
        color: greenyellow;
        border-radius: 5px;
        text-shadow: 4px 4px 5px black;
    }
    .redBG { 
        background: #4d0000;
        border: 1px solid red;
        color: red;
        border-radius: 5px;
        text-shadow: 4px 4px 5px black;
    }

    @media (max-width: 1250px) {

    }
    @media (max-width: 750px) {

    }
    @media (max-width: 500px) {
        ul {
            right: 5px;

            li { padding: .5rem 5px }
        }
    }
</style>