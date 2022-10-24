//can interact with mongoose in 3 ways
// - call back
// - promise
// - async-await
const User = require("../models/User");
const Deck = require("../models/Deck");
const JWT = require("jsonwebtoken");
const { JWT_SECRET } = require('../configs/index');


const encodedToken = (userID) => {
  return JWT.sign({
    iss: ' tue tran cao',
    sub: userID,
    iat: new Date().getTime(),
    exp: new Date().setDate(new Date().getDate() + 3)
  },JWT_SECRET)
}


const Joi = require("@hapi/joi");

const idSchema = Joi.object().keys({
  userID: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
})


//callbacck ways
// const index = (req, res) => {
//   User.find({}, (err, users) => {
//     if (err) next(err);
//     return res.status(200).json({
//       users,
//     });
//   });
// };

//callback ways
// const newUser = (req, res, next) => {
//   //create object models
//   const newUser = new User(req.body);
//   newUser.save((err, user) => {
//     return res.status(201).json({
//       user
//     })
//   });
// };

// const index = (req, res, next) => {
//   //Promise way
//   User.find({})
//     .then((users) => {
//       return res.status(201).json({
//         users,
//       });
//     })
//     .catch((err) => {
//       next(err);
//     });
// };
// const newUser = (req, res, next) => {
//   const newUser = new User(req.body);
//   newUser
//     .save()
//     .then((users) => {
//       return res.status(201).json({
//         users,
//       });
//     })
//     .catch((err) => next(err));
// };

// async-await way
const index = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.status(200).json({ users });
  } catch (err) {
    next(err);
  }
};
const newUser = async (req, res, next) => {
  try {
    const newUser = new User(req.value.body);
    await newUser.save();
    return res.status(201).json({ newUser });
  } catch (err) {
    next(err);
  }
};

const getUser = async (req, res, next) => {

  const validatorResult = idSchema.validate(req.params);


  const { userID } = req.params;
  const user = await User.findById(userID);
  return res.status(200).json({ user });
};

const replaceUser = async (req, res, next) => {
  //enforce new user to old user
  const { userID } = req.value.params;
  const newUser = req.value.body;
  const result = await User.findByIdAndUpdate(userID, newUser);
  return res.status(200).json({ success: true });
};
const updateUser = async (req, res, next) => {
  //number of fields
  const { userID } = req.value.params;
  const newUser = req.value.body;
  const result = await User.findByIdAndUpdate(userID, newUser);
  return res.status(200).json({ success: true });
};

const getUserDecks = async(req, res, next) => {
  const { userID } = req.value.params
  //get user
  const user = await (await User.findById(userID)).populate('decks')
  return res.status(200).json({decks: user.decks});
}
const newUserDecks = async (req, res, next) => {
   const { userID } = req.value.params  
  //create new deck 
  const newDeck = new Deck(req.value.body)
  //get user
  const user = await User.findById(userID)
  //assign user as a deck owner
  newDeck.owner = user 
  //save the deck
  await newDeck.save()
  // add newdeck to arrDeks in user
  user.decks.push(newDeck._id)

  //save user 
  await user.save()

  return res.status(201).json({ deck : newDeck})

}

const signUp = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.value.body

  //check if email exist in system
  const foundUser = await User.findOne({ email }) 
  if (foundUser) {
    return res.status(403).json({
      error:{ message:'Email is already in use'}
    })
  }

  //create new user
  const newUser = new User({ firstName, lastName, email, password })
  newUser.save()
  // endcode a token for new user
  const token = encodedToken(newUser._id)
  
  res.setHeader('Authorization', token)

  return res.status(201).json({
    success: true,
  })

}
const signIn = async (req, res, next) => {
  // assign a token
  const token = encodedToken(req.user._id)
  res.setHeader('Authorization', token)
  res.status(200).json({
    success: true
  })
}
const secret = async (req, res, next) => {
   return res.status(200).json({resources: true , user: req.user})
}

const authGoogle = async (req, res, next) => {
  // assign a token
  const token = encodedToken(req.user._id);
  res.setHeader("Authorization", token);
  res.status(200).json({
    success: true,
  });
};

module.exports = {
  index,
  newUser,
  getUser,
  replaceUser,
  updateUser,
  getUserDecks,
  newUserDecks,
  signUp,
  signIn,
  secret,
  authGoogle,
};
