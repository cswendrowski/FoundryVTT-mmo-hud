import GenericSystem from "./genericSystem.mjs";

export default class DnD5eSystem extends GenericSystem {

    /** @override */
    getActiveEffects(actor) {
        let effects = super.getActiveEffects(actor);
        return effects.filter(e => e.isTemporary);
    }

    /* -------------------------------------------- */

    /** @override */
    _isActiveEffectBuff(actor, effect) {
        return effect.changes.some(c => c.value > 0 || c.value.includes("+"));
    }

    /* -------------------------------------------- */

    /** @override */
    _isActiveEffectDebuff(actor, effect) {
        return effect.changes.some(c => c.value < 0 || c.value.includes("-"));
    }

    /* -------------------------------------------- */

    /** @override */
    translateResourceBar(actor, barAttribute) {
        let data = super.translateResourceBar(actor, barAttribute);
        switch ( barAttribute ) {
            case "attributes.hp": data.name = "HP"; break;
        }
        return data;
    }

    /* -------------------------------------------- */

    /** @override */
    translatePartyActor(actor) {
        let data = super.translatePartyActor(actor);
        data.level = actor.system.details.level;
        return data;
    }
}
