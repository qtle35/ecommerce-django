# Generated by Django 4.1.13 on 2024-05-26 09:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_info', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='avatar',
            field=models.ImageField(blank=True, null=True, upload_to='images/'),
        ),
        migrations.AddField(
            model_name='user',
            name='banner',
            field=models.ImageField(blank=True, null=True, upload_to='images/'),
        ),
    ]
