from django.db import models
from django.contrib.auth.models import User

class Video(models.Model):
    owner = models.ForeignKey(User)
    video_id = models.TextField()
    title = models.TextField()

class Subtitle(models.Model):
    video = models.ForeignKey(Video)
    start_time = models.TimeField()
    end_time = models.TimeField()
    content = models.TextField()

    def _to_second(self, time):
        return time.microsecond / 1000000.0 + \
               time.second + \
               time.minute * 60 + \
               time.hour * 60 * 60

    def to_dict(self):
        res = {}
        res['start_time'] = self._to_second(self.start_time)
        res['end_time'] = self._to_second(self.end_time)
        res['content'] = self.content
        return res

