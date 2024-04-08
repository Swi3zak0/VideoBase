import graphene
from django.utils.deprecation import MiddlewareMixin
from .schema import Mutation, Query


class CustomCookieMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        if 'JWT' in response.cookies:
            response.cookies['JWT']['httponly'] = False

        return response


class RefreshTokenMiddleware(MiddlewareMixin):
    def process_request(self, request):
        try:
            if request.COOKIES.get("JWT") is None:
                if request.COOKIES.get("JWT-refresh-token") is None:
                    return
                schema = graphene.Schema(mutation=Mutation, query=Query)
                result = schema.execute(
                    '''
                        mutation {
                            refreshToken(refreshToken: "'''
                    + request.COOKIES.get("JWT-refresh-token")
                    + """")
                                    {
                                        token
                                        }
                                    }
                                """
                )
            request.jwt_token = result.data.get("refreshToken").get("token")
        except Exception as e:
            print(e)
