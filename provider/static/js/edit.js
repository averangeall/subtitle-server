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
    swfobject.embedSWF('http://www.youtube.com/v/' + videoCode + '?enablejsapi=1&playerapiid=video&version=3',
                       'video', "700", "500", "8", null, null, 
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

(function() {
    showVideo();
    loadSubts();
})();

