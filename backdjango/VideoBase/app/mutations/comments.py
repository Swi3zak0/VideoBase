import graphene
from graphene_django.types import DjangoObjectType
from ..models import Post, Comment, CustomUser
from django.utils import timezone
import base64
import jwt
from ..jwt_auth import jwt_get_user

class CreateCommentMutation(graphene.Mutation):
    class Arguments:
        post_id = graphene.ID(required=True)
        comment = graphene.String(required=True)

    success = graphene.Boolean()
    errors = graphene.String()

    def mutate(self, info, post_id, comment):
        try:
            user = jwt_get_user(info)

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
