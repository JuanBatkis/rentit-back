
const express = require("express")
const router = express.Router()
const {
  getAllProductQuestions,
  getUserQuestions,
  createQuestion,
  answerQuestion,
  deleteQuestion
} = require("../controllers/question")

const { isAuth, catchErrors } = require("../middlewares")

router.get("/prod-question/:productId", catchErrors(getAllProductQuestions))

router.get("/user-question/:userId/:status", isAuth, catchErrors(getUserQuestions))

router.post("/", isAuth, catchErrors(createQuestion))

router.patch("/:questionId", isAuth, catchErrors(answerQuestion))

router.delete("/:questionId", isAuth, catchErrors(deleteQuestion))


module.exports = router