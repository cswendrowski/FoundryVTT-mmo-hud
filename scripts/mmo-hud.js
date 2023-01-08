import MMOHUD from "../apps/MMOHUD.mjs";

Hooks.once('init', async function() {
});

Hooks.once('ready', async function() {
});

Hooks.once('canvasReady', async function() {
    MMOHUD.init();
});
