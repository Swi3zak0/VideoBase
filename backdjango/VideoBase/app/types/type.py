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
    proportion = graphene.Float()

    class Meta:
        model = Post
        fields = "__all__"

    def resolve_proportion(self, info):
        if self.dislikes_count == 0:  # Avoid division by zero
            return float(self.likes_count)
        return float(self.likes_count) / float(self.dislikes_count)


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
    post_count = graphene.Int()


    class Meta:
        model = Tag
        fields = ("id", "name")

    def resolve_post_count(self, info):
        return self.posts.count()