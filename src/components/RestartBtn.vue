<template>
    <button id="restartBtn" @click="$store.commit('showRestartConfirm')"></button>
</template>

<script>
    export default {
        name: 'RestartBtn'
    }
</script>

<style scoped>
    button {
        position: absolute;
        top: 0;
        left: 50%; 
        height: 3rem;
        width: 100%;
        border: none;
        background: url("../assets/logo.svg") no-repeat center 1rem / auto 1.3rem;
        cursor: pointer;
        z-index: 2;
        overflow: hidden;

        transform: translateX(-50%);
    }
    button::after { 
        content: '';
        position: absolute;
        top: .6rem;
        left: calc(50% + 2px); 
        height: 2.1rem;
        width: 2.1rem;
        border: none;
        background: url("../assets/crosshairs.svg") no-repeat center / auto 2.1rem;
        cursor: pointer;
        z-index: 2;

        animation: rotateCrosshairs 40s linear infinite;
    }

    @keyframes rotateCrosshairs {
        from { 
            transform: translateX(-50%) rotate(0deg);
        }
        to { 
            transform: translateX(-50%) rotate(360deg); 
        }
    }
</style>