# Generated by Django 5.0.3 on 2024-04-06 20:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0006_customuser_is_verified_alter_customuser_is_active'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='reset_code',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
