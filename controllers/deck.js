const Deck = require("../models/Deck");
const User = require("../models/User");

// async-await way
const index = async (req, res, next) => {
  const deck = await Deck.find({});
  return res.status(200).json({ deck });
};
const newDeck = async (req, res, next) => {
  const owner = await User.findById(req.value.body.owner);
  const deck = req.value.body;
  delete deck.owner;
  deck.owner = owner._id;
  const newDeck = new Deck(deck);
  await newDeck.save();

  owner.decks.push(newDeck._id);
  await owner.save();

  return res.status(201).json({
    deck: newDeck,
  });
};
const getDeck = async (req, res, next) => {
    const deck = await Deck.findById(req.value.params.deckID)
    return res.status(200).json({deck})
}
const replaceDeck = async (req, res, next) => {
  const { deckID } = req.value.params
  const newDeck = req.value.body
  const result = await Deck.findByIdAndUpdate(deckID, newDeck)

  //check if put user, remove dek user model

  return res.status(200).json({success:true})
}
const updateDeck = async (req, res, next) => {
  const { deckID } = req.value.params;
  const newDeck = req.value.body;
  const result = await Deck.findByIdAndUpdate(deckID, newDeck);
  //check if put user, remove dek user model
  return res.status(200).json({ success: true });
}
const deleteDeck = async (req, res, next) => {
  const { deckID } = req.value.params;
  const deck = await Deck.findById(deckID)
  const ownerID = await deck.owner
  const owner = await User.findById(ownerID)
  await deck.remove()
  owner.decks.pull(deck)
  await owner.save()
  return res.status(200).json({success: true})
}

module.exports = {
  index,
  newDeck,
  getDeck,
  replaceDeck,
  updateDeck,
  deleteDeck
};
