function putOneSubt(subt) {
    var startTime = $('<div/>').addClass('todo-name')
                               .html(subt.start_time);
    var endTime = $('<div/>').addClass('todo-name')
                             .html(subt.end_time);
    var line = $('<big/>').addClass('todo-name')
                          .html(subt.content);
    var one = $('<li/>').append(startTime)
                        .append(endTime)
                        .append(line);
    $('#all-lines').prepend(one);
}

function putAllSubts(subts) {
    $.each(subts, function(i, subt) {
        putOneSubt(subt);
    });
}

function putAddNewLine() {
    var plus = $('<big/>').addClass('todo-name')
                          .addClass('fui-plus');
    var words = $('<big/>').addClass('todo-name')
                           .html('新增一句');
    var add = $('<li/>').append(plus)
                        .append(' ')
                        .append(words);
    $('#add-line').append(add);
}

function putImportLines() {
    var words = $('<div/>').html('已經有字幕檔了嗎？');
    var button = $('<a/>').addClass('btn btn-primary')
                          .html('匯入字幕檔');
    var importt = $('#import-lines');
    importt.click(function() {
        importt.fadeOut(function() {
            var upload = $('#upload-lines');
            var file = $('<input/>').attr('type', 'file')
                                    .attr('name', 'subt-file');
            var submit = $('<input/>').attr('type', 'submit')
                                      .val('上傳')
                                      .addClass('btn btn-primary');
            upload.hide()
                  .append(file)
                  .append(submit)
                  .fadeIn();
        });
    });
    importt.append(words)
           .append(button)
           .show();
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

