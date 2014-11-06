# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Notes',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('header', models.CharField(max_length=255)),
                ('text', models.CharField(max_length=255)),
                ('date_time', models.DateTimeField(auto_now_add=True)),
                ('category', models.CharField(default=b'NT', max_length=2, choices=[(b'RF', b'Reference'), (b'NT', b'Notice'), (b'RM', b'Reminder'), (b'TD', b'TODO')])),
                ('favorites', models.BooleanField(default=False)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
