from rest_framework import serializers
from .models import Score


class ScoreSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ('name', 'score')
        model = Score