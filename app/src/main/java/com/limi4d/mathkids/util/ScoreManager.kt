package com.limi4d.mathkids.util

import android.content.Context
import android.content.SharedPreferences
import com.limi4d.mathkids.model.Difficulty

object ScoreManager {

    private const val PREFS_NAME = "math_kids_scores"
    private const val KEY_HIGH_SCORE_PREFIX = "high_score_"
    private const val KEY_TOTAL_GAMES = "total_games"
    private const val KEY_TOTAL_CORRECT = "total_correct"

    private fun getPrefs(context: Context): SharedPreferences {
        return context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    }

    fun getHighScore(context: Context, difficulty: Difficulty): Int {
        return getPrefs(context).getInt("$KEY_HIGH_SCORE_PREFIX${difficulty.name}", 0)
    }

    fun saveScore(context: Context, difficulty: Difficulty, score: Int, totalQuestions: Int): Boolean {
        val prefs = getPrefs(context)
        val currentHigh = getHighScore(context, difficulty)
        val isNewHighScore = score > currentHigh

        prefs.edit().apply {
            if (isNewHighScore) {
                putInt("$KEY_HIGH_SCORE_PREFIX${difficulty.name}", score)
            }
            putInt(KEY_TOTAL_GAMES, getTotalGames(context) + 1)
            putInt(KEY_TOTAL_CORRECT, getTotalCorrect(context) + score)
            apply()
        }

        return isNewHighScore
    }

    fun getTotalGames(context: Context): Int {
        return getPrefs(context).getInt(KEY_TOTAL_GAMES, 0)
    }

    fun getTotalCorrect(context: Context): Int {
        return getPrefs(context).getInt(KEY_TOTAL_CORRECT, 0)
    }

    fun getStars(score: Int, totalQuestions: Int): Int {
        val percentage = (score.toFloat() / totalQuestions) * 100
        return when {
            percentage >= 90 -> 3
            percentage >= 60 -> 2
            percentage >= 30 -> 1
            else -> 0
        }
    }
}
