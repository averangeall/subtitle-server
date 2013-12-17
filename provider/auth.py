import phpass
from django.contrib.auth.models import User
import models

class WordPressBackend(object):
    def authenticate(self, username=None, password=None):
        use_auth = True

        if use_auth:
            try:
                person = models.WordPressUser.objects.using('auth').get(user_login=username)
            except models.WordPressUser.DoesNotExist:
                return None

            hasher = phpass.PasswordHash(8, True)
            if not hasher.check_password(password, person.user_pass):
                return None

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            user = User(username=username, password='no-use')
            user.email = person.user_email
            user.save()

        return user

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
