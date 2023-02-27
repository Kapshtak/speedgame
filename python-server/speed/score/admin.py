from django.contrib import admin

from .models import Score


class ScoreAdmin(admin.ModelAdmin):
    list_display = ("pk", "name", "score", "date", "difficulty")

admin.site.register(Score, ScoreAdmin)
