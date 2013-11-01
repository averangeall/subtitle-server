import json
from django.core.context_processors import csrf
from django.http import HttpResponse
from django.shortcuts import render_to_response, redirect
import helper

def portal(request):
    if 'username' in request.session:
        return render_to_response('first.html')
    else:
        dictt = {}
        dictt.update(csrf(request))
        return render_to_response('index.html', dictt)

def login(request):
    username = request.POST.get('username')
    password = request.POST.get('password')
    request.session['username'] = username
    return redirect('/')

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
