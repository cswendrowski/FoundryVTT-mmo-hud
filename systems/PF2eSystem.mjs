import GenericSystem from "./genericSystem.mjs";

export default class PF2eSystem extends GenericSystem {

    /** @override */
    getActiveEffects(actor) {
        let effects = [];

        effects = effects.concat(Array.from(actor.conditions.values()).map(c => {
            return {
                icon: c.img,
                label: c.name,
                changes: []
            }
        }));

        effects = effects.concat(actor.items.filter(e => e.type == "effect" && !e.system.expired).map(e => {
            return {
                icon: e.img,
                label: e.name,
                description: e.system.description.value,
                changes: e.rules.map(r => {
                    return {
                        key: r.key,
                        value: r.data.value
                    }
                })
            }
        }));
        return effects;
    }

    /* -------------------------------------------- */

    /** @override */
    translateResourceBar(actor, barAttribute) {
        let data = super.translateResourceBar(actor, barAttribute);
        const attribute = foundry.utils.getProperty(actor, barAttribute)
        data.name = attribute.slug;
        return data;
    }

    /* -------------------------------------------- */

    /** @override */
    translatePartyActor(actor) {
        let data = super.translatePartyActor(actor);
        data.level = actor.system.details.level.value;
        return data;
    }

    /* -------------------------------------------- */

    /** @override */
    translateEnemyToken(token) {
        let data = super.translateEnemyToken(token);
        data.level = token.actor.system.details.level.value;
        return data;
    }
}
