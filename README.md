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

- [x] static selected cards
  - [x] drag and drop for a card
  - [x] tap to select a card and place

- [ ] Battle rules
  - [x] plus rule
  - [x] same rule
  - [x] combo rule
  - [x] low card rule
  - [ ] Opt: elements rule

- [ ] Trade rules
  - [ ] one rules
  - [ ] all rules
  - [ ] random rules

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
  - [ ] continue Campaign

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
    - [ ] Storyline
    - [ ] different levels with different NPCs
    - [ ] enemy shows known cards face up
    - [x] make node popup pop with animation
  - [ ] save progress after campaign battle

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

- [x] mute button on main menu
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

## Nice-to-have

- [ ] Cards can also attack diagonally
- [ ] Card Designer from Fairy Dust
- [ ] 100 card designs
- [ ] more campaign tracks
- [ ] move placeholder showing what effect the placed card would have with eventual +1 or -1 calculation
- [ ] placeholder shows element effects.
- [ ] show values involved in battle by highlighting them

## NPC Algo:

- [ ] 