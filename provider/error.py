# -*- coding: utf8 -*-

_login_errors = [
    ('username-blank', '帳號不可以空白喔'),
]

def login_code(name):
    for i, error in enumerate(_login_errors):
        if error[0] == name:
            return i
    return -1

def login_msg(code):
    if code >= 0 and code < len(_login_errors):
        return _login_errors[code][1]
    return ''

