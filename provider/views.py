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
        if 'create-error' in request.session:
            dictt['err_msg'] = error.create_msg(request.session['create-error'])
            del request.session['create-error']
        if helper.is_new_user(request.user):
            return render_to_response('first.html', dictt)
        else:
            dictt['videos'] = helper.get_video_list(request.user)
            return render_to_response('list.html', dictt)
    else:
        return render_to_response('index.html', dictt)

def login(request):
    if request.method != 'POST':
        return redirect('/')
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

def create(request):
    if request.method != 'POST':
        return redirect('/')
    video_url = request.POST.get('video-url')
    video_code = helper.parse_video_url(video_url)
    if video_code:
        video_title = helper.retrieve_video_title(video_code)
        video = helper.create_video(video_code, video_title, request.user)
        return redirect('/edit/' + str(video.id))
    else:
        request.session['create-error'] = error.create_code('url-problem')
        return redirect('/')

def edit(request, video_id):
    dictt = {}
    dictt.update(csrf(request))
    video = helper.get_video(video_id)
    dictt['video'] = {
        'id': video.id,
        'code': video.code,
        'title': video.title,
    }
    return render_to_response('edit.html', dictt)

def upload_subt(request):
    if request.method != 'POST':
        return redirect('/')
    video_id = request.POST.get('video-id', None)
    subt_file = request.FILES['subt-file']
    subt_str = subt_file.read().decode('utf-8')
    video = helper.get_video(video_id)
    helper.put_subtitles(video, subt_str)
    return redirect('/edit/' + video_id)

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

