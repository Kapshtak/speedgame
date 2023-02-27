from rest_framework import serializers
from .models import Score


class ScoreSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ('name', 'score', 'difficulty')
        difficulty = serializers.StringRelatedField(default='easy')
        model = Score