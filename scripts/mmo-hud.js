import MMOHUD from "../apps/MMOHUD.mjs";

Hooks.once('init', async function() {
});

Hooks.once('ready', async function() {
});

Hooks.once('canvasReady', async function() {
    MMOHUD.init();
});

Hooks.on("updateActor", (actor, data, options, userId) => {
    // Update MMO HUD
    if (ui.mmoHud) {
        ui.mmoHud.render();
    }
});
