import MMOHUD from "../apps/MMOHUD.mjs";

Hooks.once('init', async function() {
    const rerenderHooks = ["updateActor", "targetToken", "updateCombat",
        "deleteCombatant", "createCombatant"];
    for (const hook of rerenderHooks) {
        Hooks.on(hook, _updateMmoHud);
    }
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
