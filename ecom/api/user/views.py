from rest_framework import viewsets
from rest_framework.permission import AllowAny
from .serializers import UserSerializer
from .models import CustomUser
from django.http import JsonResponse
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_exemp
from django.contrib.auth import login, logout

import random
import re

def generate_session_token(length=10):
    return ''.join(random.SystemRandom().choice([chr(i) for i in range(97,123)] + [str(i) for i in range(10)]) for _ in range(length))

@csrf_exemp

def signin(request):
    if not request.method == 'POST':
        return JsonResponse({'error': ' Send a post request with valid parameter only'})

    username = request.POST['email']
    password = request.POST['password']

#validation part
    if not re.match("([\w\.\-_]+)?\w+@[\w-_]+(\.\w+){1,}", username):
        return JsonResponse({'error': 'Enter a valid email'})

    if len(password) < 8:
        return JsonResponse('error': 'Password needs to be at least of 8 chars')

    UserModel = get_user_model()

    try:
        user = UserModel.objects.get(email=username)

        if user.check_password(password):
            usr_dict = UserModel.objects.filter(email = username).values().first()
            usr_dict.pop('password')

            if user.session_token != "0":
                user.session_token = "0"
                user.save()
                return JsonResponse({'error':'Previous session exists!'})

            token = generate_session_token()
            user.session_token = token
            user.save()
            login(request, user)
            return JsonResponse({'token': token, 'user': usr_dict})
        else:
            return JsonResponse({error : 'Invalid Email'})

    except UserModel/DoeNotExist:
        return JsonResponse({'error': 'Invalid Email'})

    def signout(request, id):
        logout(request)

        UserModel = get_user_model()

        try:
            user = UserModel.objects.get(pk=id)
            user.session_token = "0"
            user.save()
        except UserModel.DoeNotExist:
            return JsonResponse({'error': 'invalid user id'})

        return JsonResponse({'success':'Logout success'})

    class UserViewSet(viewsets.ModelViewSet):
        permission_classes_by_action = {'create': [AllowAny]}

        queryset = CustomUser.objects.all().order_by('id')
        serializer_class = UserSerializer

        def get_permissions(self):
            try:
                return [permission() fro permission in self.permission_classes_by_action[self.action]]
            except KeyError:
                return [permission() fro permission in self.permission_classes]
