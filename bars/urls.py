from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns('',
    # Examples:
    url(r'^$', 'bars.notes.views.main'),
    url(r'^notes_list$', 'bars.notes.views.notes_list'),
    url(r'^get_notes$', 'bars.notes.views.get_notes'),
    url(r'^get_one_note$', 'bars.notes.views.get_one_note'),
    url(r'^add_note$', 'bars.notes.views.add_note'),
    url(r'^create_note$', 'bars.notes.views.create_note'),
    url(r'^edit_note$', 'bars.notes.views.edit_note'),
    url(r'^delete_note$', 'bars.notes.views.delete_note'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
)
