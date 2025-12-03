from django.db import models
from django.db import models
from django.contrib.auth.models import User
from textblob import TextBlob  # Бібліотека для аналізу тексту

class MoodRecord(models.Model):
    # Якщо user=None, значить запис анонімний (для тесту)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)
    text = models.TextField(verbose_name="Опис емоцій")
    
    # Результат аналізу (від -1.0 до 1.0)
    sentiment_score = models.FloatField(default=0.0, verbose_name="Тональність")
    
    # Користувач сам ставить оцінку від 1 до 10
    mood_level = models.IntegerField(default=5, verbose_name="Рівень настрою")

    def save(self, *args, **kwargs):
        # --- МАГІЯ ТУТ: Автоматичний аналіз тексту ---
        blob = TextBlob(self.text)
        # TextBlob повертає полярність: -1 (негатив), 0 (нейтрально), +1 (позитив)
        self.sentiment_score = blob.sentiment.polarity
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Запис від {self.date.strftime('%Y-%m-%d %H:%M')}"
# Create your models here.
