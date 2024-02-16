from django.urls import path
from authentication.views import RegisterView, LoginView, LogoutView, EmailCheckView, EmailAvailability

urlpatterns = [
    path('register', RegisterView.as_view(), name="register"),
    path('login', LoginView.as_view(), name="login"),
    path('logout', LogoutView.as_view(), name="logout"),
    path("email-check", EmailCheckView.as_view(), name="email-check"),
    path("email-availability", EmailAvailability.as_view(), name="email-availability"),
]
