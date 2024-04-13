# Generated by Django 5.0.3 on 2024-04-11 12:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0009_video_video_file_alter_video_url'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='video',
            name='name',
        ),
        migrations.AddField(
            model_name='video',
            name='title',
            field=models.CharField(default='1', max_length=100),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='video',
            name='url',
            field=models.URLField(blank=True),
        ),
        migrations.AlterField(
            model_name='video',
            name='video_file',
            field=models.FileField(upload_to='videos/'),
        ),
    ]