from django.urls import path
from graphene_django.views import GraphQLView
from graphql import GraphQLError
from django.http import HttpResponse
import jwt
from .schema import schema, verify
from .models import CustomUser
from django.views.decorators.csrf import csrf_exempt
from graphql_jwt.decorators import jwt_cookie


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
                decoded_token = jwt.decode(token, 'verification_token', algorithms=['HS256'])
                email = decoded_token['email']
                user = CustomUser.objects.get(email=email)
                user.is_active = True
                user.save()
                return HttpResponse("Użytkownik został pomyślnie aktywowany.")
            except jwt.ExpiredSignatureError:
                raise GraphQLError('Token wygasł.')
            except (jwt.InvalidTokenError, CustomUser.DoesNotExist):
                raise GraphQLError('Nieprawidłowy token lub użytkownik nie istnieje.')

        # Jeśli nie przekazano tokena JWT, kontynuuj standardową obsługę GraphQL
        return super().dispatch(request, *args, **kwargs)

urlpatterns = [
    path('graphql', jwt_cookie(csrf_exempt(CustomGraphQLView.as_view(graphiql=True, schema=schema)))),
    path('activate/<token>/', csrf_exempt(VerifyGraphQLView.as_view(graphiql=True, schema=verify)))
]
