import json
from django.http import HttpResponse
import helper

def retrieve(request):
    video_id = request.GET.get('video_id', None)
    video = helper.get_video(video_id)
    if not video:
        return HttpResponse(json.dumps({'status': 'FAIL'}))
    subtitles = helper.get_subtitles(video)
    response = {
        'title': video.title,
        'subtitles': subtitles,
    }
    return HttpResponse(json.dumps({'status': 'OKAY', 'response': response}))
