# Generated by Django 5.1.4 on 2024-12-24 00:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0002_esp_measurement_esp'),
    ]

    operations = [
        migrations.AddField(
            model_name='esp',
            name='is_hum_enabled',
            field=models.BooleanField(default=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='esp',
            name='is_pm25_enabled',
            field=models.BooleanField(default=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='esp',
            name='is_press_enabled',
            field=models.BooleanField(default=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='esp',
            name='is_screen_enabled',
            field=models.BooleanField(default=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='esp',
            name='is_temp_enabled',
            field=models.BooleanField(default=True),
            preserve_default=False,
        ),
    ]
