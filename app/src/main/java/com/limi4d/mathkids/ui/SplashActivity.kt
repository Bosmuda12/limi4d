package com.limi4d.mathkids.ui

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.animation.AnimationUtils
import androidx.appcompat.app.AppCompatActivity
import com.limi4d.mathkids.R
import com.limi4d.mathkids.databinding.ActivitySplashBinding

class SplashActivity : AppCompatActivity() {

    private lateinit var binding: ActivitySplashBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySplashBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val bounceAnim = AnimationUtils.loadAnimation(this, R.anim.bounce)
        val fadeInAnim = AnimationUtils.loadAnimation(this, R.anim.fade_in)

        binding.tvSplashEmoji.startAnimation(bounceAnim)
        binding.tvSplashTitle.startAnimation(fadeInAnim)
        binding.tvSplashSubtitle.startAnimation(fadeInAnim)

        Handler(Looper.getMainLooper()).postDelayed({
            startActivity(Intent(this, MainActivity::class.java))
            finish()
            overridePendingTransition(R.anim.fade_in, R.anim.fade_out)
        }, 2500)
    }
}
