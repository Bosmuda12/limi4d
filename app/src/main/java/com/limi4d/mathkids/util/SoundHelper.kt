package com.limi4d.mathkids.util

import android.content.Context
import android.media.AudioAttributes
import android.media.SoundPool
import android.os.Build

class SoundHelper(context: Context) {

    private val soundPool: SoundPool
    private var correctSoundId: Int = 0
    private var wrongSoundId: Int = 0
    private var isLoaded = false

    init {
        val audioAttributes = AudioAttributes.Builder()
            .setUsage(AudioAttributes.USAGE_GAME)
            .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
            .build()

        soundPool = SoundPool.Builder()
            .setMaxStreams(3)
            .setAudioAttributes(audioAttributes)
            .build()

        soundPool.setOnLoadCompleteListener { _, _, _ ->
            isLoaded = true
        }
    }

    fun playCorrect() {
        if (isLoaded && correctSoundId != 0) {
            soundPool.play(correctSoundId, 0.7f, 0.7f, 1, 0, 1.0f)
        }
    }

    fun playWrong() {
        if (isLoaded && wrongSoundId != 0) {
            soundPool.play(wrongSoundId, 0.5f, 0.5f, 1, 0, 1.0f)
        }
    }

    fun release() {
        soundPool.release()
    }
}
