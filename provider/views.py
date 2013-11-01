import json
from django.core.context_processors import csrf
from django.http import HttpResponse
from django.shortcuts import render_to_response, redirect
import helper
import error

def portal(request):
    dictt = {}
    dictt.update(csrf(request))
    if 'login-error' in request.session:
        login_error = request.session['login-error']
        del request.session['login-error']
        dictt['err_msg'] = error.login_msg(login_error)
        return render_to_response('index.html', dictt)
    elif 'username' in request.session:
        return render_to_response('first.html', dictt)
    else:
        return render_to_response('index.html', dictt)

def login(request):
    username = request.POST.get('username').strip()
    password = request.POST.get('password')
    if username == '':
        request.session['login-error'] = error.login_code('username-blank')
    else:
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
