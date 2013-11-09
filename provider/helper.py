import re
import datetime
import pysrt
import models
import urllib2
import BeautifulSoup

def get_video(video_id):
    video = models.Video.objects.get(id=video_id)
    return video

def get_subtitles(video):
    subtitles = models.Subtitle.objects.filter(video=video)
    return [subtitle.to_dict() for subtitle in subtitles]

def put_subtitles(video, subt_str):
    lines = pysrt.from_string(subt_str)
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

def parse_video_url(video_url):
    mo = re.match(r'https?:\/\/www\.youtube\.com\/watch\?.*?v=([^&]+).*?', video_url)
    if not mo:
        mo = re.match(r'https?:\/\/youtu\.be\/(.+)', video_url)
    if mo:
        return mo.group(1)
    return None

def create_video(video_code, video_title, user):
    video = models.Video.objects.create(owner=user, code=video_code, title=video_title)
    video.save()
    return video

def retrieve_video_title(video_code):
    page = urllib2.urlopen('http://www.youtube.com/watch?v=%s' % video_code)
    soup = BeautifulSoup.BeautifulSoup(page)
    title = soup.title.string
    mo = re.match('(.+?) - YouTube', title)
    if mo:
        return mo.group(1)
    return 'Untitled Video'

def is_new_user(user):
    videos = models.Video.objects.filter(owner=user)
    return videos.count() == 0

def get_video_list(user):
    videos = models.Video.objects.filter(owner=user)
    return [{'id': video.id, 'title': video.title} for video in videos]

