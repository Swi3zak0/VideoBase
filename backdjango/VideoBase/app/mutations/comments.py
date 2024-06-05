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
        
class UpdateCommentMutation(graphene.Mutation):
    class Arguments:
        comment_id = graphene.ID(required=True)
        new_comment = graphene.String(required=True)

    success = graphene.Boolean()
    errors = graphene.String()

    def mutate(self, info, comment_id, new_comment):
        try:
            user = jwt_get_user(info)

            if not user:
                raise Exception("User not authenticated")

            # Znajdź istniejący komentarz
            comment = Comment.objects.get(id=comment_id)

            # Sprawdź, czy użytkownik jest właścicielem komentarza
            if comment.user != user:
                raise Exception("You are not authorized to edit this comment")

            # Zaktualizuj treść komentarza
            comment.comment = new_comment
            comment.save()

            return UpdateCommentMutation(success=True, errors=None)
        except Comment.DoesNotExist:
            return UpdateCommentMutation(success=False, errors="Comment not found")
        except Exception as e:
            return UpdateCommentMutation(success=False, errors=str(e))
        
class DeleteCommentMutation(graphene.Mutation):
    class Arguments:
        comment_id = graphene.ID(required=True)
        
    success = graphene.Boolean()
    errors = graphene.String()

    def mutate(self, info, comment_id):
        try:
            user = jwt_get_user(info)

            if not user:
                raise Exception("User not authenticated")

            comment = Comment.objects.get(id=comment_id)

            if comment.user != user:
                raise Exception("You do not have permission to delete this comment")
            
            comment.delete()
            
            return DeleteCommentMutation(success=True, errors=None)
        except Comment.DoesNotExist:
            return DeleteCommentMutation(success=False, errors="Comment not found")
        except Exception as e:
            return DeleteCommentMutation(success=False, errors=str(e))

