import { createApp } from 'vue';
import { createStore } from 'vuex';

import App from './App.vue';

const store = createStore({
    state: {
        eBattleship: 5,
        eCruiser:    4,
        eDestroyer:  3,
        eSubmarine:  2,

        pBattleship: 5,
        pCruiser:    4,
        pDestroyer:  3,
        pSubmarine:  2,

        notificationCounter: 0,
        turnCounter:         0,

        mobileHighlightIsSet: false, //require double tap to place ships on mobile devices

        gameInProgress:  false, //determine if log/board needs to reset if player plays again
        confirmReset:    false,
        isHiddenModal:   false, //move modal away, make background transparent
        preventClicks:   false,
        isActiveGameLog: false,
        boatOrientFound: false, 
        isActiveP1:      false,
        isActiveP2:      false,
        isMobile:        false, //change layout and events if mobile screen

        isActiveModal:   true,  //'display: none' modal after fade away animation
        isActiveOrient:  true,  //select orientation popup when player chooses ship location
        placeShipsPhase: true,

        eHit1:      null, //coordinate of hit on player tile from enemy's last turn
        eHit2:      null, //coordinate of follow up hit (to determine boat orientation)
        startTime:  null,
        totalTime:  null,

        eventsLog:         [],
        notificationQueue: [],
        ships:             ['battleship', 'cruiser', 'destroyer', 'submarine'],
        shipsHitPts:       [5, 4, 3, 2],
        eHitOrient:        [-1, 1, -8, 8],

        enemyBoard:  new Array(64), //8x8 FIXED CURRENTLY
        playerBoard: new Array(64),

        placeOrient:   'up/down',
        placeShipType: 'battleship',
        playerName:    'Player 1',
        enemyName:     'Enemy',
        winner:        '',
        ellipsis:      '.',
    },
    getters: {
        getMobileHighlightIsSet: state => { return state.mobileHighlightIsSet },
        getNotificationCounter: state => { return state.notificationCounter },
        getNotificationQueue: state =>   { return state.notificationQueue },
        getGameInProgress: state =>      { return state.gameInProgress },
        getPreventClicks: state =>       { return state.preventClicks },
        getConfirmReset: state =>        { return state.confirmReset },
        getPlaceShipsPhase: state =>     { return state.placeShipsPhase },
        getPlaceShipType: state =>       { return state.placeShipType },
        getBoatOrientFound: state =>     { return state.boatOrientFound },
        getTotalTime: state =>           { return state.totalTime },
        getPlaceOrient: state =>         { return state.placeOrient }, 
        getShipsHitPts: state =>         { return state.shipsHitPts },
        getIsActiveP1: state =>          { return state.isActiveP1 },
        getIsActiveP2: state =>          { return state.isActiveP2 },
        getIsActiveGameLog: state =>     { return state.isActiveGameLog },
        getIsActiveOrient: state =>      { return state.isActiveOrient },
        getIsActiveModal: state =>       { return state.isActiveModal },
        getIsHiddenModal: state =>       { return state.isHiddenModal },
        getIsMobile: state =>            { return state.isMobile },
        getTurnCounter: state =>         { return state.turnCounter },
        getPlayerBoard: state =>         { return state.playerBoard },
        getPlayerName: state =>          { return state.playerName },
        getEnemyName: state =>           { return state.enemyName },
        getEnemyBoard: state =>          { return state.enemyBoard },
        getEHitOrient: state =>          { return state.eHitOrient },
        getEHit1: state =>               { return state.eHit1 },
        getEHit2: state =>               { return state.eHit2 },

        getPBattleship: state =>       { return state.pBattleship },
        getPCruiser: state =>          { return state.pCruiser },
        getPDestroyer: state =>        { return state.pDestroyer },
        getPSubmarine: state =>        { return state.pSubmarine },

        getEBattleship: state =>       { return state.eBattleship },
        getECruiser: state =>          { return state.eCruiser },
        getEDestroyer: state =>        { return state.eDestroyer },
        getESubmarine: state =>        { return state.eSubmarine },
        
        getPlaceOrient: state =>       { return state.placeOrient },
        getEventsLog: state =>         { return state.eventsLog },
        getEllipsis: state =>          { return state.ellipsis },
        getWinner: state =>            { return state.winner },
        getShips:  state =>            { return state.ships },
    },
    mutations: {
        togglePreventClicks(state)  { state.preventClicks = !state.preventClicks },
        toggleIsActiveModal(state)  { state.isActiveModal = !state.isActiveModal },
        toggleIsHiddenModal(state)  { state.isHiddenModal = !state.isHiddenModal },
        toggleGameInProgress(state) { state.gameInProgress = !state.gameInProgress },
        toggleGameLog(state)        { state.isActiveGameLog = !state.isActiveGameLog },
        toggleP1(state)             { state.isActiveP1 = !state.isActiveP1 },
        toggleP2(state)             { state.isActiveP2 = !state.isActiveP2 },
        togglePlaceOrient(state)    { state.placeOrient = (state.placeOrient === "up/down") ? "left/right" : "up/down" },

        incrementTurnCounter(state)         { state.turnCounter++ },
        incrementNotificationCounter(state) { state.notificationCounter++ },

        decrementPBattleship(state) { state.pBattleship-- },
        decrementPCruiser(state)    { state.pCruiser-- },
        decrementPDestroyer(state)  { state.pDestroyer-- },
        decrementPSubmarine(state)  { state.pSubmarine-- },
        decrementEBattleship(state) { state.eBattleship-- },
        decrementECruiser(state)    { state.eCruiser-- },
        decrementEDestroyer(state)  { state.eDestroyer-- },
        decrementESubmarine(state)  { state.eSubmarine-- },

        updateMobileHighlightIsSet(state, { val }) { state.mobileHighlightIsSet = val },
        updateIsMobile(state, { val })        { state.isMobile = val },
        updatePlaceShipType(state, { val })   { state.placeShipType = val },
        updateEllipsis(state)                 { state.ellipsis = (state.ellipsis === '...') ? '.' : state.ellipsis + '.' },
        updateEHit1(state, { val })           { state.eHit1 = val },
        updateEHit2(state, { val })           { state.eHit2 = val },
        updateBoatOrientFound(state, { val }) { state.boatOrientFound = val }, 
        updateIsActiveP1(state, { val })      { state.isActiveP1 = val },
        updateIsActiveP2(state, { val })      { state.isActiveP2 = val },
        updateIsActiveGameLog(state, { val }) { state.isActiveGameLog = val },
        updateIsActiveOrient(state, { val })  { state.isActiveOrient = val },
        updateWinner(state, { val })          { state.winner = val},
        updateShipArrays(state) {
            state.ships.shift(); //remove first element in ships array, move on to next ship
            state.shipsHitPts.shift(); //[5, 4, 3, 2]
            state.pHighlight = []; //clear array of tiles currently being highlighted
        },
        updateEventsLog(state, msg) {
            if(state.eventsLog.length > 8) // queue maintains max array length, remove oldest msg to make room for newest msg
                state.eventsLog.shift();

            state.eventsLog.push(msg);
        },
        updateTotalTime(state) { 
            let endTime = Math.round(+ new Date() / 1000);
            let totalTime = endTime - state.startTime;
            
            let s = totalTime % 60;
            let m = Math.floor(totalTime / 60);

            if(s < 10)
                s = '0' + s;
            
            state.totalTime = m + 'm ' + s + 's';
        },
        clearEventsLog(state) { state.eventsLog = [] },

        recordStartTime(state)          { state.startTime = Math.round(+ new Date() / 1000) },
        startPlaceShipPhase(state)      { state.placeShipsPhase = true },
        closePreventClicks(state)       { state.preventClicks = false },
        resetShipsArray(state)          { state.ships = ['battleship', 'cruiser', 'destroyer', 'submarine'] },
        resetShipsHitPts(state)         { state.shipsHitPts = [5, 4, 3, 2] },
        resetEHitOrient(state)          { state.eHitOrient = [-1, 1, -8, 8] },
        resetTurnCounter(state)         { state.turnCounter = 0 },
        resetNotificationCounter(state) { state.notificationCounter = 0 },
        nextShipType(state)             { state.placeShipType = state.ships[1] },

        showRestartConfirm(state) {
            state.confirmReset = true;
            state.isActiveModal = true;
            state.isHiddenModal = false;
        },
        resetShips(state) {
            state.eBattleship = 5;
            state.eCruiser    = 4;
            state.eDestroyer  = 3;
            state.eSubmarine  = 2;

            state.pBattleship = 5;
            state.pCruiser    = 4;
            state.pDestroyer  = 3;
            state.pSubmarine  = 2;
        },
        findShipOrientation(state) {
            if(state.eHit1 - state.eHit2 === 1 || state.eHit1 - state.eHit2 === -1) {
                state.eHitOrient = [-1, 1];
                state.boatOrientFound = true;
            }
            else if(state.eHit1 - state.eHit2 === 8 || state.eHit1 - state.eHit2 === -8) {
                state.eHitOrient = [-8, 8];
                state.boatOrientFound = true;
            }
            else {
                state.eHitOrient = [-1, 1, -8, 8]; //call resetehitorient
                state.boatOrientFound = false;
            }
        }, 
        addToNotificationQueue(state, obj) { state.notificationQueue.unshift(obj) },
        removeFromNotificationQueue(state, elementId) { //SMALL ERROR OCCURING HERE!!!!!!!!!!!!!!!!
            //get index of notification whose .id value is the passed elementId
            let index = state.notificationQueue.findIndex((el) => el.id === elementId);
            state.notificationQueue.splice(index, 1);
        },
        clearNotificationQueue(state) { state.notificationQueue = [] },
        endPlaceShipsPhase(state) {
            state.isActiveOrient = false;
            state.placeShipsPhase = false;
            
            this.commit("resetShipsArray"); 
        },
    },
});

createApp(App).use(store).mount('#app');