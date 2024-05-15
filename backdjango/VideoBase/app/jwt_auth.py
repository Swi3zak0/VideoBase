import jwt
from .models import CustomUser
from django.core.exceptions import ObjectDoesNotExist


def jwt_get_user(info):
    if "JWT" in info.context.COOKIES:
            jwt_token = info.context.COOKIES["JWT"]
            
            try:
                payload = jwt.decode(jwt_token, "verification_token", algorithms=["HS256"])
                username = payload["username"]
                try:
                    user = CustomUser.objects.get(username=username)
                except ObjectDoesNotExist:
                    raise Exception("User does not exist")
            except jwt.ExpiredSignatureError:
                raise Exception("JWT token has expired")
            except jwt.InvalidTokenError:
                raise Exception("Invalid JWT token")
            return user