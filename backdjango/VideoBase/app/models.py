from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from .menagers import UserManager
from firebase_admin import storage
from django.db import models


class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=False)
    username = models.CharField(max_length=255, unique=True)
    createdate = models.DateTimeField(auto_now_add=True, blank=True)
    premium = models.BooleanField(default=False)
    premiumexpirationdate = models.DateField(null=True, blank=True)
    frame = models.IntegerField(default=0)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)
    activation_link_used = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    reset_code = models.CharField(max_length=100, null=True, blank=True)

    objects = UserManager()

    def get_user_posts(self):
        return Post.objects.filter(user=self)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    def __str__(self):
        return f"{self.username}"


class Video(models.Model):
    title = models.CharField(max_length=100)
    video_file = models.FileField()
    url = models.URLField(blank=True)

    def __str__(self):
        return self.title

class Tag(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Post(models.Model):
    title = models.CharField(max_length=25, null=False)
    description = models.TextField(max_length=255, null=True, blank=True)
    create_time = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(CustomUser, null=True, on_delete=models.CASCADE)
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    is_private = models.BooleanField(default=True)
    expiration_date = models.IntegerField(null=True, blank=True)
    short_url = models.CharField(max_length=255, null=False, unique=True)
    # expirated = models.BooleanField(default=False)
    views = models.IntegerField(default=0)
    # category = models.ForeignKey(Category, null=True, on_delete=models.CASCADE)
    likes = models.ManyToManyField(
        CustomUser, related_name="likes", blank=True)
    dislikes = models.ManyToManyField(
        CustomUser, related_name="dislikes", blank=True)
    likes_count = models.IntegerField(default=0)
    dislikes_count = models.IntegerField(default=0)
    tags = models.ManyToManyField(Tag, related_name="posts", blank=True)

    def __str__(self):
        return f"{self.title}"
    

class Comment(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    comment = models.TextField()

    def __str__(self):
        return f"Comment by {self.user.username} on {self.post.title}"


class SubComment(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE)
    sub_comment = models.TextField()

    def __str__(self):
        return f"Subcomment by {self.user.username} on {self.comment.post.title} - {self.comment.comment}"
