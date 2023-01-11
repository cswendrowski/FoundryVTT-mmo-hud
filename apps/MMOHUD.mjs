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
            resourceBar: 'modules/mmo-hud/templates/resource-bar.html',
        });
        return super._renderInner(...args);
    }

    /* -------------------------------------------- */

    /** @override */
    async getData(options) {
        let data = await super.getData(options);
        data.party = this._getParty();
        data.enemies = [
            {
                id: "y2rIVgjNt6EAU0cY",
                name: "Big, Bad, Evil Guy",
                level: 5,
                primary: {
                    name: "Health",
                    value: 18,
                    max: 20,
                },
                effects: [
                    {
                        name: "Blessed",
                        icon: "systems/archmage/assets/icons/skills/emerald_01.jpg",
                        isBuff: true
                    },
                    {
                        name: "Affliction",
                        icon: "systems/archmage/assets/icons/skills/affliction_01.jpg",
                        isDebuff: true
                    },
                    {
                        name: "Red Crystal",
                        icon: "systems/archmage/assets/icons/skills/blood_01.jpg",
                    }
                ]
            },
            {
                id: "y2rIVgjNt6EAU0cY",
                name: "Smaller, Bad, Evil Guy",
                level: 5,
                primary: {
                    name: "Health",
                    value: 5,
                    max: 10,
                },
                effects: [
                    {
                        name: "Blessed",
                        icon: "systems/archmage/assets/icons/skills/emerald_01.jpg",
                        isBuff: true
                    }
                ]
            }
        ]

        // Calculate percentages
        data.party.forEach((member) => {
            const totalPrimary = member.primary.max + (member.primary.temp ?? 0);
            member.primary.percent = Math.round((member.primary.value / totalPrimary) * 100);
            if ( member.primary.temp ) {
                member.primary.bonusPercent = Math.round((member.primary.temp / totalPrimary) * 100);
            }
            member.secondary.percent = Math.round((member.secondary.value / member.secondary.max) * 100);
        });
        data.enemies.forEach((enemy) => {
            enemy.primary.percent = Math.round((enemy.primary.value / enemy.primary.max) * 100);
        });

        // Determine party size
        data.partySize = this._getPartySize(data.party.length);

        return data;
    }

    /* -------------------------------------------- */

    /**
     * Returns the label for the party size
     * @param {number} size
     * @returns {string}
     * @private
     */
    _getPartySize(size) {
        if ( size === 1 ) return "Solo";
        if ( size === 2 ) return "Duo";
        if ( size <= 4 ) return "Light Party";
        if ( size <= 8 ) return "Full Party";
        return "Alliance";
    }

    /* -------------------------------------------- */

    _getParty() {
        // All actors that are assigned to a Player
        let party = game.users.map(u => u.character).filter(c => c);;

        // If we are in combat, additionally return all actors with disposition of Friendly
        function _isFriendly(actor) {
            if ( actor.token ) {
                return actor.token.disposition === CONST.TOKEN_DISPOSITIONS.FRIENDLY;
            }
            else return actor.prototypeToken.disposition === CONST.TOKEN_DISPOSITIONS.FRIENDLY;
        }
        if ( game.combat ) {
            const friendlyCombatants = game.combat.combatants
                .filter(c => _isFriendly(c.actor))
                .map(c => c.actor);
            party = party.concat(friendlyCombatants);
        }
        console.dir(party);

        // Translate the actor data into the format we need
        return party.map(actor => {
            return {
                id: actor.id,
                name: actor.name,
                level: actor.system.details.level.value,
                image: actor.img,
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
                        isBuff: e.changes.some(c => c.value > 0),
                        isDebuff: e.changes.some(c => c.value < 0),
                    }
                })
            }
        });
    }

    /* -------------------------------------------- */

    _getMockPartyData() {
        return [{
            id: "y2rIVgjNt6EAU0cY",
            name: 'Mr. Dragonborn',
            level: 5,
            image: 'systems/archmage/assets/icons/tokens/monsters/dragon-red.webp',
            primary: {
                name: "Health",
                value: 10,
                max: 18,
                theme: "rpg-t-hp"
            },
            secondary: {
                name: "Recoveries",
                value: 3,
                max: 8,
                theme: "rpg-t-mp"
            },
            effects: [
                {
                    name: "Blessed",
                    icon: "systems/archmage/assets/icons/skills/emerald_01.jpg",
                    isBuff: true
                },
                {
                    name: "Affliction",
                    icon: "systems/archmage/assets/icons/skills/affliction_01.jpg",
                    isDebuff: true
                },
                {
                    name: "Red Crystal",
                    icon: "systems/archmage/assets/icons/skills/blood_01.jpg",
                }
            ]
        },
        {
            id: "y2rIVgjNt6EAU0cY",
            name: 'T. Fling',
            level: 5,
            image: 'systems/archmage/assets/icons/tokens/monsters/demon.webp',
            primary: {
                name: "Health",
                value: 15,
                max: 18,
                theme: "rpg-t-hp"
            },
            secondary: {
                name: "Recoveries",
                value: 6,
                max: 8,
                theme: "rpg-t-mp"
            },
            effects: [
                {
                    name: "Blessed",
                    icon: "systems/archmage/assets/icons/skills/emerald_01.jpg",
                    isBuff: true
                },
                {
                    name: "Affliction",
                    icon: "systems/archmage/assets/icons/skills/affliction_01.jpg",
                    isDebuff: true
                },
                {
                    name: "Red Crystal",
                    icon: "systems/archmage/assets/icons/skills/blood_01.jpg",
                }
            ]
        }];
    }

    /* -------------------------------------------- */

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);
    }
}
