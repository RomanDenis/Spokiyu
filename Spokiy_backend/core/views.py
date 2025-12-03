from rest_framework import viewsets, generics, permissions
from .models import MoodRecord, Recommendation
from .serializers import MoodRecordSerializer, UserSerializer
from django.contrib.auth.models import User

# 1. Реєстрація нового користувача
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,) # Дозволяємо всім (навіть анонімам) реєструватися
    serializer_class = UserSerializer

# 2. Робота з записами (Тільки для своїх)
class MoodRecordViewSet(viewsets.ModelViewSet):
    serializer_class = MoodRecordSerializer
    permission_classes = [permissions.IsAuthenticated] # <--- ЗАХИСТ: Тільки для тих, хто увійшов

    # Показуємо тільки записи поточного користувача
    def get_queryset(self):
        return MoodRecord.objects.filter(user=self.request.user).order_by('-date')

    # При створенні запису автоматично прив'язуємо його до користувача
    def perform_create(self, serializer):
        serializer.save(user=self.request.user) # <--- Самі підставляємо user_id

    # (Тут твоя стара логіка з рекомендаціями)
    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        sentiment = response.data.get('sentiment_score', 0)
        rec = Recommendation.objects.filter(sentiment_threshold__gte=sentiment).order_by('sentiment_threshold').first()
        if rec:
            response.data['recommendation'] = rec.text
        else:
            response.data['recommendation'] = "Раді, що у вас гарний настрій!"
        return response