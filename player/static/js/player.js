function genPlayerId(videoId) {
    return 'fkd-youtube-' + videoId;
}

function fillDisplay(display, content) {
    var lines = content.split('\n');
    $.each(lines, function(level, line) {
        var subt = $('<div/>').addClass('fkd-display-line')
                              .html(line)
                              .hide();
        display.append(subt);
        subt.show();
    });
}

function putVideoTitle(video, videoId, title) {
    var header = $('<h1/>').attr('id', 'fkd-title-' + videoId)
                           .html(title);
    video.append(header);
}

function putVideoBody(video, videoId, videoCode) {
    var playerId = genPlayerId(videoId);
    var youtube = $('<div/>').attr('id', playerId);
    video.append(youtube);
    swfobject.embedSWF("https://www.youtube.com/v/" + videoCode + '?enablejsapi=1&playerapiid=' + playerId + '&version=3',
                       playerId, '640', '480', '8', null, null,
                       {allowScriptAccess: 'always'},
                       {id: playerId});
}

function putVideoSubtitle(video, videoId, subtitles) {
    var display = $('<div/>').attr('id', 'fkd-display-' + videoId)
                             .addClass('fkd-display');
    video.append(display);
    setInterval(function() {
        display.empty();
        var youtube = document.getElementById(genPlayerId(videoId));
        if(youtube == null || !('getCurrentTime' in youtube))
            return;
        var curTime = youtube.getCurrentTime();
        $.each(subtitles, function(i, subtitle) {
            if(curTime >= subtitle.start_time &&
               curTime <= subtitle.end_time) {
                fillDisplay(display, subtitle.content);
            }
        });
    }, 10);
}

function onYouTubePlayerReady(playerId) {
    var youtube = document.getElementById(playerId);
    youtube.playVideo();
    $('.fkd-subtitle').css('background', '#1B1B1B');
}

function preparePlayer() {
    $('.fkd-subtitle').each(function() {
        var video = $(this);
        var videoId = video.attr('data-video-id');
        var rootUrl = video.attr('data-root-url');
        $.get('http://' + rootUrl + '/retrieve?callback=?', {video_id: videoId}, function(res) {
            if(res.status != 'OKAY')
                return;
            if(video.attr('data-show-title') == 'true')
                putVideoTitle(video, videoId, res.response.title);
            putVideoBody(video, videoId, res.response.code);
            putVideoSubtitle(video, videoId, res.response.subtitles);
        }, 'json');
    });
}

