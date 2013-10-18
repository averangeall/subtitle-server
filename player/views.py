from django.shortcuts import render_to_response

def demo(request):
    video_id = request.GET.get('video_id', 'JZJNea-l1_8')
    return render_to_response('demo.html', {'video_id': video_id})
    
