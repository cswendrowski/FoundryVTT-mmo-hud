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

Hooks.on('renderCombatTracker', (tracker, html, data) => {
    if ( !game.user.isGM ) return;

    // Add a new button to the combatant controls
    const button = $(`<a class="combatant-control mmo-hud" data-tooltip="Toggle MMO Health Bar"><i class="fas fa-alien-8bit"></i></a>`);
    button.click(async ev => {
        ev.preventDefault();
        ev.stopPropagation();
        const combatant = game.combat.combatants.get(ev.currentTarget.closest(".combatant").dataset.combatantId);
        const token = canvas.tokens.get(combatant.tokenId);
        const currentState = token.document.getFlag("mmo-hud", "boss");
        await token.document.setFlag("mmo-hud", "boss", !currentState);
        ui.mmoHud.render();
    });
    html.find('.combatant-controls').prepend(button);
});

Hooks.once('canvasReady', async function() {
    MMOHUD.init();
});

function _updateMmoHud() {
    if (ui.mmoHud) {
        ui.mmoHud.render();
    }
}
