import graphene
from graphene_django.types import DjangoObjectType
from ..models import Post, Comment, CustomUser
from django.utils import timezone
import base64
import jwt

class CreateCommentMutation(graphene.Mutation):
    class Arguments:
        post_id = graphene.ID(required=True)
        comment = graphene.String(required=True)

    success = graphene.Boolean()
    errors = graphene.String()

    def mutate(self, info, post_id, comment):
        try:
            user = None

            if "JWT" in info.context.COOKIES:
                jwt_token = info.context.COOKIES["JWT"]
                
                try:
                    payload = jwt.decode(jwt_token, "verification_token", algorithms=["HS256"])
                    username = payload["username"]
                    user = CustomUser.objects.get(username=username)
                except jwt.ExpiredSignatureError:
                    raise Exception("JWT token has expired")
                except jwt.InvalidTokenError:
                    raise Exception("Invalid JWT token")

            if not user:
                raise Exception("User not authenticated")

            post = Post.objects.get(id=post_id)
            new_comment = Comment.objects.create(
                user=user,
                post=post,
                comment=comment,
            )
            return CreateCommentMutation(success=True, errors=None)
        except Exception as e:
            return CreateCommentMutation(success=False, errors=str(e))