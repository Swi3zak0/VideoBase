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
