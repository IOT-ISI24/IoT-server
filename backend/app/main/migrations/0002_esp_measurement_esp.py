# Generated by Django 5.1.4 on 2024-12-24 00:00

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='ESP',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
                ('mac', models.CharField(max_length=100)),
                ('frequency', models.FloatField()),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='measurement',
            name='esp',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='main.esp'),
            preserve_default=False,
        ),
    ]
