# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings
import uuid


class Migration(migrations.Migration):
    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Notes',
            fields=[
                ('header', models.CharField(max_length=255)),
                ('text', models.CharField(max_length=255)),
                ('date_time', models.DateTimeField(auto_now_add=True)),
                ('category', models.CharField(default=b'Notice', max_length=15,
                                              choices=[
                                                  (b'Reference', b'Reference'),
                                                  (b'Notice', b'Notice'),
                                                  (b'Reminder', b'Reminder'),
                                                  (b'TODO', b'TODO')])),
                ('favorites', models.BooleanField(default=False)),
                ('publish', models.BooleanField(default=False)),
                ('uu_id', models.CharField(default=uuid.uuid1, max_length=100,
                                           serialize=False, editable=False,
                                           primary_key=True)),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
