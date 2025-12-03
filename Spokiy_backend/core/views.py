from rest_framework import viewsets
from .models import MoodRecord
from .serializers import MoodRecordSerializer

class MoodRecordViewSet(viewsets.ModelViewSet):
    # Цей код автоматично створює всі функції:
    # Отримати список, Додати, Видалити, Редагувати
    queryset = MoodRecord.objects.all().order_by('-date')
    serializer_class = MoodRecordSerializer