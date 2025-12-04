from rest_framework import serializers
from .models import MoodRecord
from django.contrib.auth.models import User

class MoodRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = MoodRecord
        fields = ['id', 'text', 'mood_level', 'sentiment_score', 'date']
        # ВАЖЛИВО: 'date' більше не в read_only_fields!
        read_only_fields = ['sentiment_score'] 

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user