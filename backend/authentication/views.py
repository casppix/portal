import datetime
from datetime import timedelta, datetime
import jwt
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.db import transaction
from rest_framework.views import APIView
from .serializers import UserSerializer
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from .models import MyUser
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken, TokenError
from rest_framework import status


class RegisterView(APIView):
    def post(self, request):
        try:
            with transaction.atomic():
                serializer = UserSerializer(data=request.data)
                serializer.is_valid(raise_exception=True)
                user = serializer.save()
                return Response(
                    {
                        "success": True,
                        "message": "Registration Successful",
                        "status": 200,
                    },
                    status=status.HTTP_201_CREATED,
                )

        except ValidationError as e:
            errors = {}
            for field, field_errors in e.error_dict.items():
                if field == "email" and "unique" in field_errors:
                    errors[field] = "Email already exists."
                elif field == "password":
                    errors[field] = "Invalid password."
                else:
                    errors[field] = field_errors[0]

            return Response(
                {"success": False, "errors": errors, "status": 400},
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Exception as e:
            return Response(
                {"success": False, "message": "Internal Server Error", "status": 500},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class LoginView(APIView):
    def post(self, request):
        try:
            email = request.data["email"]
            password = request.data["password"]
            user = MyUser.objects.get(email=email)
        except MyUser.DoesNotExist:
            raise AuthenticationFailed("Account does  not exist")

        if user is None:
            raise AuthenticationFailed("User does not exist")
        if not user.check_password(password):
            raise AuthenticationFailed("Incorrect Password")

        payload = {
            "user_id": user.id,
            "first_name": user.first_name,
            "email": user.email,
            "exp": datetime.utcnow() + timedelta(minutes=15)
        }
        access_token = jwt.encode(payload, settings.SECRET_KEY)
        refresh_token = str(RefreshToken.for_user(user))

        return Response({
            "access_token": access_token,
            "refresh_token": refresh_token
        })


class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data['refresh_token']
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response("Logout Successful", status=status.HTTP_200_OK)
        except TokenError:
            raise AuthenticationFailed("Invalid Token")


class EmailCheckView(APIView):
    def post(self, request):
        email = request.data.get("email")
        if email:
            try:
                user = MyUser.objects.get(email=email)
                response = {
                    "user": {
                        "id": user.id,
                        "email": user.email,
                        "first_name": user.first_name,
                    },
                    "status": True,
                }
                return Response(response)
            except MyUser.DoesNotExist:
                response = {"status": False}
                return Response(response)
        else:
            response = {"status": False}
            return Response(response)


class EmailAvailability(APIView):
    def post(self, request):
        email = request.data.get("email")
        try:
            user = MyUser.objects.get(email=email)
            return Response(False)
        except ObjectDoesNotExist:
            return Response(True)