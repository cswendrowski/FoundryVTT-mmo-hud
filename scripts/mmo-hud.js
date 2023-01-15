import MMOHUD from "../apps/MMOHUD.mjs";

Hooks.once('init', async function() {
    const rerenderHooks = ["updateActor", "targetToken", "updateCombat",
        "deleteCombatant", "createCombatant", "updateUser"];
    for (const hook of rerenderHooks) {
        Hooks.on(hook, _updateMmoHud);
    }

    game.settings.register("mmo-hud", "showMode", {
        name: "Show Mode",
        hint: "When should the Party HUD be shown?",
        scope: "client",
        config: true,
        type: String,
        onChange: _updateMmoHud,
        default: "always",
        choices: {
            "always": "Always",
            "combat": "Only in Combat",
            "never": "Never"
        }
    });

    game.settings.register("mmo-hud", "transparentVersion", {
        name: "Use transparent version of the HUD",
        hint: "Makes the HUD background more transparent, making it easier to see the Scene behind it.",
        scope: "user",
        config: true,
        default: false,
        onChange: _updateMmoHud,
        type: Boolean
    });
});

Hooks.on("ready", () => {
    MMOHUD.init();
});

Hooks.on('renderCombatTracker', (tracker, html, data) => {
    if ( !game.user.isGM || !ui.mmoHud ) return;

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

    // Don't render the flag for the Party
    let controls = html.find(".combatant .combatant-controls");
    controls.each((i, el) => {
        // Get the combatant
        const combatant = game.combat.combatants.get(el.closest(".combatant").dataset.combatantId);
        if ( ui.mmoHud.partyIds.includes(combatant.actorId) || ui.mmoHud.partyIds.includes(combatant.tokenId) ) return;

        // Add the button
        el.prepend(button.clone(true)[0]);
    });
});

// Hooks.once('canvasReady', async function() {
//     MMOHUD.init();
// });

function _updateMmoHud() {
    if (ui.mmoHud) {
        ui.mmoHud.render();
    }
}

// When combat ends, remove all mmo-hud flags from tokens
Hooks.on("deleteCombat", () => {
    for (const token of canvas.tokens.placeables) {
        token.document.unsetFlag("mmo-hud", "boss");
    }
});
