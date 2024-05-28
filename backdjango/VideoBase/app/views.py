from django.shortcuts import render
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from django.http import HttpResponse
from django.shortcuts import redirect
from django.urls import reverse
from django.http import HttpResponseRedirect
from .models import CustomUser
import jwt
from graphene_django.views import GraphQLView
from graphql import GraphQLError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .forms import VideoUploadForm
from VideoBase.settings import FIREBASE_STORAGE_BUCKET_NAME
from .models import Video
from firebase_admin import storage

# Create your views here.


def send_activation_email(recipient_email, activation_link):
    subject = 'Aktywacja konta'
    context = {'activation_link': activation_link}

    html_content = render_to_string('activation_email.html', context)
    text_content = strip_tags(html_content)

    email = EmailMultiAlternatives(
        subject,
        text_content,
        settings.EMAIL_HOST_USER,
        [recipient_email])
    email.attach_alternative(html_content, "text/html")
    email.send()

    return HttpResponse("Email sent successfully")

def send_contact_email(name, email, message):
    subject = name
    context = {'message': message, 'email': email, 'name': name}

    html_content = render_to_string('contact_email.html', context)
    text_content = strip_tags(html_content)

    email = EmailMultiAlternatives(
        subject,
        text_content,
        settings.EMAIL_HOST_USER,
        ['videobase78@gmail.com'])
    email.attach_alternative(html_content, "text/html")
    email.send()

    return HttpResponse("Email sent successfully")


class CustomGraphQLView(GraphQLView):
    def dispatch(self, request, *args, **kwargs):
        response = super().dispatch(request, *args, **kwargs)
        response["Access-Control-Allow-Origin"] = "http://localhost:3000"
        response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type"
        return response


class VerifyGraphQLView(GraphQLView):
    def dispatch(self, request, *args, **kwargs):
        token = kwargs.get('token')
        if token:
            try:
                decoded_token = jwt.decode(
                    token, 'verification_token', algorithms=['HS256'])
                email = decoded_token['email']
                user = CustomUser.objects.get(email=email)

                if not user.activation_link_used:
                    user.is_verified = True
                    user.activation_link_used = True
                    user.save()
                    success_message = "Twoje konto zostało pomyślnie aktywowane."
                    redirect_url = f'http://localhost:3000/home?success_message={
                        success_message}'
                    return HttpResponseRedirect(redirect_url)
                else:
                    error_message = "Link aktywacyjny został już użyty."
                    redirect_url = f'http://localhost:3000/home?error_message={
                        error_message}'
                    return HttpResponseRedirect(redirect_url)

            except jwt.ExpiredSignatureError:
                raise GraphQLError('Token wygasł.')
            except (jwt.InvalidTokenError, CustomUser.DoesNotExist):
                raise GraphQLError(
                    'Nieprawidłowy token lub użytkownik nie istnieje.')
        return super().dispatch(request, *args, **kwargs)


class VideoUploadAPIView(APIView):
    def post(self, request, *args, **kwargs):
        form = VideoUploadForm(request.POST, request.FILES)
        if form.is_valid():
            video_file = request.FILES['video_file']
            video_name = video_file.name

            try:
                bucket_name = FIREBASE_STORAGE_BUCKET_NAME
                bucket = storage.bucket(bucket_name)
                blob = bucket.blob(f'videos/{video_name}')

                blob.upload_from_file(
                    video_file, content_type='video/mp4', predefined_acl='publicRead')

                video_url = blob.public_url

                video = Video(title=video_name, url=video_url)
                video.save()

                return Response({'url': video_url}, status=status.HTTP_201_CREATED)
            except Exception as e:
                error_message = f"An error occurred while uploading the video: {
                    str(e)}"
                return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)
