import graphene
from graphene_django import DjangoObjectType
from app.models import CustomUser, Tag, Video, Post, Comment, SubComment


class UsersType(DjangoObjectType):
    class Meta:
        model = CustomUser
        fields = (
            'id',
            'username',
            'password',
            'email',
            'createdate',
            'premium',
            'is_active',
            'is_verified',
            'reset_code',)


class VideoType(DjangoObjectType):
    class Meta:
        model = Video
        fields = "__all__"


class PostType(DjangoObjectType):
    is_liked = graphene.Boolean()
    is_disliked = graphene.Boolean()

    class Meta:
        model = Post
        fields = "__all__"


class LikesInfo(graphene.ObjectType):
    likes = graphene.Int()
    dislikes = graphene.Int()


class CommentType(DjangoObjectType):
    class Meta:
        model = Comment
        fields = "__all__"


class SubCommentType(DjangoObjectType):
    class Meta:
        model = SubComment
        fields = "__all__"


class TagType(DjangoObjectType):
    class Meta:
        model = Tag
        fields = ("id", "name")