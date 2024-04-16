from django.forms import ValidationError
import graphene
import graphql_jwt
from django.db.models import Q
from graphql_jwt.shortcuts import get_token, create_refresh_token, get_refresh_token
from .models import CustomUser, Video
from django.http import HttpResponse
from .mutations.users import RegisterUser, LoginUser, RequestPasswordReset, ResetPassword, ChangePasswordMutation, UsersType
from .types.type import VideoType, PostType, LikesInfo
from graphql_jwt.decorators import login_required
from .models import Video as VideoModel
from .models import Post as PostModel
from .mutations.posts import CreatePostMutation, DislikePostMutation, LikePostMutation

# from .mutations.videos import CreateVideoMutation
# , UpdateVideoMutation, DeleteVideoMutation


class Query(graphene.ObjectType):
    all_users = graphene.List(UsersType)
    check_token = graphene.Boolean()
    all_videos = graphene.List(VideoType)
    all_posts = graphene.List(PostType)
    search_post = graphene.List(PostType, search=graphene.String(), category=graphene.String())
    check_likes = graphene.List(LikesInfo, post_id=graphene.Int())

    @login_required
    def resolve_all_videos(self, info):
        return VideoModel.objects.all()

    @login_required
    def resolve_all_users(root, info):
        return CustomUser.objects.all()
    
    @login_required
    def resolve_check_token(self, info):
        return True
    
    @login_required
    def resolve_search_post(root, info, search=None, category=None):
        queryset = PostModel.objects.all()
        
        if search:
            keywords = search.split()
            combined_query = Q()
            for keyword in keywords:
                if keyword.startswith("#"):
                    combined_query |= Q(tags__icontains=keyword)
                else:
                    combined_query |= Q(title__icontains=keyword)

        queryset = queryset.filter(combined_query)

        if category:
            queryset = queryset.filter(category=category)
    
        return queryset
    
    def resolve_all_posts(self, info):
        return PostModel.objects.all()
    
    def resolve_check_likes(self, info, post_id=None):
        post = PostModel.objects.get(id=post_id)
        likes = post.likes.count()
        dislikes = post.dislikes.count()
        return [LikesInfo(likes=likes, dislikes=dislikes)]

class Mutation(graphene.ObjectType):
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()
    register_user = RegisterUser.Field()
    login_user = LoginUser.Field()
    delete_token_cookie = graphql_jwt.DeleteJSONWebTokenCookie.Field()
    delete_refresh_token_cookie = graphql_jwt.DeleteRefreshTokenCookie.Field()
    request_password_reset = RequestPasswordReset.Field()
    reset_password = ResetPassword.Field()
    change_password = ChangePasswordMutation.Field()

    create_post = CreatePostMutation.Field()
    like_post = LikePostMutation.Field()
    dislike_post = DislikePostMutation.Field()


    # create_video = CreateVideoMutation.Field()
    # update_video = UpdateVideoMutation.Field()
    # delete_video = DeleteVideoMutation.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
