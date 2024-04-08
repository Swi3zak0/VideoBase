from django.urls import path
from .schema import schema
from django.views.decorators.csrf import csrf_exempt
from graphql_jwt.decorators import jwt_cookie
from .views import CustomGraphQLView, VerifyGraphQLView


urlpatterns = [
    path('graphql', jwt_cookie(csrf_exempt(
        CustomGraphQLView.as_view(graphiql=True, schema=schema)))),
    path('activate/<token>/',
         csrf_exempt(VerifyGraphQLView.as_view(graphiql=True, schema=schema))),
]
