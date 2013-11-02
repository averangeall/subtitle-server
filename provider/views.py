import json
from django.core.context_processors import csrf
from django.http import HttpResponse
from django.shortcuts import render_to_response, redirect
from django.contrib import auth
import helper
import error

def portal(request):
    dictt = {}
    dictt.update(csrf(request))
    if 'login-error' in request.session:
        if 'tmp-username' in request.session:
            dictt['tmp_username'] = request.session['tmp-username']
            del request.session['tmp-username']
        dictt['err_msg'] = error.login_msg(request.session['login-error'])
        del request.session['login-error']
        return render_to_response('index.html', dictt)
    elif request.user.is_authenticated():
        return render_to_response('first.html', dictt)
    else:
        return render_to_response('index.html', dictt)

def login(request):
    username = request.POST.get('username').strip()
    password = request.POST.get('password')
    if username == '':
        request.session['login-error'] = error.login_code('username-blank')
    elif password == '':
        request.session['tmp-username'] = username
        request.session['login-error'] = error.login_code('password-blank')
    else:
        user = auth.authenticate(username=username, password=password)
        if user is None:
            request.session['tmp-username'] = username
            request.session['login-error'] = error.login_code('invalid')
        else:
            auth.login(request, user)
    return redirect('/')

def edit(request):
    video_url = request.POST.get('video-url')
    video_id = helper.parse_video_url(video_url)

def retrieve(request):
    video_id = request.GET.get('video_id', None)
    video = helper.get_video(video_id)
    if not video:
        return HttpResponse(json.dumps({'status': 'FAIL'}))
    subtitles = helper.get_subtitles(video)
    response = {
        'code': video.code,
        'title': video.title,
        'subtitles': subtitles,
    }
    return HttpResponse(json.dumps({'status': 'OKAY', 'response': response}))
