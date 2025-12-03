from rest_framework import serializers
from .models import MoodRecord
from django.contrib.auth.models import User

class MoodRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = MoodRecord
        # Поля, які ми віддаємо на Фронтенд і приймаємо від нього
        fields = ['id', 'text', 'mood_level', 'sentiment_score', 'date']
        # Ці поля сервер рахує сам, користувач їх не вводить
        read_only_fields = ['sentiment_score', 'date']
        
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user