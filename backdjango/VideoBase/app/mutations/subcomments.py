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
        



class DeleteSubcommentMutation(graphene.Mutation):
    class Arguments:
        subcomment_id = graphene.ID(required=True)

    success = graphene.Boolean()
    errors = graphene.String()

    def mutate(self, info, subcomment_id):
        try:
            user = jwt_get_user(info)

            if not user:
                raise Exception("User not authenticated")

            subcomment = SubComment.objects.get(id=subcomment_id)

            if subcomment.user != user:
                raise Exception("You do not have permission to delete this comment")
            
            subcomment.delete()
            
            return DeleteSubcommentMutation(success=True, errors=None)
        except Comment.DoesNotExist:
            return DeleteSubcommentMutation(success=False, errors="Comment not found")
        except Exception as e:
            return DeleteSubcommentMutation(success=False, errors=str(e))