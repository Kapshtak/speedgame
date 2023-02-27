from django.db import models

class Score(models.Model):
    DIFF_CHOICES = (
    ('easy', 'E'),
    ('medium', 'M'),
    ('hard', 'H'),
)
    name = models.TextField(null=False)
    score = models.IntegerField(null=False)
    date = models.DateTimeField(auto_now=True)
    difficulty = models.CharField(max_length=6,
                  choices=DIFF_CHOICES,
                  default='easy')

    class Meta:
        ordering = ('-score', '-date')

