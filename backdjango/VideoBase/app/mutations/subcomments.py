import graphene
from graphene_django.types import DjangoObjectType
from ..models import CustomUser, SubComment, Comment
from ..types.type import SubCommentType
from django.utils import timezone
import base64
import jwt
from ..jwt_auth import jwt_get_user


class CreateSubCommentMutation(graphene.Mutation):
    class Arguments:
        comment_id = graphene.ID(required=True)
        sub_comment = graphene.String(required=True)

    success = graphene.Boolean()
    errors = graphene.String()

    def mutate(self, info, comment_id, sub_comment):
        try:
            user = jwt_get_user(info)

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
