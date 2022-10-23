const express = require("express");
// const router = express.Router()

const router = require("express-promise-router")();

const deckController = require("../controllers/deck");
const {
  validateParam,
  validateBody,
  schemas,
} = require("../helpers/routerHelpers");

router
  .route("/")
  .get(deckController.index)
  .post(validateBody(schemas.newDeckSchema), deckController.newDeck);

router
  .route("/:deckID")
  .get(validateParam(schemas.idSchema, "deckID"), deckController.getDeck)
  .put(
    validateParam(schemas.idSchema, "deckID"),
    validateBody(schemas.newDeckSchema),
    deckController.replaceDeck
  )
  .patch(
    validateParam(schemas.idSchema, "deckID"),
    validateBody(schemas.deckOptionalSchema),
    deckController.updateDeck
  )
  .delete(
    validateParam(schemas.idSchema, "deckID"),
    deckController.deleteDeck
  );

module.exports = router;
