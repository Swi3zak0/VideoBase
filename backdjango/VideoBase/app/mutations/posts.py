import graphene
from graphene_django.types import DjangoObjectType
from ..models import Tag, Video, CustomUser, Post
from ..types.type import PostType
from django.utils import timezone
import base64
import jwt
from ..jwt_auth import jwt_get_user
from graphql_jwt.decorators import login_required



class CreatePostMutation(graphene.Mutation):
    class Arguments:
        title = graphene.String(required=True)
        description = graphene.String()
        video_url = graphene.String(required=True)
        is_private = graphene.Boolean()
        # expiration_date = graphene.Int()
        tags = graphene.String()

    success = graphene.Boolean()
    errors = graphene.String()
    post = graphene.Field(PostType)

    def mutate(
        self,
        info,
        title,
        tags,
        description,
        video_url,
        is_private,
        expiration_date=None,
    ):

        try:
            user = jwt_get_user(info)

            # exp_date = None
            # if is_private:
            #     if expiration_date:
            #         if expiration_date == 1:
            #             exp_date = timezone.now() + timezone.timedelta(days=1)
            #         elif expiration_date == 2:
            #             exp_date = timezone.now() + timezone.timedelta(days=3)
            #         elif expiration_date == 3:
            #             exp_date = timezone.now() + timezone.timedelta(days=7)
            #         else:
            #             exp_date = timezone.now() + timezone.timedelta(days=1)
            #     else:
            #         exp_date = timezone.now() + timezone.timedelta(days=1)

            video = Video.objects.get(url=video_url)

            post = Post.objects.create(
                title=title,
                description=description,
                video_id=video.id,
                user=user,
                short_url=video_url,
                is_private=is_private,
                # expiration_date=exp_date,
            )

            if tags:
                tag_list = [tag.strip() for tag in tags.split(",")]
                for tag_name in tag_list:
                    tag, created = Tag.objects.get_or_create(name=tag_name)
                    post.tags.add(tag)

            post.save()

            return CreatePostMutation(success=True, post=post)
        except Exception as e:
            return CreatePostMutation(success=False, errors=str(e))

class DeletePostMutation(graphene.Mutation):
    class Arguments:
        post_id = graphene.ID(required=True)
    
    success = graphene.Boolean()

    @login_required
    def mutate(self, info, post_id):
        user = jwt_get_user(info)

        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            raise Exception('Post o podanym ID nie istnieje.')

        if post.user != user:
            raise Exception('Nie jesteś właścicielem tego posta.')

        post.delete()

        success = True

        return DeletePostMutation(success=success)
    
class LikePostMutation(graphene.Mutation):
    class Arguments:
        post_id = graphene.ID(required=True)

    success = graphene.Boolean()

    def mutate(self, info, post_id):

        user = jwt_get_user(info)

        if not user.is_authenticated:
            raise Exception('Musisz być zalogowany, aby polubić post.')
        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            raise Exception('Post o podanym ID nie istnieje.')
        if post.dislikes.filter(username=user.username):
            post.dislikes.remove(user)
            post.likes.add(user)
        elif post.likes.filter(username=user.username):
            post.likes.remove(user)
        else:
            post.likes.add(user)


        success = True
        likes = post.likes.count()
        post.likes_count = likes
        dislikes = post.dislikes.count()
        post.dislikes_count = dislikes
        post.save()

        return LikePostMutation(success=success)


class DislikePostMutation(graphene.Mutation):
    class Arguments:
        post_id = graphene.ID(required=True)

    success = graphene.Boolean()

    def mutate(self, info, post_id):

        user = jwt_get_user(info)

        if not user.is_authenticated:
            raise Exception('Musisz być zalogowany, aby polubić post.')
        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            raise Exception('Post o podanym ID nie istnieje.')
        if post.likes.filter(username=user.username):
            post.likes.remove(user)
            post.dislikes.add(user)
        elif post.dislikes.filter(username=user.username):
            post.dislikes.remove(user)
        else:
            post.dislikes.add(user)
        


        success = True
        likes = post.likes.count()
        post.likes_count = likes
        dislikes = post.dislikes.count()
        post.dislikes_count = dislikes
        post.save()

        return DislikePostMutation(success=success)
    

class AddViewMutation(graphene.Mutation):
    class Arguments:
        post_id = graphene.ID(required=True)
    
    success = graphene.Boolean()

    def mutate(self, info, post_id):

        post = Post.objects.get(id=post_id)
        post.views+=1
        post.save()
        success = True

        return AddViewMutation(success=success)
    
class ChangePrivacyMutation(graphene.Mutation):
    class Arguments:
        post_id = graphene.ID(required=True)
    
    success = graphene.Boolean()

    def mutate(self, info, post_id):

        post = Post.objects.get(id=post_id)
        if post.is_private==False:
            post.is_private=True
        else:
            post.is_private=False
        post.save()
        success = True

        return ChangePrivacyMutation(success=success)


    
