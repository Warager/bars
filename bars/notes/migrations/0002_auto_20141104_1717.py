# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('notes', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='notes',
            name='id',
        ),
        migrations.AddField(
            model_name='notes',
            name='uu_id',
            field=models.CharField(default=uuid.uuid1, max_length=100, serialize=False, editable=False, primary_key=True),
            preserve_default=True,
        ),
    ]
