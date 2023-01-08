export default class MMOHUD extends Application {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: 'mmo-hud',
            template: 'modules/mmo-hud/templates/mmo-hud.html',
            popOut: false,
            minimizable: false,
            resizable: false,
            top: 0,
            left: 0,
            classes: ['mmo-hud']
        });
    }

    /* -------------------------------------------- */

    static init() {
        const instance = new this();
        ui.mmoHud = instance;
        instance.render(true);
        console.log('MMO HUD | Initialized');
    }

    /* -------------------------------------------- */

    /** @inheritdoc */
    async _renderInner(...args) {
        await loadTemplates({
            characterInfo: 'modules/mmo-hud/templates/character-info.html',
        });
        return super._renderInner(...args);
    }

    /* -------------------------------------------- */

    /** @override */
    async getData(options) {
        let data = await super.getData(options);
        data.party = [{
            name: 'Test',
            image: 'icons/svg/mystery-man.svg',
            hp: 10,
            maxHp: 20,
        }]
        return data;
    }

    /* -------------------------------------------- */

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);
    }
}
