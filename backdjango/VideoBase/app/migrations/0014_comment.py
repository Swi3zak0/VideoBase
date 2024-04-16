# Generated by Django 5.0.3 on 2024-04-16 17:34

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0013_post_expiration_date'),
    ]

    operations = [
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('comment', models.TextField()),
                ('post', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE, to='app.post')),
                ('user', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
