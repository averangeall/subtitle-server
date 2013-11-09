function putOneSubt(subt) {
    var startTime = $('<div/>').addClass('line-start-time')
                               .html(sec2human(subt.start_time));
    var endTime = $('<div/>').addClass('line-end-time')
                             .html(sec2human(subt.end_time));
    var text = $('<big/>').addClass('line-text todo-name')
                          .html(subt.content);
    var toTime = $('<div/>').addClass('line-to-time')
                            .html('|');
    var one = $('<li/>').addClass('single-line')
                        .append(startTime)
                        .append(toTime)
                        .append(endTime)
                        .append(text);
    $('#all-lines').prepend(one);
}

function putAllSubts(subts) {
    $.each(subts, function(i, subt) {
        putOneSubt(subt);
    });
}

function sec2human(seconds) {
    var date = new Date(seconds * 1000.0);
    var mm = date.getMinutes();
    var ss = date.getSeconds();
    var ii = date.getMilliseconds();
    mm = ((mm < 10) ? '0' : '') + mm;
    ss = ((ss < 10) ? '0' : '') + ss;
    ii = ((ii < 10) ? '00' : ((ii < 100) ? '0' : '')) + ii;
    return (mm + ':' + ss + '.' + ii);
}

function putAddNewLine() {
    var plus = $('<big/>').addClass('todo-name')
                          .addClass('fui-plus');
    var words = $('<big/>').addClass('todo-name')
                           .html('新增一句');
    var add = $('<li/>').addClass('todo-done')
                        .append(plus)
                        .append(' ')
                        .append(words);
    $('#add-line').append(add);
}

function putImportLines() {
    var words = $('<div/>').html('已經有字幕檔了嗎？');
    var button = $('<a/>').addClass('btn btn-primary')
                          .html('匯入字幕檔');
    var importt = $('#import-promt');
    button.click(function() {
        $('#err-msg').fadeOut();
        importt.fadeOut(function() {
            var upload = $('#upload-lines');
            var file = $('<input/>').attr('type', 'file')
                                    .attr('name', 'subt-file');
            var submit = $('<input/>').attr('type', 'submit')
                                      .val('上傳')
                                      .addClass('btn btn-primary');
            upload.append(file)
                  .append(submit)
                  .fadeIn();
        });
    });
    importt.append(words)
           .append(button);
    $('#import-lines').show();
}

function showVideo() {
    var videoCode = $('#video-info').attr('data-code');

    var width1 = $(window).width() - 600;
    var height1 = width1 * 3.0 / 4.0;

    var height2 = $(window).height() - 358;
    var width2 = height2 * 4.0 / 3.0;

    var width, height;
    if(height1 <= height2) {
        width = width1;
        height = height1;
    } else if(width2 <= width1) {
        width = width2;
        height = height2;
    }

    swfobject.embedSWF('http://www.youtube.com/v/' + videoCode + '?enablejsapi=1&playerapiid=video&version=3',
                       'video', String(width), String(height), '8', null, null, 
                       {allowScriptAccess: "always"}, {id: 'video'});
}

function loadSubts() {
    var videoId = $('#video-info').attr('data-id');
    $.get('/retrieve', {video_id: videoId}, function(res) {
        if(res.status != 'OKAY')
            return;
        var subts = res.response.subtitles;
        if(subts.length > 0) {
            putAllSubts(subts);
            putAddNewLine();
        } else {
            putAddNewLine();
            putImportLines();
        }
    }, 'json');
}

function showTitle() {
    var title = $('#video-title');
    var maxWidth = $(window).width() - 700;
    var fontSize = 40;
    title.css('font-size', fontSize + 'px');
    while(title.width() > maxWidth) {
        fontSize -= 1;
        title.css('font-size', fontSize + 'px');
    }
    console.log(title.width() + ', ' + maxWidth);
    title.removeClass('not-yet-show');
}

(function() {
    showVideo();
    loadSubts();
    showTitle();
})();

