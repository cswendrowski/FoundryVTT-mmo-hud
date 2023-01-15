import GenericSystem from "./genericSystem.mjs";

export default class ArchmageSystem extends GenericSystem {

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
