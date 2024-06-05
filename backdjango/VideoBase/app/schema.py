from random import sample
from django.forms import ValidationError
import graphene
import graphql_jwt
from django.db.models import Q, Count
from graphql_jwt.shortcuts import get_token, create_refresh_token, get_refresh_token
from .models import CustomUser, Tag, Video
from django.http import HttpResponse
from .mutations.users import RegisterUser, LoginUser, RequestPasswordReset, ResetPassword, ChangePasswordMutation, UsersType, DeleteUserAccountMutation
from graphql_jwt.decorators import login_required
from .types.type import VideoType, PostType, CommentType, SubCommentType, LikesInfo, TagType
from .models import Video as VideoModel
from .models import Post as PostModel
from .models import Comment as CommentModel
from .models import SubComment as SubCommentModel
from .mutations.posts import CreatePostMutation, DeletePostMutation, DislikePostMutation, LikePostMutation, AddViewMutation, ChangePrivacyMutation
from .mutations.comments import CreateCommentMutation, DeleteCommentMutation
from .mutations.subcomments import CreateSubCommentMutation, DeleteSubcommentMutation
from .mutations.contact import ContactEmailMutation
# from .mutations.videos import CreateVideoMutation
# , UpdateVideoMutation, DeleteVideoMutation
import jwt
from django.core.exceptions import ObjectDoesNotExist
from .jwt_auth import jwt_get_user


class Query(graphene.ObjectType):
    all_users = graphene.List(UsersType)
    check_token = graphene.Boolean()
    all_videos = graphene.List(VideoType)
    all_non_private_posts = graphene.List(PostType)
    all_posts = graphene.List(PostType)
    all_tags = graphene.List(TagType)
    search_post = graphene.List(
        PostType, search=graphene.String())
    check_likes = graphene.List(LikesInfo, post_id=graphene.Int())
    post_comments = graphene.List(
        CommentType, post_id=graphene.ID(required=True))
    all_subcomments = graphene.List(
        SubCommentType, post_id=graphene.ID(required=True))
    post_by_id = graphene.Field(
        PostType,
        post_id=graphene.ID(required=True)
    )
    post_by_tag = graphene.List(
        PostType,
        tag=graphene.String()
    )
    subcomments_by_comment_id = graphene.List(
        SubCommentType, comment_id=graphene.ID(required=True)
    )
    # views_by_post_id = graphene.Field(ViewsType,  post_id=graphene.Int(required=True))   
    videos_added_by_user = graphene.List(PostType)
    liked_posts_by_user = graphene.List(PostType)
    recommended_videos = graphene.List(PostType, post_id=graphene.ID(required=True))

    def resolve_all_videos(self, info):
        return VideoModel.objects.all()
    
    def resolve_all_non_private_posts(self, info):
        return PostModel.objects.all().filter(is_private=False)

    @login_required
    def resolve_all_users(root, info):
        return CustomUser.objects.all()

    @login_required
    def resolve_check_token(self, info):
        return True
    
    def resolve_all_tags(root, info):
        tags_with_posts = Tag.objects.annotate(num_posts=Count('posts')).filter(num_posts__gt=0)
        return tags_with_posts


    def resolve_search_post(root, info, search=None):
        queryset = PostModel.objects.all()

        if search:
            keywords = search.split()
            combined_query = Q()
            for keyword in keywords:
                combined_query |= Q(title__icontains=keyword) | Q(description__icontains=keyword) | Q(tags__name__icontains=keyword)

        queryset = queryset.filter(combined_query).distinct()

        return queryset

    def resolve_all_posts(self, info):
        user = jwt_get_user(info)

        posts = PostModel.objects.all().order_by('id')

        for post in posts:
            post.is_liked = user in post.likes.all() if user else False
            post.is_disliked = user in post.dislikes.all() if user else False

        return posts

    def resolve_check_likes(self, info, post_id=None):
        post = PostModel.objects.get(id=post_id)
        likes = post.likes.count()
        dislikes = post.dislikes.count()
        return [LikesInfo(likes=likes, dislikes=dislikes)]

    def resolve_post_comments(self, info, post_id):
        try:
            post = PostModel.objects.get(id=post_id)
            return CommentModel.objects.filter(post=post)
        except PostModel.DoesNotExist:
            return []

    def resolve_all_subcomments(self, info, post_id):
        return SubCommentModel.objects.filter(comment__post_id=post_id)

    
    def resolve_post_by_id(self, info, post_id):
        try:
            user = jwt_get_user(info)

            post = PostModel.objects.get(id=post_id)

            post.is_liked = user in post.likes.all() if user else False
            post.is_disliked = user in post.dislikes.all() if user else False

            return post
        except ObjectDoesNotExist:
            return None
        
    def resolve_subcomments_by_comment_id(self, info, comment_id):
        try:
            return SubCommentModel.objects.filter(comment_id=comment_id)
        except ObjectDoesNotExist:
            return []
        
    def resolve_views_by_post_id(self, info, post_id):
        try:
            return PostModel.objects.get(id=post_id)
        except PostModel.DoesNotExist:
            return 0
        
   
    def resolve_videos_added_by_user(self, info):
        user = jwt_get_user(info)
        if user:
            posts = PostModel.objects.filter(user=user)
            return posts
        else:
            return []
        

    def resolve_liked_posts_by_user(self, info):
        user = jwt_get_user(info)
        if user:
            return PostModel.objects.filter(likes=user)
        else:
            return []

    def resolve_recommended_videos(self, info, post_id):
        try:
            post = PostModel.objects.get(id=post_id)
            user = post.user
            first_tag = post.tags.first()

            posts_by_tag = []
            posts_by_user = []

            if first_tag:
                posts_by_tag = list(PostModel.objects.filter(tags=first_tag, is_private=False).exclude(id=post_id)[:4])

            posts_by_user = list(PostModel.objects.filter(user=user).exclude(id=post_id)[:4])

            combined_posts = list(set(posts_by_tag) | set(posts_by_user))

            if len(combined_posts) < 8:
                remaining_posts = PostModel.objects.exclude(id__in=[post.id for post in combined_posts])
                remaining_posts_count = min(8 - len(combined_posts), remaining_posts.count())
                combined_posts += sample(list(remaining_posts), remaining_posts_count)

            return combined_posts[:8]

        except PostModel.DoesNotExist:
            return []
        
    def resolve_post_by_tag(self, info, tag):
        try:
            tag = Tag.objects.get(name=tag)
            return PostModel.objects.all().filter(tags=tag)
        except Tag.DoesNotExist:
            return []
        
        

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
    delete_post = DeletePostMutation.Field()
    like_post = LikePostMutation.Field()
    dislike_post = DislikePostMutation.Field()
    add_view = AddViewMutation.Field()
    change_privacy = ChangePrivacyMutation.Field()

    create_coment = CreateCommentMutation.Field()
    create_subcoment = CreateSubCommentMutation.Field()
    delete_comment = DeleteCommentMutation.Field()
    delete_subcomment = DeleteSubcommentMutation.Field()

    contact_email = ContactEmailMutation.Field()
    delete_user_account = DeleteUserAccountMutation.Field()

    # create_video = CreateVideoMutation.Field()
    # update_video = UpdateVideoMutation.Field()
    # delete_video = DeleteVideoMutation.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
