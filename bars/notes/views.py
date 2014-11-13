from datetime import datetime
import json
from django.contrib import auth
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.auth import login as auth_login
from django.http import JsonResponse, Http404
from django.shortcuts import render, redirect
from bars.notes.models import Notes
from django.db.models import Q


def main(request):
    """
    Renders start page
    """
    return render(request, 'notes/main.html')


def signup(request):
    """
    Site registration function
    """
    my_email = request.POST.get('email', "")
    my_password = request.POST.get('password', "")
    my_pass_conf = request.POST.get('confirm', "")

    if User.objects.filter(username=my_email).count():
        return JsonResponse({'success': False, 'error': 'error'})
    if my_email == "":
        return JsonResponse({'success': False, 'error': 'error'})
    if my_password == "":
        return JsonResponse({'success': False, 'error': 'error'})
    if my_password != my_pass_conf:
        return JsonResponse({'success': False, 'error': 'error'})

    user = User.objects.create_user(username=my_email, email=my_email)
    user.set_password(my_password)
    user.save()
    user.backend = "django.contrib.auth.backends.ModelBackend"
    auth_login(request, user)
    return JsonResponse({'success': True})


def signin(request):
    """
    Site log in function
    """
    my_email = request.POST.get('email', "")
    my_password = request.POST.get('password', "")

    try:
        user = User.objects.get(email__iexact=my_email, is_active=True)
    except User.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'error'})

    if not user.check_password(my_password):
        return JsonResponse({'success': False, 'error': 'error'})
    user.backend = "django.contrib.auth.backends.ModelBackend"
    auth_login(request, user)
    return JsonResponse({'success': True})


@login_required
def signout(request):
    """
    Site logout function
    """
    auth.logout(request)
    return redirect('/')


def notes_list(request):
    """
    """
    if not request.user.is_authenticated():
        return redirect('/')
    user = request.user
    data = {
        'user': user.username
    }
    return render(request, "notes/notes_list.html", data)


def get_notes(request):
    row = []
    u_notes = Notes.objects.filter(user=request.user)
    filters = json.loads(request.POST.get('filter', '{}'))
    if len(filters) > 0:
        for i in range(len(filters)):
            fltr = filters[i]['value']
            if filters[i]['field'] == 'header':
                u_notes = u_notes.filter(header__icontains=fltr)
            if filters[i]['field'] == 'favorites':
                u_notes = u_notes.filter(favorites=fltr)
            if filters[i]['field'] == 'category':
                if len(fltr) == 1:
                    u_notes = u_notes.filter(category=fltr[0])
                if len(fltr) == 2:
                    u_notes = u_notes.filter(Q(category=fltr[0]) |
                                             Q(category=fltr[1]))
                if len(fltr) == 3:
                    u_notes = u_notes.filter(Q(category=fltr[0]) |
                                             Q(category=fltr[1]) |
                                             Q(category=fltr[2]))
                if len(fltr) == 4:
                    u_notes = u_notes.filter(Q(category=fltr[0]) |
                                             Q(category=fltr[1]) |
                                             Q(category=fltr[2]) |
                                             Q(category=fltr[3]))
            if filters[i]['field'] == 'date_time':
                fltr = datetime.strptime(fltr, '%m/%d/%Y')
                if filters[i]['comparison'] == 'eq':
                    fltr_range = (
                        datetime.combine(fltr, datetime.min.time()),
                        datetime.combine(fltr, datetime.max.time())
                    )
                if filters[i]['comparison'] == 'lt':
                    fltr_range = (
                        datetime.strptime('01/01/2000', '%m/%d/%Y'),
                        datetime.combine(fltr, datetime.min.time())
                    )
                if filters[i]['comparison'] == 'gt':
                    fltr_range = (
                        datetime.combine(fltr, datetime.max.time()),
                        datetime.strptime('01/01/2100', '%m/%d/%Y')
                    )
                u_notes = u_notes.filter(date_time__range=fltr_range)
    for obj in u_notes:
        row.append({'header': obj.header,
                    'category': obj.category,
                    'text': obj.text,
                    'favorites': obj.favorites,
                    'uuid': obj.uu_id,
                    'date_time': obj.date_time,
                    'publish': obj.publish})
    return JsonResponse({'row': row})


def get_one_note(request):
    uu_id = request.POST.get('uuid', '')
    try:
        note = Notes.objects.get(uu_id=uu_id)
    except Notes.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'does_not_exist'})
    data = {'header': note.header,
            'category': note.category,
            'text': note.text,
            'favorites': note.favorites,
            'publish': note.publish,
            'uuid': note.uu_id}
    return JsonResponse({'success': True, 'data': data})


def view_note(request, uu_id):
    try:
        note = Notes.objects.get(uu_id=uu_id)
    except Notes.DoesNotExist:
        raise Http404
    data = {'header': note.header,
            'category': note.category,
            'text': note.text,
            'favorites': note.favorites,
            'uuid': note.uu_id,
            'publish': note.publish,
            'date_time': note.date_time}
    if (not data['publish']) and (not request.user.is_authenticated()):
        return redirect('/')
    if (request.user != note.user) and (not data['publish']):
        return redirect('/notes_list')
    return render(request, 'notes/note.html', data)


def add_note(request):
    header = request.POST.get('header', '')
    category = request.POST.get('category', 'Notice')
    text = request.POST.get('text', 'Nothing to say...')
    favorites = request.POST.get('favorites', False)
    publish = request.POST.get('publish', False)
    try:
        Notes.objects.create(
            user=request.user,
            header=header,
            category=category,
            text=text,
            favorites=favorites,
            publish=publish)
    except ValueError:
        return JsonResponse({'success': False})
    return JsonResponse({'success': True})


def edit_note(request):
    uu_id = request.POST.get('uuid', '')
    header = request.POST.get('header', '')
    category = request.POST.get('category', 'Notice')
    text = request.POST.get('text', 'Nothing to say...')
    favorites = request.POST.get('favorites', False)
    publish = request.POST.get('publish', False)
    date_time = datetime.now()
    try:
        Notes.objects.filter(uu_id=uu_id).update(header=header,
                                                 category=category,
                                                 text=text,
                                                 favorites=favorites,
                                                 publish=publish,
                                                 date_time=date_time)
    except Notes.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'does_not_exist'})
    return JsonResponse({'success': True})


def delete_note(request):
    uu_id = request.POST.get('uuid', '')
    try:
        Notes.objects.filter(uu_id=uu_id).delete()
    except Notes.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'does_not_exist'})
    return JsonResponse({'success': True})
