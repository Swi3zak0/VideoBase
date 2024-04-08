from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from .menagers import UserManager


class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
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

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    def __str__(self):
        return f"{self.username}"


class Video(models.Model):
    name = models.CharField(max_length=255, null=False)
    url = models.CharField(max_length=255, null=False)

    def __str__(self):
        return f"{self.name}"
    

class Post(models.Model):
    title = models.CharField(max_length=25, null=False)
    description = models.TextField(max_length=255, null=True, blank=True)
    create_time = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(CustomUser, null=True, on_delete=models.CASCADE)
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    is_private = models.BooleanField(default=True)
    expiration_date = models.DateTimeField(null=True, blank=True)
    short_url = models.CharField(max_length=15, null=False, unique=True)
    # expirated = models.BooleanField(default=False)
    # views = models.IntegerField(default=0)
    # category = models.ForeignKey(Category, null=True, on_delete=models.CASCADE)
    # likes = models.ManyToManyField(CustomUser, related_name="likes", blank=True)
    # dislikes = models.ManyToManyField(CustomUser, related_name="dislikes", blank=True)

    def __str__(self):
        return f"{self.title}"