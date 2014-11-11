import datetime
from django.contrib import auth
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.auth import login as auth_login
from django.http import JsonResponse, Http404
from django.shortcuts import render, redirect
from bars.notes.models import Notes


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
    user = request.user
    data = {
        'user': user.username
    }
    return render(request, "notes/notes_list.html", data)


def get_notes(request):
    row = []
    for obj in Notes.objects.filter(user=request.user):
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
    date_time = datetime.datetime.now()
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
