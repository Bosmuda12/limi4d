package com.limi4d.mathkids.ui

import android.content.Intent
import android.os.Bundle
import android.os.CountDownTimer
import android.view.View
import android.view.animation.AnimationUtils
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.FullScreenContentCallback
import com.google.android.gms.ads.LoadAdError
import com.google.android.gms.ads.interstitial.InterstitialAd
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback
import com.limi4d.mathkids.R
import com.limi4d.mathkids.databinding.ActivityGameBinding
import com.limi4d.mathkids.model.Difficulty
import com.limi4d.mathkids.model.Question
import com.limi4d.mathkids.util.QuestionGenerator
import com.limi4d.mathkids.util.SoundHelper

class GameActivity : AppCompatActivity() {

    companion object {
        const val EXTRA_DIFFICULTY = "extra_difficulty"
        private const val TIMER_DURATION = 15000L
        private const val TIMER_INTERVAL = 1000L
        private const val FEEDBACK_DELAY = 1200L
    }

    private lateinit var binding: ActivityGameBinding
    private lateinit var difficulty: Difficulty
    private lateinit var questions: List<Question>
    private lateinit var soundHelper: SoundHelper

    private var currentQuestionIndex = 0
    private var score = 0
    private var timer: CountDownTimer? = null
    private var interstitialAd: InterstitialAd? = null
    private var isAnswered = false

    private val questionEmojis = listOf("🤔", "🧐", "💭", "📝", "🎯", "🔢", "✨", "🌟", "💡", "🎮")
    private val correctEmojis = listOf("🎉", "👏", "🌟", "💪", "👍", "🏆", "✅", "🎊")
    private val wrongEmojis = listOf("😅", "🤗", "💪", "📚")

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityGameBinding.inflate(layoutInflater)
        setContentView(binding.root)

        soundHelper = SoundHelper(this)

        val difficultyName = intent.getStringExtra(EXTRA_DIFFICULTY) ?: Difficulty.EASY.name
        difficulty = Difficulty.valueOf(difficultyName)

        questions = QuestionGenerator.generateQuestions(difficulty)

        setupOptionClickListeners()
        loadBannerAd()
        loadInterstitialAd()
        showQuestion()
    }

    private fun setupOptionClickListeners() {
        val optionButtons = listOf(
            binding.btnOption1,
            binding.btnOption2,
            binding.btnOption3,
            binding.btnOption4
        )

        optionButtons.forEach { button ->
            button.setOnClickListener {
                if (!isAnswered) {
                    checkAnswer(button)
                }
            }
        }
    }

    private fun showQuestion() {
        if (currentQuestionIndex >= questions.size) {
            finishGame()
            return
        }

        isAnswered = false
        val question = questions[currentQuestionIndex]

        binding.tvQuestionNum.text = getString(
            R.string.question_number,
            currentQuestionIndex + 1,
            questions.size
        )
        binding.tvScore.text = getString(R.string.score_label, score)

        binding.progressBar.max = questions.size
        binding.progressBar.progress = currentQuestionIndex

        binding.tvQuestionEmoji.text = questionEmojis[currentQuestionIndex % questionEmojis.size]
        binding.tvQuestion.text = "${question.num1} ${question.operator.symbol} ${question.num2} = ?"

        val optionButtons = listOf(
            binding.btnOption1,
            binding.btnOption2,
            binding.btnOption3,
            binding.btnOption4
        )

        question.options.forEachIndexed { index, option ->
            optionButtons[index].apply {
                text = option.toString()
                setBackgroundResource(R.drawable.bg_option_button)
                isEnabled = true
            }
        }

        binding.tvFeedback.visibility = View.INVISIBLE

        val bounceAnim = AnimationUtils.loadAnimation(this, R.anim.bounce)
        binding.cardQuestion.startAnimation(bounceAnim)

        startTimer()
    }

    private fun startTimer() {
        timer?.cancel()
        timer = object : CountDownTimer(TIMER_DURATION, TIMER_INTERVAL) {
            override fun onTick(millisUntilFinished: Long) {
                val seconds = (millisUntilFinished / 1000).toInt()
                binding.tvTimer.text = getString(R.string.time_label, seconds)

                if (seconds <= 5) {
                    binding.tvTimer.setTextColor(getColor(R.color.wrong_red))
                } else {
                    binding.tvTimer.setTextColor(getColor(R.color.white))
                }
            }

            override fun onFinish() {
                if (!isAnswered) {
                    timeUp()
                }
            }
        }.start()
    }

    private fun timeUp() {
        isAnswered = true
        val question = questions[currentQuestionIndex]

        showCorrectAnswer(question)
        binding.tvFeedback.text = getString(R.string.wrong_answer, question.correctAnswer)
        binding.tvFeedback.visibility = View.VISIBLE

        binding.root.postDelayed({
            currentQuestionIndex++
            showQuestion()
        }, FEEDBACK_DELAY)
    }

    private fun checkAnswer(selectedButton: Button) {
        isAnswered = true
        timer?.cancel()

        val question = questions[currentQuestionIndex]
        val selectedAnswer = selectedButton.text.toString().toInt()
        val isCorrect = selectedAnswer == question.correctAnswer

        if (isCorrect) {
            score++
            selectedButton.setBackgroundResource(R.drawable.bg_option_correct)
            binding.tvFeedback.text = "${correctEmojis.random()} ${getString(R.string.correct_answer)}"
            soundHelper.playCorrect()
        } else {
            selectedButton.setBackgroundResource(R.drawable.bg_option_wrong)
            showCorrectAnswer(question)
            binding.tvFeedback.text = "${wrongEmojis.random()} ${getString(R.string.wrong_answer, question.correctAnswer)}"
            soundHelper.playWrong()
        }

        binding.tvFeedback.visibility = View.VISIBLE
        binding.tvScore.text = getString(R.string.score_label, score)

        disableAllOptions()

        binding.root.postDelayed({
            currentQuestionIndex++
            showQuestion()
        }, FEEDBACK_DELAY)
    }

    private fun showCorrectAnswer(question: Question) {
        val optionButtons = listOf(
            binding.btnOption1,
            binding.btnOption2,
            binding.btnOption3,
            binding.btnOption4
        )

        optionButtons.forEach { button ->
            if (button.text.toString().toInt() == question.correctAnswer) {
                button.setBackgroundResource(R.drawable.bg_option_correct)
            }
        }
    }

    private fun disableAllOptions() {
        binding.btnOption1.isEnabled = false
        binding.btnOption2.isEnabled = false
        binding.btnOption3.isEnabled = false
        binding.btnOption4.isEnabled = false
    }

    private fun finishGame() {
        timer?.cancel()

        showInterstitialAd {
            val intent = Intent(this, ResultActivity::class.java).apply {
                putExtra(ResultActivity.EXTRA_SCORE, score)
                putExtra(ResultActivity.EXTRA_TOTAL, questions.size)
                putExtra(ResultActivity.EXTRA_DIFFICULTY, difficulty.name)
            }
            startActivity(intent)
            finish()
            overridePendingTransition(R.anim.fade_in, R.anim.fade_out)
        }
    }

    private fun loadBannerAd() {
        val adRequest = AdRequest.Builder().build()
        binding.adViewGame.loadAd(adRequest)
    }

    private fun loadInterstitialAd() {
        val adRequest = AdRequest.Builder().build()
        InterstitialAd.load(
            this,
            getString(R.string.admob_interstitial_id),
            adRequest,
            object : InterstitialAdLoadCallback() {
                override fun onAdLoaded(ad: InterstitialAd) {
                    interstitialAd = ad
                }

                override fun onAdFailedToLoad(error: LoadAdError) {
                    interstitialAd = null
                }
            }
        )
    }

    private fun showInterstitialAd(onComplete: () -> Unit) {
        val ad = interstitialAd
        if (ad != null) {
            ad.fullScreenContentCallback = object : FullScreenContentCallback() {
                override fun onAdDismissedFullScreenContent() {
                    interstitialAd = null
                    onComplete()
                }

                override fun onAdFailedToShowFullScreenContent(error: com.google.android.gms.ads.AdError) {
                    interstitialAd = null
                    onComplete()
                }
            }
            ad.show(this)
        } else {
            onComplete()
        }
    }

    override fun onResume() {
        super.onResume()
        binding.adViewGame.resume()
    }

    override fun onPause() {
        binding.adViewGame.pause()
        super.onPause()
    }

    override fun onDestroy() {
        timer?.cancel()
        soundHelper.release()
        binding.adViewGame.destroy()
        super.onDestroy()
    }
}
