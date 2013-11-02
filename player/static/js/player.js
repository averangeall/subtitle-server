function genPlayerId(videoId) {
    return 'fkd-youtube-' + videoId;
}

function fillDisplay(display, content) {
    for(var i = -1; i <= 1; ++ i)
        for(var j = -1; j <= 1; ++ j) {
            var line = $('<div/>').addClass('fkd-display-line')
                                  .html(content)
                                  .hide();
            if(i == 0 && j == 0)
                line.addClass('fkd-display-front');
            else
                line.addClass('fkd-display-back');
            display.append(line);
            line.css('margin-left', -line.width() / 2.0 + j)
                .css('margin-top', i)
                .show();
        }
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
    console.log(playerId);
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
}

function preparePlayer() {
    $('.fkd-subtitle').each(function() {
        var video = $(this);
        var videoId = video.attr('data-video-id');
        $.get('/retrieve', {video_id: videoId}, function(res) {
            if(res.status != 'OKAY')
                return;
            if(video.attr('data-show-title') == 'true')
                putVideoTitle(video, videoId, res.response.title);
            putVideoBody(video, videoId, res.response.code);
            putVideoSubtitle(video, videoId, res.response.subtitles);
        }, 'json');
    });
}

