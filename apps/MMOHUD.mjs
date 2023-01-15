import GenericSystem from "../systems/genericSystem.mjs";

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

    constructor(options) {
        super(options);
        this.systemConverter = new GenericSystem();

        switch (game.system.id) {
            case "archmage":
                //this.systemConverter = new ArchmageSystem();
                break;
            case "dnd5e":
                //this.systemConverter = new DnD5eSystem();
                break;
            case "pf2e":
                //this.systemConverter = new PF2eSystem();
                break;
            default:
                console.log(`MMO HUD | No specific system converter found for ${game.system.id}, using the Generic one.`);
        }
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
        data.enemies = this._getEnemies(data.party.map(a => a.id));

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
            const totalPrimary = enemy.primary.max + (enemy.primary.temp ?? 0);
            enemy.primary.percent = Math.round((enemy.primary.value / totalPrimary) * 100);
            if ( enemy.primary.temp ) {
                enemy.primary.bonusPercent = Math.round((enemy.primary.temp / totalPrimary) * 100);
            }
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

        // Translate the actor data into the format we need
        let data = party.map(a => this.systemConverter.translatePartyActor(a));

        if ( game.combat ) {
            data = this.systemConverter.setInitiatives(data);
        }
        return data;
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

    _getEnemies(partyIds) {
        if ( !canvas?.scene ) return [];

        const targeted = Array.from(game.user.targets
            .filter(t => !partyIds.includes(t.document.actor._id))
            .map(t => t.document));
        const boss = canvas.scene.tokens.filter(t => t.flags["mmo-hud"] && t.flags["mmo-hud"]["boss"] === true);
        let enemies = targeted.concat(boss);
        enemies = enemies.filter((v, i, a) => a.findIndex(t => (t._id === v._id)) === i);

        return enemies.map(t => this.systemConverter.translateEnemyToken(t));
    }

    /* -------------------------------------------- */

    _getMockEnemiesData() {
        return [
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
        ];
    }

    /* -------------------------------------------- */

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);
        html.find(".rpg-nav-a").click(this._onCharacterClick.bind(this));
    }

    /* -------------------------------------------- */

    _onCharacterClick(event) {
        event.preventDefault();
        const actorId = event.currentTarget.dataset.documentId;
        const actor = game.actors.get(actorId);
        if ( actor ) {
            const activeTokenIds = actor.getActiveTokens().map(t => t.id);
            const currentTargets = game.user.targets.ids;
            // If id is already in the set, remove it
            if ( game.user.targets.ids.includes(activeTokenIds[0]) ) {
                const newTargets = currentTargets.filter(id => id !== activeTokenIds[0]);
                game.user.updateTokenTargets(newTargets);
            }
            else {
                game.user.updateTokenTargets(currentTargets.concat(activeTokenIds));
            }
        }
    }
}
