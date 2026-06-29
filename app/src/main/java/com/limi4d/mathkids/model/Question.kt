package com.limi4d.mathkids.model

data class Question(
    val num1: Int,
    val num2: Int,
    val operator: Operator,
    val correctAnswer: Int,
    val options: List<Int>
)

enum class Operator(val symbol: String) {
    ADD("+"),
    SUBTRACT("-"),
    MULTIPLY("x"),
    DIVIDE("÷")
}

enum class Difficulty {
    EASY,
    MEDIUM,
    HARD
}
