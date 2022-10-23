const express = require("express");
// const router = express.Router()

const router = require("express-promise-router")();

const userController = require("../controllers/user");

const {validateParam , validateBody, schemas} = require('../helpers/routerHelpers');

router
  .route("/")
  .get(userController.index)
  .post(validateBody(schemas.userSchema), userController.newUser);

  router.route('/signup').post(validateBody(schemas.authSignUpSchema),userController.signUp)
  router.route('/signin').post(validateBody(schemas.authSignInSchema),userController.signIn)
  router.route('/secret').get(userController.secret)



router
  .route("/:userID")
  .get(validateParam(schemas.idSchema, "userID"), userController.getUser)
  .put(
    validateParam(schemas.idSchema, "userID"),
    validateBody(schemas.userSchema),
    userController.replaceUser
  )
  .patch(
    validateParam(schemas.idSchema, "userID"),
    validateBody(schemas.userOptionalSchema),
    userController.updateUser
  );

router
  .route("/:userID/decks")
  .get(validateParam(schemas.idSchema, "userID"), userController.getUserDecks)
  .post(
    validateParam(schemas.idSchema, "userID"),
    validateBody(schemas.deckSchema),
    userController.newUserDecks
  );

module.exports = router;