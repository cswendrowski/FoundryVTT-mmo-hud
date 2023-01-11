import MMOHUD from "../apps/MMOHUD.mjs";

Hooks.once('init', async function() {
});

Hooks.once('ready', async function() {
});

Hooks.once('canvasReady', async function() {
    MMOHUD.init();
});

function _updateMmoHud() {
    if (ui.mmoHud) {
        ui.mmoHud.render();
    }
}

Hooks.on("updateActor", () => _updateMmoHud());
Hooks.on("targetToken", () => _updateMmoHud());
