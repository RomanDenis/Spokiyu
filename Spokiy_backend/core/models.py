from django.db import models
from django.contrib.auth.models import User
from textblob import TextBlob
from django.utils import timezone  # <--- Важный импорт

# --- Таблиця Рекомендацій ---
class Recommendation(models.Model):
    text = models.TextField(verbose_name="Текст поради")
    sentiment_threshold = models.FloatField(default=0.0, verbose_name="Поріг (від -1.0)")

    def __str__(self):
        return self.text[:50]

# --- Таблиця Записів Настрою ---
class MoodRecord(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    
    # БУЛО: auto_now_add=True (Забороняло змінювати дату)
    # СТАЛО: default=timezone.now (Дозволяє змінювати дату)
    date = models.DateTimeField(default=timezone.now) 
    
    text = models.TextField(verbose_name="Опис емоцій")
    sentiment_score = models.FloatField(default=0.0, verbose_name="Тональність")
    mood_level = models.IntegerField(default=5, verbose_name="Рівень настрою")

    def save(self, *args, **kwargs):
        blob = TextBlob(self.text)
        self.sentiment_score = blob.sentiment.polarity
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.date.strftime('%Y-%m-%d %H:%M')} (Score: {self.sentiment_score})"