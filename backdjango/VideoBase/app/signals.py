from django.db.models.signals import post_delete
from django.dispatch import receiver
from .models import Post, Tag

@receiver(post_delete, sender=Post)
def delete_unused_tags(sender, instance, **kwargs):
    # Sprawdź każdy tag przypisany do usuniętego posta
    for tag in instance.tags.all():
        # Jeśli żaden post nie jest przypisany do tego tagu, usuń tag
        if not tag.posts.exists():
            tag.delete()