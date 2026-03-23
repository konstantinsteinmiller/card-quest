# Card Quest

A fairy card battle game

WIP: [playable demo](https://konstantinsteinmiller.github.io/card-quest/)

![Card Quest menu](https://github.com/konstantinsteinmiller/card-quest/blob/main/src/assets/documentation/main-menu.webp)

![NPC Card Selection](https://github.com/konstantinsteinmiller/card-quest/blob/main/src/assets/documentation/deck-selection.webp)

![NPC Game](https://github.com/konstantinsteinmiller/card-quest/blob/main/src/assets/documentation/gameplay.webp)

# Todo

- [x] basic game field
  - [x] background image
  - [x] grid images
  - [x] visual error shake on wrong placement
  - [x] show game rules on the scoreboard
  - [x] indicator for what rule turned the card
  - [x] rules modal
  - [x] reset dont ask again on rulesModal
  - [x] bounce first card if player is not selecting anything
  - [x] bounce first collection card if playerSelection < 5 and min 1 card with min 1 count in collection if player is
    not selecting anything

- [x] static selected cards
  - [x] drag and drop for a card
  - [x] tap to select a card and place

- [ ] Battle rules
  - [x] plus rule
  - [x] same rule
  - [x] combo rule
  - [x] low card rule
  - [ ] open rule
  - [ ] Opt: elements rule

- [x] Trade rules
  - [x] one rules
  - [x] all rules
  - [x] conquered rules
  - [x] random rules
    - [x] save collection update
    - [x] add one rule to campaign nodes

- [x] Npc logic
  - [x] random choice
  - [x] smart choice
  - [x] different difficulty levels

- [x] Card Models
    - [x] load card images
    - [x] elements in model
    - [x] balanced card values
  - [x] add frames to Cards
    - [x] selected card frame
    - [x] not-selected card frame

- [x] GameOverModal
  - [x] show winner / loser / draw
  - [x] restart game button
  - [x] frame
  - [x] continue Campaign

- [x] Main Menu
    - [x] start game button
    - [x] create Logo
    - [x] settings button
    - [x] background image
    - [x] campaign
    - [x] practice button
    - [x] version
    - [x] mute music and sound

- [ ] Campaign
  - [x] Campaign map and jump of to battle
  - [x] connection lines between nodes
  - [x] set npc cards from the campaign node
  - [x] pick random cards for npc from the campaign node
  - [ ] Storyline
  - [ ] different levels with different NPCs
  - [x] enemy shows known cards face up
  - [x] make node popup pop with animation
  - [x] save progress after campaign battle
  - [x] save knownCards of enemy
  - [x] random player starts
  - [x] able to create new low cards if player has none left
  - [x] EmergencyAid component with 2 new cards from the starters

- [x] OptionsModal
  - [x] music
  - [x] Slider component
  - [x] FSelect component
  - [x] do not ask rules again
  - [x] language options
  - [x] Volume slider for music and sound effects

- [ ] Sound and bg music
    - [ ] bg music
    - [ ] sound effect for card placement
    - [ ] sound effect for card turn
    - [ ] sound effect for plus, same, combo
  - [ ] sound effect Reward continue

- [x] Card selection Page
    - [x] animate card selection
    - [x] Name
    - [ ] element

- [ ] (native) dark mode adjustment

- [ ] Crazy Web games SDK
  - [ ] make game launchable
  - [ ] ads
  - [ ] performance tracking

## Refactorings

- [x] replace remaining Modals with FModal
- [x] rule icons redo
- [ ] layout cards book
- [ ] redo book pager arrows
- [ ] oak texture redo

## Bugs

- [x] double selection if card is multiple times in player hand
- [x] mobile layout changes on landscape
- [x] tap outside Popup doesnt work
- [x] ready button working without 5 cards selected
- [x] contextmenu on mobile

## Nice-to-have

- [ ] Create card models from existing cards using gen AI
- [ ] Cards can also attack diagonally
- [ ] Card Designer from Fairy Dust
- [ ] 100 card designs
- [ ] more campaign tracks
- [ ] move placeholder showing what effect the placed card would have with eventual +1 or -1 calculation
- [ ] placeholder shows element effects.
- [ ] show values involved in battle by highlighting them

## NPC Algo:

- [ ] 

Sounds generated with [elevenLabs](https://elevenlabs.io/app/sound-effects/generate)