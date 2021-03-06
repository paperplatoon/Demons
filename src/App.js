import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import './App.css'

let monsters = [
  {
    type: 'monster',
    name: 'Ydrasil',
    id: 1,
    tier: 1,
    HP: 400,
    master: [2],
    apprentice: [1, 3],
    weak: []
  },
  {
    type: 'monster',
    name: 'Iggsy',
    id: 2,
    tier: 3,
    HP: 800,
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
    master: [2],
    apprentice: [1, 3],
    weak: []
  }
]

let spells = [
  {
    name: 'Stippling Mist',
    type: 'spell',
    tier: 1,
    effectText: 'deal 200 damage',
    healthCost: 100,
    damage: 300
  }
]

// ///////////////////////////////////////////////////// RENDERINGS ///////////////////////////////

// renders a blank card back
const CardBack = () => {
  return (
    <div className='monsterCardBack' />
  )
}

// If player.MIP has at least one item, then this displays a Card with the last card in the arry
const MIPArea = ({player}) => {
  if (player.MIP.length) {
    return <InPlayCard card={player.MIP[player.MIP.length - 1]} />
  } else {
    return <CardBack />
  }
}

const InPlayCard = ({card}) => (
  <div className='monsterCard'>
    <div className='top-row-monster'>
      <h3 className='monsterName'>{card.name}</h3>
      <h3 className='monsterHealth'>{card.HP}</h3>
    </div>
    <p className='monsterMaster'>Master: {card.master.join(' ')}</p>
    <p className='monsterApprentice'>Apprentice: {card.apprentice.join(' ')}</p>
    <p className='monsterWeak'>Weak to: {card.weak.join(' ')}</p>
  </div>
)

// takes a player as an input and returns a div with all the cards in their hand displayed
const Hand = ({player, onPlay, spellPlay}) => (
  <div className='hand'>
    {player.hand.map((card, index) =>
      <Card card={card} key={index} player={player} onPlay={onPlay} myIndex={index} spellPlay={spellPlay} />
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

const Health = ({player}) => (
  <div className='health'>
    <h3>{player.name} Health: {player.HP}</h3>
  </div>
 )

// ////////////////////////////////////////////////////////////////////////////////////

// takes a card and a player and gives them a play button if they can be played

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

// Takes a player as an input, then returns true if they have a monster in play, and false if not
const hasMIP = function (player) {
  if (player.MIP.length > 0) {
    return true
  } else {
    return false
  }
}

// takes a spell card and a player object and calculates the damage the spell can do, returning the damage as a number
// returns false if the player cannot cast the spell normally
const calcSpellDamage = (spellCard, player) => {
  let damage = 0

  // determines whether or not the player's monster can cast the card and for how much damage
  if (!hasMIP(player)) {
    console.log('player has no monster in play')
    return false
  } else if (player.MIP[player.MIP.length - 1].master.indexOf(spellCard.tier) !== -1) {
    console.log('card is receiving normal damage')
    damage = spellCard.damage
    return damage
  } else if (player.MIP[player.MIP.length - 1].apprentice.indexOf(spellCard.tier) !== -1) {
    console.log('card is receiving apprentice damage')
    damage = spellCard.damage - 200
    return damage
  } else {
    console.log("card tier isn't in apprentice or master arrays ")
    return false
  }
}

const canPlay = (card, player) => {
  let thing = false
  if (card.type === 'monster') {
    thing = (player.MIP.length === 0 && card.tier === 1) ? true : false
  } else if (card.type === 'spell') {
    const spellDamage = calcSpellDamage(card, player)
    thing = (spellDamage > 0) ? true : false
  }
  return thing
}

// This function takes a card and returns that card's evolution tier

const canEvolve = (card, player) => {
  let thing = false
  if (card.type === 'monster') {
    thing = (player.MIP.length > 0 && player.MIP[player.MIP.length - 1].tier === (card.tier - 1)) ? true : false
  }
  return thing
}

// changed to returning false rather than 1
const returnEvolveTier = function (card) {
  if (card.tier) {
    const evolveTier = card.tier + 1
    return evolveTier
  } else {
    return false
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

const Card = ({card, player, onPlay, myIndex, spellPlay}) => {
  const buttonProps = {
    display: canPlay(card, player) ? 'block' : 'none'
  }

  const monsterEvolveProps = {
    display: canEvolve(card, player) ? 'block' : 'none'
  }

  switch (card.type) {
    case 'monster':
      return (
        <div className='monsterCard'>
          <div className='top-row-monster'>
            <h3 className='monsterName'>{card.name}</h3>
            <h3 className='monsterHealth'>{card.HP}</h3>
          </div>
          <button style={buttonProps} onClick={e => onPlay(myIndex, player)}>PLAY</button>
          <button style={monsterEvolveProps} onClick={e => onPlay(myIndex, player)}>EVOLVE</button>
          <p className='monsterMaster'>Master Tiers: {card.master.join(' ')}</p>
          <p className='monsterApprentice'>Apprentice Tiers: {card.apprentice.join(' ')}</p>
          <p className='monsterWeak'>Weak to Tiers: {card.weak.join(' ')}</p>
        </div>
      )

    case 'spell':
      return (
        <div className='spellCard'>
          <h3 className='spellName'>{card.name}</h3>
          <button style={buttonProps} onClick={e => spellPlay(myIndex, player)}>PLAY</button>
          <p className='spellTier'>Tier: {card.tier}</p>
          <p className='spellText'>{card.effectText}</p>
          <p className='spellHealth'>Apprentice Health Cost: {card.healthCost}</p>
        </div>
      )
  }
}

class Board extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      player: {
        name: 'player',
        HP: 15,
        deck: [monsters[0], monsters[4], spells[0], monsters[1]],
        trash: [],
        hand: [],
        MIP: [],
        tempInPlay: []
      },
      opponent: {
        name: 'opponent',
        HP: 15,
        deck: [monsters[2], monsters[3], monsters[2], spells[0], monsters[1]],
        trash: [],
        hand: [],
        MIP: [monsters[1]],
        tempInPlay: []
      }
    }

    this.playCard = this.playCard.bind(this)
    this.playSpell = this.playSpell.bind(this)
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

  // takes a cardIndex and a player, removes that card from the player's hand and adds it to play, then updates state
  playCard (cardIndex, player) {
    var newPlay = [...player.MIP]
    var newHand = [...player.hand]
    const myCard = newHand[cardIndex]
    newPlay.push(myCard)
    newHand.splice(cardIndex, 1)
    var playerName = (player.name === 'player') ? 'player' : 'opponent'
    this.setState((prevState) => ({
      ...prevState,
      [playerName]: {
        ...prevState[playerName],
        MIP: [...newPlay],
        hand: [...newHand]
      }
    }))
  }

  playSpell (cardIndex, player) {
    let newHand = [...player.hand]
    let opposingPlayer = (player.name === 'player') ? this.state.opponent : this.state.player
    let playerName = (player.name === 'player') ? 'player' : 'opponent'
    let opposingPlayerName = (player.name === 'player') ? 'opponent' : 'player'
    let spellDamage = calcSpellDamage(newHand[cardIndex], player)
    console.log('spell damage is ' + spellDamage)
    let opponentMIP = [...opposingPlayer.MIP]
    let opponentCard = opponentMIP[opponentMIP.length - 1]
    let newOpponentHP = [opposingPlayer.HP]
    let newOpponentMIP = [ ...opposingPlayer.MIP]

    // If opponent has no MIP, then do damage directly to opposing player health
    if (opponentMIP.length === 0) {
      console.log('damaging the opponent for ' + spellDamage)
      newOpponentHP -= spellDamage

    // else if opponent Monster is weak to the spell, add 200 damage, then do the damage to the opponentCard HP
    } else if (opponentMIP[opponentMIP.length - 1].weak.indexOf(newHand[cardIndex].tier) !== -1) {
      spellDamage += 200
      console.log('super damaging the opponent monster for ' + spellDamage)
      opponentCard.HP -= spellDamage
      newOpponentMIP = [opponentMIP.slice(0, opponentMIP.length - 1), opponentCard]

    // else subtract the spell damage from the opponentCard HP total
    } else {
      console.log('damaging the opponent monster for ' + spellDamage)
      opponentCard.HP -= spellDamage
      newOpponentMIP = [opponentMIP.slice(0, opponentMIP.length - 1), opponentCard]
    }

    // remove the card from your hand and discard it
    newHand.splice(cardIndex, 1)

    // set the state now
    this.setState((prevState) => ({
      ...prevState,
      [playerName]: {
        ...prevState[playerName],
        hand: newHand
      },
      [opposingPlayerName]: {
        ...prevState[opposingPlayerName],
        HP: newOpponentHP,
        MIP: newOpponentMIP
      }
    }))
  }

  render () {
    console.log('rendering')
    return (
      <div className='Board'>
        <div className='opponent-row'>
          <BlindHand player={this.state.opponent} />
          <Health player={this.state.opponent} />
        </div>
        <div className='middle-row'>
          <MIPArea player={this.state.opponent} />
          <MIPArea player={this.state.player} />
        </div>

        <div className='player-row'>
          <Hand player={this.state.player} onPlay={this.playCard} spellPlay={this.playSpell} />
          <Health player={this.state.player} />
        </div>

      </div>
    )
  }

}

export default Board
