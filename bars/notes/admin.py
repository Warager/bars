from django.contrib import admin
from bars.notes.models import Notes


class NotesAdmin(admin.ModelAdmin):
    list_display = ['uu_id', 'header', 'text', 'date_time', 'category',
                    'favorites']


admin.site.register(Notes, NotesAdmin)