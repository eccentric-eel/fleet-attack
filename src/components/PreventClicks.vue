<template>
    <div id="coverEl" :class="{ hide: !preventClicks }">
        <div id="coverEl__inner">
            <div id="coverEl__inner__bg"></div>
            <div class="sk-folding-cube">
                <div class="sk-cube1 sk-cube"></div>
                <div class="sk-cube2 sk-cube"></div>
                <div class="sk-cube4 sk-cube"></div>
                <div class="sk-cube3 sk-cube"></div>
            </div>
            <h4>ENEMY TURN</h4> 
        </div>
    </div>
</template>

<script>
export default {
    name: 'PreventClicks',
    computed: {
        preventClicks: function() { return this.$store.getters.getPreventClicks }
    }
}
</script>

<style scoped lang="scss">
    #coverEl {
        visibility: visible;
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 100%;
        background: rgba(0, 0, 0, 0.4);
        z-index: 5;
        opacity: 1;
        transition: all .3s;

        &.hide { 
            visibility: hidden;
            opacity: 0;
        }
        &__inner {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 8rem;
            height: 5rem;

            &__bg {
                position: absolute;
                top: 50%;
                left: 50%;
                height: 5rem;
                width: 5rem;
                border-radius: 50%;
                background: #9c4be7;
                transform: translate(-50%, -50%);
            }
        }
    }
    h4 {
        position: absolute;
        bottom: -1.5rem;
        width: 100%;
        text-align: center;
        font-size: .9rem;
        font-weight: normal;
    }

    .sk-folding-cube {
        margin: 20px auto;
        width: 30px;
        height: 30px;
        position: relative;
        transform: rotateZ(45deg);
        z-index: 10;
    }
    .sk-folding-cube .sk-cube {
        float: left;
        width: 50%;
        height: 50%;
        position: relative;
        transform: scale(1.1); 
    }
    .sk-folding-cube .sk-cube:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #f2f2f2;
        animation: sk-foldCubeAngle 2.4s infinite linear both;
        transform-origin: 100% 100%;
    }
    .sk-folding-cube .sk-cube2 { transform: scale(1.1) rotateZ(90deg) }
    .sk-folding-cube .sk-cube3 { transform: scale(1.1) rotateZ(180deg) }
    .sk-folding-cube .sk-cube4 { transform: scale(1.1) rotateZ(270deg) }
    .sk-folding-cube .sk-cube2:before { animation-delay: 0.3s }
    .sk-folding-cube .sk-cube3:before { animation-delay: 0.6s }
    .sk-folding-cube .sk-cube4:before { animation-delay: 0.9s }

    @keyframes sk-foldCubeAngle {
        0%, 10% {
            transform: perspective(140px) rotateX(-180deg);
            opacity: 0; 
        }
        25%, 75% {
            transform: perspective(140px) rotateX(0deg);
            opacity: 1; 
        } 
        90%, 100% {
            transform: perspective(140px) rotateY(180deg);
            opacity: 0; 
        }
    }
</style>