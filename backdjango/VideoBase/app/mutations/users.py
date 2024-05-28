import hashlib
from django.forms import ValidationError
import graphene
import jwt
from graphql_jwt.shortcuts import get_token, create_refresh_token
from graphene_django import DjangoObjectType
from ..models import CustomUser
from datetime import datetime, timedelta
from django.contrib.auth import authenticate
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from ..views import send_activation_email
from django.contrib.auth.decorators import login_required
from graphql import GraphQLError
import random
import string
from django.utils.crypto import constant_time_compare
from ..types.type import UsersType
from ..jwt_auth import jwt_get_user


class RegisterUser(graphene.Mutation):
    user = graphene.Field(UsersType)

    class Arguments:
        username = graphene.String()
        password = graphene.String()
        email = graphene.String()

    def mutate(self, info, username, password, email):
        user = CustomUser(
            username=username,
            password=password,
            email=email,
            createdate=datetime.now(),
            premium=0,
            premiumexpirationdate=datetime.now(),
            frame=1)

        if CustomUser.objects.filter(
                username=username).exists() or CustomUser.objects.filter(
                email=email).exists():
            raise ValidationError(
                "Użytkownik o podanej nazwie użytkownika lub adresie e-mail już istnieje")
        else:
            user.set_password(password)
            user.save()

        token_payload = {
            'email': email,
            'exp': datetime.now() + timedelta(hours=24)
        }
        token = jwt.encode(token_payload, 'verification_token',
                           algorithm='HS256')

        verification_link = f"http://localhost:8000/activate/{token}"
        send_activation_email(user.email, verification_link)

        return RegisterUser(user=user)


class LoginUser(graphene.Mutation):
    user = graphene.Field(UsersType)
    success = graphene.Boolean()

    class Arguments:
        username = graphene.String()
        password = graphene.String()

    def mutate(self, info, username, password):
        context = info.context
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_verified:
                context.jwt_cookie = True
                context.jwt_refresh_token = create_refresh_token(user)
                context.jwt_token = get_token(user)
                context.user = user
                return LoginUser(user=user, success=True)
            else:
                return LoginUser(success=False)
        else:
            return ValidationError("Nie ma takiego użytkownika")


class RequestPasswordReset(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        email = graphene.String(required=True)

    @staticmethod
    def mutate(root, info, email):
        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return RequestPasswordReset(success=False)

        reset_code = ''.join(random.choices(
            string.ascii_letters + string.digits, k=10))

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        hashed_reset_code = hashlib.sha256(reset_code.encode()).hexdigest()

        user.reset_code = hashed_reset_code
        user.save()
        reset_link = f"http://localhost:3000/newPassword/{uid}/{reset_code}/"

        send_mail(
            'Resetowanie hasła',
            f'Kliknij ten link, aby zresetować hasło: {reset_link}',
            'videobase78@gmail.com',
            [email],
            fail_silently=False,
        )

        return RequestPasswordReset(success=True)


class ResetPassword(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        uid = graphene.String(required=True)
        reset_code = graphene.String(required=True)
        new_password = graphene.String(required=True)
        new_password2 = graphene.String(required=True)

    @staticmethod
    def mutate(root, info, uid, reset_code, new_password, new_password2):
        try:
            uid = urlsafe_base64_decode(uid)
            user = CustomUser.objects.get(pk=uid)

            if user is not None:
                hashed_reset_code = hashlib.sha256(
                    reset_code.encode()).hexdigest()

                if not constant_time_compare(user.reset_code, hashed_reset_code):
                    raise ValidationError(
                        'Nieprawidłowy kod resetowania hasła.')

                if new_password != new_password2:
                    raise ValidationError('Hasła się różnią!')

                user.set_password(new_password)
                user.reset_code = None
                user.save()

                return ResetPassword(success=True)
            else:
                raise ValidationError(
                    'Nieprawidłowy identyfikator użytkownika lub kod resetowania hasła.')

        except (TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
            raise ValidationError(
                'Nieprawidłowy identyfikator użytkownika lub kod resetowania hasła.')


class ChangePasswordMutation(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        old_password = graphene.String(required=True)
        new_password = graphene.String(required=True)
        new_password_repeat = graphene.String(required=True)

    def mutate(self, info, old_password, new_password, new_password_repeat):
        jwt_token = info.context.COOKIES.get('JWT')
        jwt_refresh_token = info.context.COOKIES.get('JWT-refresh-token')

        if not jwt_refresh_token:
            raise GraphQLError('Użytkownik niezalogowany.')

        try:
            payload = jwt.decode(
                jwt_token,
                'verification_token',
                algorithms=['HS256'])
            username = payload['username']

            user = CustomUser.objects.get(username=username)

            if not user.check_password(old_password):
                raise GraphQLError('Stare hasło jest niepoprawne.')

            if new_password != new_password_repeat:
                raise GraphQLError('Nowe hasła nie zgadzają się.')

            user.set_password(new_password)
            user.save()

            return ChangePasswordMutation(success=True)

        except jwt.ExpiredSignatureError:
            raise GraphQLError('Token wygasł.')
        except jwt.InvalidTokenError:
            raise GraphQLError('Nieprawidłowy token.')
        except CustomUser.DoesNotExist:
            raise GraphQLError('Nie znaleziono użytkownika.')


class DeleteUserAccountMutation(graphene.Mutation):
    success = graphene.Boolean()

    def mutate(self, info):
        user = jwt_get_user(info)
        if user:
            user.delete()
            return DeleteUserAccountMutation(success=True)
        return DeleteUserAccountMutation(successs = False)