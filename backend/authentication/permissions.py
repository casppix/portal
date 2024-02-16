from rest_framework.permissions import BasePermission
from .models import MyUser
import jwt
from django.conf import settings
from rest_framework.exceptions import AuthenticationFailed


class CustomAuthentication(BasePermission):
    def has_permission(self, request, view):
        authorization_header = request.headers.get('Authorization')
        if not authorization_header:
            return False

        try:
            token = authorization_header.split(' ')[1]
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user_id = payload['user_id']
            user = MyUser.objects.get(id=user_id)
            request.user = user
            return True
        except Exception as e:
            raise AuthenticationFailed('Invalid or expired token')

