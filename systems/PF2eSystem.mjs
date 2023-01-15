import GenericSystem from "./genericSystem.mjs";

export default class PF2eSystem extends GenericSystem {

    /**
     * @override
     */
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
