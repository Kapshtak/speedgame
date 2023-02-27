from django.db import models

class Score(models.Model):
    name = models.TextField(null=False)
    score = models.IntegerField(null=False)
    date = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('-score', '-date')

