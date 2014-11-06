# from django.contrib.auth.models import User
import uuid
from django.db import models
# from django_extensions.db.fields import UUIDField


class Notes(models.Model):
    REFERENCE = 'Reference'
    NOTICE = 'Notice'
    REMINDER = 'Reminder'
    TODO = 'TODO'
    CATEGORY_CHOICES = (
        (REFERENCE, 'Reference'),
        (NOTICE, 'Notice'),
        (REMINDER, 'Reminder'),
        (TODO, 'TODO'),
    )
    # user = models.ForeignKey(User)
    header = models.CharField(max_length=255)
    text = models.CharField(max_length=255)
    date_time = models.DateTimeField(auto_now_add=True)
    category = models.CharField(max_length=15, choices=CATEGORY_CHOICES,
                                default=NOTICE)
    favorites = models.BooleanField(default=False)
    uu_id = models.CharField(primary_key=True, default=uuid.uuid1,
                             editable=False, max_length=100)
    # class Meta:
    #     unique_together = ('user', 'id')
