from graphql import GraphQLError
from .schema import verify

class VerifyTokenMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request, token = None):
        response = self.get_response(request)

        # Pobierz token z części ścieżki URL
        path = request.path_info
        path_parts = path.split('/')
        if len(path_parts) >= 3 and path_parts[1] == 'activate':
            token = path_parts[2]

            try:
                response = verify.execute(
                    '''
                    mutation VerifyUser($token: String!) {
                        verifyUser(token: $token) {
                            user {
                                id
                                email
                                isActive
                            }
                        }
                    }
                    ''',
                    variables={'token': token}
                )
            except Exception as e:
                # Tutaj obsługa błędów, jeśli to konieczne
                pass

        return response