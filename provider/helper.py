import datetime
import models
import pysrt

def get_video(video_id):
    videos = models.Video.objects.filter(video_id=video_id)
    if not videos.count():
        return None
    assert videos.count() == 1
    return videos[0]

def get_subtitles(video):
    subtitles = models.Subtitle.objects.filter(video=video)
    return [subtitle.to_dict() for subtitle in subtitles]

def put_subtitles(video, fname):
    lines = pysrt.open(fname)
    for line in lines:
        start_time = datetime.time(line.start.hours,
                                   line.start.minutes,
                                   line.start.seconds,
                                   line.start.milliseconds * 1000)
        end_time = datetime.time(line.end.hours,
                                 line.end.minutes,
                                 line.end.seconds,
                                 line.end.milliseconds * 1000)
        subtitle = models.Subtitle(video=video,
                                   content=line.text,
                                   start_time=start_time,
                                   end_time=end_time)
        subtitle.save()

