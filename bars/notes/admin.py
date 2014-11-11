from django.contrib import admin
from bars.notes.models import Notes


class NotesAdmin(admin.ModelAdmin):
    list_display = ['user', 'uu_id', 'header', 'text', 'date_time',
                    'category', 'favorites', 'publish']


admin.site.register(Notes, NotesAdmin)