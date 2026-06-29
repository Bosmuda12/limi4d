package com.limi4d.mathkids.ui

import android.content.Intent
import android.os.Bundle
import android.view.animation.AnimationUtils
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.MobileAds
import com.limi4d.mathkids.R
import com.limi4d.mathkids.databinding.ActivityMainBinding
import com.limi4d.mathkids.model.Difficulty
import com.limi4d.mathkids.util.ScoreManager

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        MobileAds.initialize(this)

        setupAnimations()
        setupClickListeners()
        loadBannerAd()
    }

    private fun setupAnimations() {
        val bounceAnim = AnimationUtils.loadAnimation(this, R.anim.bounce)
        binding.tvEmoji.startAnimation(bounceAnim)
    }

    private fun setupClickListeners() {
        binding.cardEasy.setOnClickListener {
            startGame(Difficulty.EASY)
        }

        binding.cardMedium.setOnClickListener {
            startGame(Difficulty.MEDIUM)
        }

        binding.cardHard.setOnClickListener {
            startGame(Difficulty.HARD)
        }

        binding.btnHighScore.setOnClickListener {
            showHighScores()
        }
    }

    private fun startGame(difficulty: Difficulty) {
        val intent = Intent(this, GameActivity::class.java).apply {
            putExtra(GameActivity.EXTRA_DIFFICULTY, difficulty.name)
        }
        startActivity(intent)
        overridePendingTransition(R.anim.slide_in_right, R.anim.slide_out_left)
    }

    private fun showHighScores() {
        val easyScore = ScoreManager.getHighScore(this, Difficulty.EASY)
        val mediumScore = ScoreManager.getHighScore(this, Difficulty.MEDIUM)
        val hardScore = ScoreManager.getHighScore(this, Difficulty.HARD)
        val totalGames = ScoreManager.getTotalGames(this)

        val message = buildString {
            append("⭐ Mudah: $easyScore/10\n")
            append("⭐⭐ Sedang: $mediumScore/10\n")
            append("⭐⭐⭐ Sulit: $hardScore/10\n\n")
            append("Total permainan: $totalGames")
        }

        AlertDialog.Builder(this)
            .setTitle(getString(R.string.high_score_title))
            .setMessage(message)
            .setPositiveButton("OK", null)
            .show()
    }

    private fun loadBannerAd() {
        val adRequest = AdRequest.Builder().build()
        binding.adViewMain.loadAd(adRequest)
    }

    override fun onResume() {
        super.onResume()
        binding.adViewMain.resume()
    }

    override fun onPause() {
        binding.adViewMain.pause()
        super.onPause()
    }

    override fun onDestroy() {
        binding.adViewMain.destroy()
        super.onDestroy()
    }
}
