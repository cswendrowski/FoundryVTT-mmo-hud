![](https://img.shields.io/badge/Foundry-v10-informational)


# MMO HUD: XIV

A retro fantasy RPG-inspired Party HUD with Enemy health bars

## How does it work?

The Party list (top left) is populated with the following:

1) All Actors assigned as a "Selected Character" to a User (with a game option to have this only apply to logged-in users)
2) While a Combat is active, additionall all friendly disposition combatants

The Enemy targeting (bottom middle) is populated with the following:

1) Any targeted Tokens that are not in the Party List
2) Any Combatants that have had the "Toggle MMO Health Bar" button in the combatants list toggled on

![](https://media.discordapp.net/attachments/830182194533892116/1063996189487398962/image.png)

## Explicit System Support
This should generally work on all systems, but it has explicit additional support for:
* 13th Age
* DND5E
* PF2E (including their conditions)

![pf2e](https://media.discordapp.net/attachments/724717068364283924/1064031343480147988/image.png)

## Features

### Active Effect display with buff / debuff detection and visual indication!
![](https://media.discordapp.net/attachments/830182194533892116/1063996319456297051/image.png)

### Retro RPG style resource bars and cursors!
![](https://media.discordapp.net/attachments/830182194533892116/1063996453535629362/image.png)

### Temporary Health support!
![](https://media.discordapp.net/attachments/830182194533892116/1063999467008827452/temp-health.gif?width=960&height=323)

### Clicking a party member toggles targeting it, and targeted friendly tokens get an indicator as well!
![](https://media.discordapp.net/attachments/830182194533892116/1063996619223224371/image.png?width=960&height=440)

### Combat mode adds friendly disposition tokens, and shows relative initiative order!
![](https://media.discordapp.net/attachments/830182194533892116/1063996994856701992/image.png)

### Target your enemies as well for a basic overview of their health and effects!
![](https://media.discordapp.net/attachments/830182194533892116/1063997154634518658/image.png?width=960&height=462)

### You can also lock a specific enemy's bar on for everyone, perfect for bosses!
![](https://media.discordapp.net/attachments/830182194533892116/1063997303423242250/image.png?width=960&height=656)

### Optional transparent mode!
![](https://media.discordapp.net/attachments/830182194533892116/1063997399841898516/image.png)

### Configure when it shows up!
![](https://media.discordapp.net/attachments/830182194533892116/1063997461263306833/image.png)

### Set custom images!
`game.actors.get(<ID>).setFlag("mmo-hud", "image", "my-cool-image-to-render-instead.png")`
