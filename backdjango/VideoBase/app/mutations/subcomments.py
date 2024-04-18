import graphene
from graphene_django.types import DjangoObjectType
from ..models import CustomUser, SubComment, Comment
from ..types.type import SubCommentType
from django.utils import timezone
import base64
import jwt


class CreateSubCommentMutation(graphene.Mutation):
    class Arguments:
        comment_id = graphene.ID(required=True)
        sub_comment = graphene.String(required=True)

    success = graphene.Boolean()
    errors = graphene.String()

    def mutate(self, info, comment_id, sub_comment):
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

            comment = Comment.objects.get(id=comment_id)
            new_sub_comment = SubComment.objects.create(
                user=user,
                comment=comment,
                sub_comment=sub_comment,
            )
            return CreateSubCommentMutation(success=True, errors=None)
        except Exception as e:
            return CreateSubCommentMutation(success=False, errors=str(e))