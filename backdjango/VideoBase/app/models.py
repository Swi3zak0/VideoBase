from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


class UserManager(BaseUserManager):
    def create_user(self, username, password,email, **extra_fields):
        user = self.model(username=username, password=password, email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, username, password, email,**extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)


        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(username, password, email, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=255, unique=True)
    createdate = models.DateTimeField(auto_now_add=True, blank=True)
    premium = models.BooleanField(default=False)
    premiumexpirationdate = models.DateField(null=True, blank=True)
    frame = models.IntegerField(default=0)
    is_staff = models.BooleanField(default=False) 
    is_active = models.BooleanField(default=False) 
    is_superuser = models.BooleanField(default=False) 


    objects = UserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []



    def str(self):
        return self.username
    
