export default class GenericSystem {

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
        if ( activeTokens.length > 0 ) {
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
     * Return the Active Effets for the actor
     * @param {Actor} actor
     * @returns {Array[ActiveEffect]}
     */
    getActiveEffects(actor) {
        return actor.effects;
    }

    /* -------------------------------------------- */

    /**
     * Translates a resource bar into a format that can be used by the party list in the HUD
     * @param {Actor} actor
     * @param {string} barAttribute
     * @returns {{temp, max, name, value}}
     */
    translateResourceBar(actor, barAttribute) {
        if ( !barAttribute ) return null;
        let attribute = foundry.utils.getProperty(actor, barAttribute);
        if ( !attribute ) attribute = foundry.utils.getProperty(actor, "system." + barAttribute);
        return {
            name: attribute.label ?? barAttribute,
            value: attribute.value,
            max: attribute.max,
            temp: attribute.temp ?? 0
        };
    }

    /* -------------------------------------------- */

    /**
     * Translates an actor into a format that can be used by the party list in the HUD
     * @param actor
     */
    translatePartyActor(actor) {
        function _getActorTokenId(actor) {
            const activeTokens = actor.getActiveTokens();
            if ( activeTokens.length === 0 ) return null;
            return activeTokens[0].data._id;
        }

        let data = {
            id: actor.id,
            name: actor.name,
            image: this._getActorImage(actor),
            targeted: game.user.targets.ids.includes(_getActorTokenId(actor)),
            effects: this.getActiveEffects(actor).map(e => this.translateActiveEffect(actor, e))
        };

        if ( actor.prototypeToken.bar1?.attribute ) {
            data.primary = foundry.utils.mergeObject(this.translateResourceBar(actor, actor.prototypeToken.bar1?.attribute), { theme: "rpg-t-hp" });
        }
        if ( actor.prototypeToken.bar2?.attribute ) {
            data.secondary = foundry.utils.mergeObject(this.translateResourceBar(actor, actor.prototypeToken.bar2?.attribute), { theme: "rpg-t-mp" });
        }
        return data;
    }

    /* -------------------------------------------- */

    /**
     * Translates a Token into a format that can be used by the enemy list in the HUD
     * @param token
     */
    translateEnemyToken(token) {
        return {
            id: token._id,
            name: token.name,
            primary: {
                name: token.actor.system.attributes.hp.label,
                value: token.actor.system.attributes.hp.value,
                temp: token.actor.system.attributes.hp.temp,
                max: token.actor.system.attributes.hp.max
            },
            effects: this.getActiveEffects(token.actor).map(e => this.translateActiveEffect(token.actor, e)),
            showEffects: true
        }
    }

    /* -------------------------------------------- */

    /**
     * Translates an ActiveEffect into a format that can be used by the party list in the HUD
     * @param actor
     * @param effect
     * @returns {{isDebuff: boolean, name, icon, isBuff: boolean}}
     */
    translateActiveEffect(actor, effect) {
        return {
            name: effect.label,
            icon: effect.icon,
            isBuff: this._isActiveEffectBuff(actor, effect),
            isDebuff: this._isActiveEffectDebuff(actor, effect),
            tooltip: this._getActiveEffectTooltip(actor, effect)
        }
    }
}
