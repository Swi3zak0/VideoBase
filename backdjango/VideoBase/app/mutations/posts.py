import graphene
from graphene_django.types import DjangoObjectType
from ..models import Video, CustomUser, Post
from ..types.type import PostType
from django.utils import timezone
import base64
import jwt

class CreatePostMutation(graphene.Mutation):
    class Arguments:
        title = graphene.String(required=True)
        description = graphene.String()
        video_url = graphene.String(required=True)
        is_private = graphene.Boolean()
        expiration_date = graphene.Int()

    success = graphene.Boolean()
    errors = graphene.String()
    post = graphene.Field(PostType)

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

            video = Video.objects.get(url=video_url)

            post = Post.objects.create(
                title=title,
                description=description,
                video_id=video.id,
                user=user,
                short_url=video_url,
                is_private=is_private,
                expiration_date=exp_date,
            )

            return CreatePostMutation(success=True, post=post)
        except Exception as e:
            return CreatePostMutation(success=False, errors=str(e))
