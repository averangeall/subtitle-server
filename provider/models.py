from django.db import models

class Video(models.Model):
    video_id = models.TextField()
    title = models.TextField()

class Subtitle(models.Model):
    video = models.ForeignKey(Video)
    start_time = models.TimeField()
    end_time = models.TimeField()
    content = models.TextField()

