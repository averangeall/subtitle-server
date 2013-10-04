import models


def get_video(video_id):
    videos = models.Video.objects.filter(video_id=video_id)
    if not videos.count():
        return None
    assert videos.count() == 1
    return videos[0]

def get_subtitles(video):
    subtitles = models.Subtitle.objects.filter(video=video)
    return [subtitle.to_dict() for subtitle in subtitles]

