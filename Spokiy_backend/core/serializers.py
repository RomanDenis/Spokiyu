from rest_framework import serializers
from .models import MoodRecord

class MoodRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = MoodRecord
        # Поля, які ми віддаємо на Фронтенд і приймаємо від нього
        fields = ['id', 'text', 'mood_level', 'sentiment_score', 'date']
        # Ці поля сервер рахує сам, користувач їх не вводить
        read_only_fields = ['sentiment_score', 'date']