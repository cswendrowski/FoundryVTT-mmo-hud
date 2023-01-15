import GenericSystem from "./genericSystem.mjs";

export default class SWADESystem extends GenericSystem {

    /** @override */
    translatePartyActor(actor) {
        let data = super.translatePartyActor(actor);
        data.level = actor.system.advances?.value
        return data;
    }

    /* -------------------------------------------- */

    /** @override */
    translateResourceBar(actor, barAttribute) {
        let data = super.translateResourceBar(actor, barAttribute);
        switch ( barAttribute ) {
            case "wounds":
            case "fatigue": data.value = data.max - data.value; break;
        }
        return data;
    }
}
