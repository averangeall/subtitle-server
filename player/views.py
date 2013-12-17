from django.shortcuts import render_to_response
from django.contrib.sites.models import get_current_site

def demo(request):
    video_id = request.GET.get('video_id', '1')
    dictt = {
        'video_id': video_id,
        'site_domain': get_current_site(request).domain,
    }
    return render_to_response('demo.html', dictt)
    
