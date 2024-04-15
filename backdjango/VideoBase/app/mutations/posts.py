import graphene
from graphene_django.types import DjangoObjectType
from ..models import Video, CustomUser, Post
from ..types.type import PostType
from django.utils import timezone
import base64




class CreatePostMutation(graphene.Mutation):
    class Arguments:
        title = graphene.String(required=True)
        description = graphene.String()
        video_url = graphene.String(required=True)
        is_private = graphene.Boolean()
        expiration_date = graphene.Int()

    success = graphene.Boolean()
    errors = graphene.String()
    post = graphene.Field(PostType)  # Assuming you have a PostType defined

    def mutate(
        self,
        info,
        title,
        description,
        video_url,
        is_private,
        expiration_date=None,
    ):
        try:
            user = info.context.user

            exp_date = None
            if is_private:
                if expiration_date:
                    if expiration_date == 1:
                        exp_date = timezone.now() + timezone.timedelta(days=1)
                    elif expiration_date == 2:
                        exp_date = timezone.now() + timezone.timedelta(days=3)
                    elif expiration_date == 3:
                        exp_date = timezone.now() + timezone.timedelta(days=7)
                    else:
                        exp_date = timezone.now() + timezone.timedelta(days=1)
                else:
                    exp_date = timezone.now() + timezone.timedelta(days=1)

            # Fetch the Video object based on the provided URL
            video = Video.objects.get(url=video_url)

            # Create the Post object
            post = Post.objects.create(
                title=title,
                description=description,
                video_id=video.id,  # Use video ID instead of video object
                user=user,
                short_url=video_url,  # Assuming you want to use video_url as short_url
                is_private=is_private,
                expiration_date=exp_date,
            )

            return CreatePostMutation(success=True, post=post)
        except Exception as e:
            return CreatePostMutation(success=False, errors=str(e))
