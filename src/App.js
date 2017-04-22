import React, { Component } from 'react'
import logo from './logo.svg'
import Popout from './Popout.js'
import './App.css'

let monsters = [
  {
    type: 'monster',
    name: 'Ydrasil',
    id: 1,
    tier: 1,
    HP: 400,
    master: [1, 2],
    apprentice: [3],
    weak: []
  },
  {
    type: 'monster',
    name: 'Iggsy',
    id: 2,
    tier: 1,
    HP: 300,
    master: [1, 3],
    apprentice: [2],
    weak: []
  },
  {
    type: 'monster',
    name: 'Bub',
    id: 3,
    tier: 1,
    HP: 300,
    master: [1, 2, 3],
    apprentice: [],
    weak: [1]
  },
  {
    type: 'monster',
    name: 'Niall',
    id: 4,
    tier: 1,
    HP: 500,
    master: [1],
    apprentice: [2],
    weak: []
  },
  {
    type: 'monster',
    name: 'FOLIOT',
    id: 5,
    tier: 2,
    HP: 600,
    master: [1, 2],
    apprentice: [3],
    weak: []
  }
]

let spells = [
  {
    name: 'Stippling Mist',
    type: 'spell',
    tier: 1,
    effectText: 'deal 200 damage',
    healthCost: 100
  }
]

// renders a blank card back
const CardBack = () => {
  return (
    <div className='monsterCardBack' />
  )
}

const MIPArea = ({player}) => {
  if (player.MIP.length) {
    return <Card card={player.MIP[0]} />
  } else {
    return <CardBack />
  }
}

// takes a player as an input and returns a div with all the cards in their hand displayed
const Hand = ({player}) => (
  <div className='hand'>
    {player.hand.map((card, index) =>
      <Card card={card} key={index} player={player} />
    )}
  </div>
)

const BlindHand = ({player}) => (
  <div className='hand'>
    {player.hand.map((card, index) =>
      <CardBack key={index} />
     )}
  </div>
)

class HostingComponent extends React.Component {
  constructor (props) {
    super(props)
    this.popout = this.popout.bind(this)
    this.popoutClosed = this.popoutClosed.bind(this)
    this.state = { isPoppedOut: false }
  }

  popout () {
    this.setState({isPoppedOut: true})
  }

  popoutClosed () {
    this.setState({isPoppedOut: false})
  }

  render () {
    if (this.state.isPoppedOut) {
      return (
        <Popout url='popout.html' title='Window title' onClosing={this.popoutClosed}>
          <div>Popped out content!</div>
        </Popout>
      )
    } else {
      var popout = <span onClick={this.popout} className='buttonGlyphicon glyphicon glyphicon-export'>OPEN</span>
      return (
        <div>
          <strong>Section {popout}</strong>
          <div>Inline content</div>
        </div>
      )
    }
  }
}

const Health = ({player}) => (
  <div className='health'>
    <h3>{player.name} Health: {player.HP}</h3>
  </div>
 )

const canPlay = (card, player) => {
  if (card.type === 'monster') {
    if (card.tier === returnEvolveTier(player.MIP)) {
      return true
    } else {
      return false
    }
  } else if (card.type === 'spell') {
    if (card.tier === returnTier(player.MIP)) {
      return true
    } else {
      return false
    }
  }
}

// This function takes a card and returns that card's tier

const returnTier = function (card) {
  if (card.tier) {
    return card.tier
  } else {
    return false
  }
}

// This function takes a card and returns that card's evolution tier

const returnEvolveTier = function (card) {
  const evolveTier = returnTier(card) + 1
  return evolveTier
}

const Card = ({card, player}) => {
  var buttonProps = {
    display: canPlay(card, player) ? 'block' : 'none'
  }

  switch (card.type) {
    case 'monster':
      return (
        <div className='monsterCard'>
          <div className='top-row-monster'>
            <h3 className='monsterName'>{card.name}</h3>
            <h3 className='monsterHealth'>{card.HP}</h3>
          </div>
          <button style={buttonProps}>PLAY</button>
          <p className='monsterMaster'>Master: {card.master.join(' ')}</p>
          <p className='monsterApprentice'>Apprentice: {card.apprentice.join(' ')}</p>
          <p className='monsterWeak'>Weak to: {card.weak.join(' ')}</p>
        </div>
      )

    case 'spell':
      return (
        <div className='spellCard'>
          <h3 className='spellName'>{card.name}</h3>
          <p className='spellTier'>Tier: {card.tier}</p>
          <p className='spellText'>{card.effectText}</p>
          <p className='spellHealth'>Apprentice Health Cost: {card.healthCost}</p>
        </div>
      )
  }
}

// Takes a player and a number of cards to be drawn
// returns the new <deck> and the new <cards> property, or <false>
const drawACard = (player, number) => {
  let newDeck = [...player.deck]
  let newHand = [...player.hand]
  for (var i = 0; i < number; i++) {
    if (newDeck.length > 0) {
      newHand.push(newDeck[0])
      newDeck.splice(0, 1)
    } else {
      console.log('shuffling')
      newDeck = shuffleTrashIntoDeck(newDeck, player.trash)
      if (newDeck.length > 0) {
        newHand.push(newDeck[0])
        newDeck.splice(0, 1)
      } else {
        console.log('empty deck')
      }
    }
  }

  return ({
    deck: newDeck,
    cards: newHand
  })
}

const shuffle = (myArray) => {
  if (myArray.length === 0) {
  }
  const newArray = [...myArray]
  let i = 0
  let j = 0
  let temp = null

  for (i = newArray.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1))
    temp = newArray[i]
    newArray[i] = newArray[j]
    newArray[j] = temp
  }
  return newArray
}

// takes a player as an input
// creates a cloned object that takes the player's deck and trash, concats them, and calls shuffle()
// Returns a new deck with all the cards from the trash properly shuffled in
const shuffleTrashIntoDeck = (deck, trash) => {
  let newDeck = [...deck].concat([...trash])
  newDeck = shuffle(newDeck)
  return newDeck
}

class Board extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      player: {
        name: 'Player',
        HP: 15,
        deck: [monsters[0], monsters[4], monsters[1], monsters[4]],
        trash: [],
        hand: [],
        MIP: [],
        tempInPlay: []
      },
      opponent: {
        name: 'Opponent',
        HP: 15,
        deck: [monsters[2], monsters[3], monsters[2], spells[0], monsters[1]],
        trash: [],
        hand: [],
        MIP: [],
        tempInPlay: []
      }
    }
  }

  componentDidMount () {
    const newPlayerArray = drawACard(this.state.player, 3)
    const newOpponentArray = drawACard(this.state.opponent, 3)
    this.setState((prevState) => ({
      ...prevState,
      player: {
        ...prevState.player,
        hand: newPlayerArray.cards,
        deck: newPlayerArray.deck,
        trash: newPlayerArray.trash
      },
      opponent: {
        ...prevState.opponent,
        hand: newOpponentArray.cards,
        deck: newOpponentArray.deck,
        trash: newOpponentArray.trash
      }
    }))
  }

  render () {
    return (
      <div className='Board'>
        <div className='opponent-row'>
          <BlindHand player={this.state.opponent} />
          <Health player={this.state.opponent} />

        </div>
        <HostingComponent />
        <Hand player={this.state.player} />
        <Health player={this.state.player} />

      </div>
    )
  }

}

// P L A Y I N G
// D R A W I N G
//    A N D
// S H U F F L I N G

// http://stackoverflow.com/questions/6857468/converting-a-js-object-to-an-array

// takes a card and executes that card's effect, then locates the card's index in the player's hand
// and removes the card from the player's hand, then pushes it to the trash array.
/*
const playCard = function (myCardIndex) {
  const discardedCard = playerHand.splice(myCardIndex, 1)[0]
  discardedCard.cardEffect()
  playerTrash.push(discardedCard)
  renderPlayerHand()
  renderEnemyHand()
  renderHealth()
}

// R E N D E R I N G
//   T H I N G S

// takes an array of card elements and adds a play button to them if they can be played
// FUTURE - HIGHLIGHT WITH RELEVANT BORDERS

// This function expects to be applied to hovered cards. On hover, it determines if the card in question is
// a monster. If yes, it checks if it's a tier 1 monster AND the monster zone if empty. If yes, it turns
// the card opaque and adds a "Play" button to the card

// Takes a monster and a player. The card is removed from the hand array and entered into the inPlay array
const putIntoPlay = function (monster, player) {
  var inPlayNow = player.MIP

  if (inPlayNow.tier > 0) {
    player.tempInPlay.push(inPlayNow)
  }

  player[MIP] = null
  player[MIP] = monster

  // Finds the monster in the player's hand and removes it from the hand array
  var handIndex = player.hand.indexOf(monster)
  player.hand.splice(handIndex, 1)

  renderMonsters()
  renderHands()
}

// Takes a player as input, returns true if their monsterZone is empty and false if it is full
const isMonstersEmpty = ({player}) => {
  if (player.MIP.name) {
    return true
  } else {
    return false
  }
}

// return true if the given tier matches the card

const doesTierMatch = function (tier, card) {
  if (card.tier === tier) {
    return true
  } else {
    return false
  }
}

// Takes a card and an array, then loops through the array to find if the card could evolve to any of the array cards
// If yes, it returns that array; if not, it returns false

const checkEvolveMatch = function (myCard, myArray) {
  var evolveTo = returnEvolveTier(myCard)
  var MatchingCards = myArray.filter(function (exampleCard) {
    return doesTierMatch(evolveTo, exampleCard)
  })
  if (MatchingCards.length > 0) {
    return MatchingCards
  } else {
    return false
  }
}

// Takes a card and an array and returns true if the card COULD evolve into an array card, and false if not

const canEvolve = function (myCard, myArray) {
  const evolveYes = checkEvolveMatch(myCard, myArray)
  if (evolveYes) {
    return true
  } else {
    return false
  }
}

// Takes a player as an input, then returns true if they have a monster in play, and false if not

const hasMIP = function (player) {
  if (player.MIP.tier) {
    return true
  } else {
    return false
  }
}
*/

export default Board
