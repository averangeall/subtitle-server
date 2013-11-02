# -*- coding: utf8 -*-

_login_errors = [
    ('username-blank', '帳號不可以空白喔'),
    ('password-blank', '密碼不可以空白喔'),
    ('invalid', '帳號密碼錯誤'),
]

_create_errors = [
    ('url-problem', '請輸入完整的 Youtube 連結'),
]

def _get_code(name, errors):
    for i, error in enumerate(errors):
        if error[0] == name:
            return i
    return -1

def _get_msg(code, errors):
    if code >= 0 and code < len(errors):
        return errors[code][1]
    return ''

login_code = lambda name: _get_code(name, _login_errors)
login_msg = lambda code: _get_msg(code, _login_errors)

create_code = lambda name: _get_code(name, _create_errors)
create_msg = lambda code: _get_msg(code, _create_errors)

