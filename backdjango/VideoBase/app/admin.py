from django.contrib import admin

from .models import CustomUser, Video, Post

admin.site.register(CustomUser)
admin.site.register(Video)
admin.site.register(Post)


# Register your models here.
