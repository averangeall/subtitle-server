(function() {
    var fieldUsername = document.getElementById('username');
    var fieldPassword = document.getElementById('password');
    if(fieldUsername.value == '') {
        fieldUsername.focus();
    } else {
        fieldPassword.focus();
    }
})();
