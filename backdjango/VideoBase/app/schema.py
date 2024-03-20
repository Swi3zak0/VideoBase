from django.forms import ValidationError
import graphene
import graphql_jwt
import jwt
from graphene_django import DjangoObjectType
from .models import CustomUser
from datetime import datetime, timedelta
from django.contrib.auth import authenticate
from django.core.mail import send_mail




class UsersType(DjangoObjectType):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'password','email', 'createdate', 'premium', 'is_active')

class RegisterUser(graphene.Mutation):
    user = graphene.Field(UsersType)

    class Arguments:
        username = graphene.String()
        password = graphene.String()
        email = graphene.String()

    def mutate(self, info, username, password, email):
        user = CustomUser(username = username, password = password, email = email, createdate = datetime.now(), premium = 0, premiumexpirationdate = datetime.now(), frame = 1)

        if CustomUser.objects.filter(username=username).exists() or CustomUser.objects.filter(email=email).exists():
            raise ValidationError("Użytkownik o podanej nazwie użytkownika lub adresie e-mail już istnieje")
        else:
            user.set_password(password)
            user.save()
        
        token_payload = {
            'email': email,
            'exp': datetime.now() + timedelta(hours=24)
        }
        token = jwt.encode(token_payload, 'verification_token', algorithm='HS256')

        verification_link = f"http://localhost:8000/activate/{token}"
        send_mail(
            'Potwierdzenie rejestracji',
            f'Kliknij ten link, aby potwierdzić rejestrację: {verification_link}',
            'videobase78@gmail.com', 
            [email],
            fail_silently=False,
        )

        return RegisterUser(user = user)
    
class LoginUser(graphene.Mutation):
    user = graphene.Field(UsersType)

    class Arguments:
        username = graphene.String()
        password = graphene.String()

    def mutate(self, info, username, password): 
        user = authenticate(username=username, password=password)
        if user is None:
            raise ValidationError('Błędne dane logowania')
        return LoginUser(user=user)
    
# class SendVerificationEmail(graphene.Mutation):
#     success = graphene.Boolean()

#     class Arguments:
#         email = graphene.String(required=True)

#     def mutate(self, info, email):
#         try:
#             user = CustomUser.objects.get(email=email)
#         except CustomUser.DoesNotExist:
#             raise ValidationError("Użytkownik o podanym adresie e-mail nie istnieje")

#         token_payload = {
#             'email': email,
#             'exp': datetime.now() + timedelta(hours=24)  # Czas ważności tokena (np. 24 godziny)
#         }
#         token = jwt.encode(token_payload, 'verification_token', algorithm='HS256')

#         # Wysyłanie e-maila z linkiem weryfikacyjnym zawierającym token JWT
#         verification_link = f"http://localhost:8000/activate/{token}"  # Ustaw właściwy adres URL
#         send_mail(
#             'Potwierdzenie rejestracji',
#             f'Kliknij ten link, aby potwierdzić rejestrację: {verification_link}',
#             'videobase78@gmail.com',  # Adres e-mail, z którego wysyłasz
#             [email],
#             fail_silently=False,
#         )

#         return SendVerificationEmail(success=True)


class Query(graphene.ObjectType):
    all_users = graphene.List(UsersType)

    def resolve_all_users(root, info):
        return CustomUser.objects.all()

class Mutation(graphene.ObjectType):
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()
    register_user = RegisterUser.Field()
    login_user = LoginUser.Field()
    delete_token_cookie = graphql_jwt.DeleteJSONWebTokenCookie.Field()
    delete_refresh_token_cookie = graphql_jwt.DeleteRefreshTokenCookie.Field()
    # send_verification_email = SendVerificationEmail.Field()

class VerifyUser(graphene.Mutation):
    user = graphene.Field(UsersType)

    class Arguments:
        token = graphene.String(required=True)

    def mutate(self, info, token):
        try:
            decoded_token = jwt.decode(token, 'verification_token', algorithms=['HS256'])
            email = decoded_token['email']
            user = CustomUser.objects.get(email=email)
            user.is_active = True
            user.save()
            return VerifyUser(user=user)
        except jwt.ExpiredSignatureError:
            raise Exception('Token wygasł.')
        except jwt.InvalidTokenError:
            raise Exception('Nieprawidłowy token.')

schema = graphene.Schema(query = Query, mutation = Mutation)

class Verify(graphene.ObjectType):
    verify_user = VerifyUser.Field()

verify = graphene.Schema(query=Query, mutation = Verify)

