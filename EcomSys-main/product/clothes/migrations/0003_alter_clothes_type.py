# Generated by Django 4.1.13 on 2024-04-19 03:21

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('clothes', '0002_alter_clothes_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='clothes',
            name='type',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='clothes.type'),
        ),
    ]
