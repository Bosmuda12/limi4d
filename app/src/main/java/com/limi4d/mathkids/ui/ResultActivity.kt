package com.limi4d.mathkids.ui

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.view.animation.AnimationUtils
import androidx.appcompat.app.AppCompatActivity
import com.google.android.gms.ads.AdRequest
import com.limi4d.mathkids.R
import com.limi4d.mathkids.databinding.ActivityResultBinding
import com.limi4d.mathkids.model.Difficulty
import com.limi4d.mathkids.util.ScoreManager

class ResultActivity : AppCompatActivity() {

    companion object {
        const val EXTRA_SCORE = "extra_score"
        const val EXTRA_TOTAL = "extra_total"
        const val EXTRA_DIFFICULTY = "extra_difficulty"
    }

    private lateinit var binding: ActivityResultBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityResultBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val score = intent.getIntExtra(EXTRA_SCORE, 0)
        val total = intent.getIntExtra(EXTRA_TOTAL, 10)
        val difficultyName = intent.getStringExtra(EXTRA_DIFFICULTY) ?: Difficulty.EASY.name
        val difficulty = Difficulty.valueOf(difficultyName)

        val isNewHighScore = ScoreManager.saveScore(this, difficulty, score, total)
        val stars = ScoreManager.getStars(score, total)

        displayResults(score, total, stars, isNewHighScore)
        setupButtons(difficulty)
        loadBannerAd()
    }

    private fun displayResults(score: Int, total: Int, stars: Int, isNewHighScore: Boolean) {
        val percentage = (score.toFloat() / total) * 100

        val (emoji, title) = when {
            percentage >= 90 -> "🏆" to getString(R.string.result_perfect)
            percentage >= 60 -> "🌟" to getString(R.string.result_great)
            percentage >= 30 -> "👍" to getString(R.string.result_good)
            else -> "💪" to getString(R.string.result_try_again)
        }

        binding.tvResultEmoji.text = emoji
        binding.tvResultTitle.text = title
        binding.tvScoreResult.text = "$score"
        binding.tvScoreLabel.text = getString(R.string.result_score, score, total)

        val starViews = listOf(binding.tvStar1, binding.tvStar2, binding.tvStar3)
        starViews.forEachIndexed { index, textView ->
            textView.text = if (index < stars) "⭐" else "☆"
        }

        if (isNewHighScore) {
            binding.tvHighScore.visibility = View.VISIBLE
            binding.tvHighScore.text = "🎉 Skor Tertinggi Baru!"
        }

        val bounceAnim = AnimationUtils.loadAnimation(this, R.anim.bounce)
        binding.tvResultEmoji.startAnimation(bounceAnim)
    }

    private fun setupButtons(difficulty: Difficulty) {
        binding.btnPlayAgain.setOnClickListener {
            val intent = Intent(this, GameActivity::class.java).apply {
                putExtra(GameActivity.EXTRA_DIFFICULTY, difficulty.name)
            }
            startActivity(intent)
            finish()
            overridePendingTransition(R.anim.slide_in_right, R.anim.slide_out_left)
        }

        binding.btnHome.setOnClickListener {
            val intent = Intent(this, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_NEW_TASK
            }
            startActivity(intent)
            finish()
            overridePendingTransition(R.anim.fade_in, R.anim.fade_out)
        }
    }

    private fun loadBannerAd() {
        val adRequest = AdRequest.Builder().build()
        binding.adViewResult.loadAd(adRequest)
    }

    override fun onResume() {
        super.onResume()
        binding.adViewResult.resume()
    }

    override fun onPause() {
        binding.adViewResult.pause()
        super.onPause()
    }

    override fun onDestroy() {
        binding.adViewResult.destroy()
        super.onDestroy()
    }
}
