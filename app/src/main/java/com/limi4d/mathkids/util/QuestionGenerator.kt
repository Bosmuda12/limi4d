package com.limi4d.mathkids.util

import com.limi4d.mathkids.model.Difficulty
import com.limi4d.mathkids.model.Operator
import com.limi4d.mathkids.model.Question
import kotlin.random.Random

object QuestionGenerator {

    private const val TOTAL_QUESTIONS = 10
    private const val NUM_OPTIONS = 4

    fun generateQuestions(difficulty: Difficulty): List<Question> {
        return (1..TOTAL_QUESTIONS).map { generateQuestion(difficulty) }
    }

    private fun generateQuestion(difficulty: Difficulty): Question {
        return when (difficulty) {
            Difficulty.EASY -> generateEasyQuestion()
            Difficulty.MEDIUM -> generateMediumQuestion()
            Difficulty.HARD -> generateHardQuestion()
        }
    }

    private fun generateEasyQuestion(): Question {
        val num1 = Random.nextInt(1, 11)
        val num2 = Random.nextInt(1, 11)
        val answer = num1 + num2
        return Question(
            num1 = num1,
            num2 = num2,
            operator = Operator.ADD,
            correctAnswer = answer,
            options = generateOptions(answer)
        )
    }

    private fun generateMediumQuestion(): Question {
        val isAddition = Random.nextBoolean()
        return if (isAddition) {
            val num1 = Random.nextInt(10, 51)
            val num2 = Random.nextInt(10, 51)
            val answer = num1 + num2
            Question(
                num1 = num1,
                num2 = num2,
                operator = Operator.ADD,
                correctAnswer = answer,
                options = generateOptions(answer)
            )
        } else {
            val num1 = Random.nextInt(20, 51)
            val num2 = Random.nextInt(1, num1)
            val answer = num1 - num2
            Question(
                num1 = num1,
                num2 = num2,
                operator = Operator.SUBTRACT,
                correctAnswer = answer,
                options = generateOptions(answer)
            )
        }
    }

    private fun generateHardQuestion(): Question {
        val isMultiplication = Random.nextBoolean()
        return if (isMultiplication) {
            val num1 = Random.nextInt(2, 13)
            val num2 = Random.nextInt(2, 13)
            val answer = num1 * num2
            Question(
                num1 = num1,
                num2 = num2,
                operator = Operator.MULTIPLY,
                correctAnswer = answer,
                options = generateOptions(answer)
            )
        } else {
            val num2 = Random.nextInt(2, 13)
            val answer = Random.nextInt(2, 13)
            val num1 = num2 * answer
            Question(
                num1 = num1,
                num2 = num2,
                operator = Operator.DIVIDE,
                correctAnswer = answer,
                options = generateOptions(answer)
            )
        }
    }

    private fun generateOptions(correctAnswer: Int): List<Int> {
        val options = mutableSetOf(correctAnswer)
        val minRange = maxOf(1, correctAnswer - 10)
        val maxRange = correctAnswer + 10

        while (options.size < NUM_OPTIONS) {
            val wrongAnswer = Random.nextInt(minRange, maxRange + 1)
            if (wrongAnswer != correctAnswer && wrongAnswer > 0) {
                options.add(wrongAnswer)
            }
        }

        return options.toList().shuffled()
    }
}
