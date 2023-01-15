export default class GenericSystem {

    /**
     * Return the id of the system that this converter handles
     * @returns {string}
     * @constructor
     */
    static get SystemId() {
        throw new Error("SystemId must be implemented");
    }

    /* -------------------------------------------- */

    /**
     * Returns the image of the actor that should be drawn for the HUD
     * @param actor
     * @returns {*}
     * @protected
     */
    _getActorImage(actor) {
        // If a flag is set, prefer that
        if ( actor.token?.flags?.["mmo-hud"]?.["image"] ) {
            return actor.token.flags["mmo-hud"]["image"];
        }
        else if ( actor.prototypeToken?.flags?.["mmo-hud"]?.["image"] ) {
            return actor.prototypeToken.flags["mmo-hud"]["image"];
        }
        else if ( actor.flags?.["mmo-hud"]?.["image"] ) {
            return actor.flags["mmo-hud"]["image"];
        }

        // If a token exists, use that
        const activeTokens = actor.getActiveTokens();
        if ( activeTokens ) {
            return activeTokens[0].document._actor.img;
        }

        // Otherwise, use actor image
        return actor.img;
    }

    /* -------------------------------------------- */

    /**
     * Determines if an active effect is a Buff for the actor
     * @param {Actor} actor
     * @param {ActiveEffect} effect
     * @returns {boolean}
     * @protected
     */
    _isActiveEffectBuff(actor, effect) {
        return effect.changes.some(c => c.value > 0);
    }

    /* -------------------------------------------- */

    /**
     * Determines if an active effect is a debuff for the actor
     * @param {Actor} actor
     * @param {ActiveEffect} effect
     * @returns {boolean}
     * @protected
     */
    _isActiveEffectDebuff(actor, effect) {
        return effect.changes.some(c => c.value < 0);
    }

    /* -------------------------------------------- */

    /**
     * Get an HTML-rendered tooltip for a given active effect on an actor
     * @param {Actor} actor
     * @param {ActiveEffect} effect
     * @returns {string}
     * @protected
     */
    _getActiveEffectTooltip(actor, effect) {
        return effect.label + (effect.description ? `<br><hr>${effect.description}` : "");
    }

    /* -------------------------------------------- */

    /**
     * Determine relative initative order for the party
     * @param party
     * @returns {*}
     */
    setInitiatives(party) {
        const combatants = game.combat.combatants;
        party.forEach((member) => {
            const combatant = combatants.find(c => c.actor.id === member.id);
            if ( combatant ) {
                member.initiative = combatant.initiative;
            }
        });
        party.sort((a, b) => b.initiative - a.initiative);
        for ( let i = 0; i < party.length; i++ ) {
            party[i].initiativeOrder = i + 1;
        }
        return party;
    }

    /* -------------------------------------------- */

    /**
     * Translates an actor into a format that can be used by the party list in the HUD
     * @param actor
     * @returns {{secondary: {max, name, theme: string, value}, image: *, effects: *, level: number, name, targeted: *, id, primary: {temp: (DND5E.tokenHPColors|number|number|*), max, name, theme: string, value}}}
     */
    translatePartyActor(actor) {
        function _getActorTokenId(actor) {
            const activeTokens = actor.getActiveTokens();
            if (!activeTokens) return null;
            return activeTokens[0].data._id;
        }

        return {
            id: actor.id,
            name: actor.name,
            level: actor.system.details.level.value,
            image: this._getActorImage(actor),
            targeted: game.user.targets.ids.includes(_getActorTokenId(actor)),
            primary: {
                name: actor.system.attributes.hp.label,
                value: actor.system.attributes.hp.value,
                max: actor.system.attributes.hp.max,
                temp: actor.system.attributes.hp.temp,
                theme: "rpg-t-hp"
            },
            secondary: {
                name: actor.system.attributes.recoveries.label,
                value: actor.system.attributes.recoveries.value,
                max: actor.system.attributes.recoveries.max,
                theme: "rpg-t-mp"
            },
            effects: actor.effects.map(e => {
                return {
                    name: e.label,
                    icon: e.icon,
                    isBuff: this._isActiveEffectBuff(actor, e),
                    isDebuff: this._isActiveEffectDebuff(actor, e),
                    tooltip: this._getActiveEffectTooltip(actor, e)
                }
            })
        };
    }

    /* -------------------------------------------- */

    translateEnemyToken(token) {
        return {
            id: token._id,
            name: token.name,
            level: token.actor.system.details.level.value,
            primary: {
                name: token.actor.system.attributes.hp.label,
                value: token.actor.system.attributes.hp.value,
                temp: token.actor.system.attributes.hp.temp,
                max: token.actor.system.attributes.hp.max
            },
            effects: token.actor.effects.map(e => {
                return {
                    name: e.label,
                    icon: e.icon,
                    isBuff: e.changes.some(c => c.value > 0),
                    isDebuff: e.changes.some(c => c.value < 0),
                }
            })
        }
    }
}
