import logging

from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
from django.utils.decorators import method_decorator
from django.views import View
from django.views.generic import TemplateView

from coldfront.core.project.models import Project
from coldfront.core.user.forms import UserSearchForm
from coldfront.core.user.utils import CombinedUserSearch
from coldfront.core.utils.common import import_from_settings
from coldfront.core.utils.mail import send_email_template

logger = logging.getLogger(__name__)
EMAIL_ENABLED = import_from_settings('EMAIL_ENABLED', False)
if EMAIL_ENABLED:
    EMAIL_TICKET_SYSTEM_ADDRESS = import_from_settings(
        'EMAIL_TICKET_SYSTEM_ADDRESS')


@method_decorator(login_required, name='dispatch')
class UserProfile(TemplateView):
    template_name = 'user/user_profile.html'

    def dispatch(self, request, *args, viewed_username=None, **kwargs):
        # viewing another user profile requires permissions
        if viewed_username:
            if request.user.is_superuser or request.user.is_staff:
                # allow, via fallthrough
                pass
            else:
                # redirect them to their own profile

                # error if they tried to do something naughty
                if not request.user.username == viewed_username:
                    messages.error(request, "You aren't allowed to view other user profiles!")
                # if they used their own username, no need to provide an error - just redirect

                return HttpResponseRedirect(reverse('user-profile'))

        return super().dispatch(request, *args, viewed_username=viewed_username, **kwargs)

    def get_context_data(self, viewed_username=None, **kwargs):
        context = super().get_context_data(**kwargs)

        if viewed_username:
            viewed_user = get_object_or_404(User, username=viewed_username)
        else:
            viewed_user = self.request.user

        group_list = ', '.join(
            [group.name for group in viewed_user.groups.all()])
        context['group_list'] = group_list
        context['viewed_user'] = viewed_user
        return context


class UserUpgradeAccount(LoginRequiredMixin, UserPassesTestMixin, View):

    def test_func(self):
        return True

    def dispatch(self, request, *args, **kwargs):
        if request.user.is_superuser:
            messages.error(request, 'You are already a super user')
            return HttpResponseRedirect(reverse('user-profile'))

        if request.user.userprofile.is_pi:
            messages.error(request, 'Your account has already been upgraded')
            return HttpResponseRedirect(reverse('user-profile'))

        return super().dispatch(request, *args, **kwargs)

    def post(self, request):
        if EMAIL_ENABLED:
            send_email_template(
                'Upgrade Account Request',
                'email/upgrade_account_request.txt',
                {'user': request.user},
                request.user.email,
                [EMAIL_TICKET_SYSTEM_ADDRESS]
            )

        messages.success(request, 'Your request has been sent')
        return HttpResponseRedirect(reverse('user-profile'))


class UserSearchHome(LoginRequiredMixin, UserPassesTestMixin, TemplateView):
    template_name = 'user/user_search_home.html'

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        context['user_search_form'] = UserSearchForm()
        return context

    def test_func(self):
        return self.request.user.is_staff


class UserSearchResults(LoginRequiredMixin, UserPassesTestMixin, View):
    template_name = 'user/user_search_results.html'
    raise_exception = True

    def post(self, request):
        user_search_string = request.POST.get('q')

        search_by = request.POST.get('search_by')

        cobmined_user_search_obj = CombinedUserSearch(
            user_search_string, search_by)
        context = cobmined_user_search_obj.search()

        return render(request, self.template_name, context)

    def test_func(self):
        return self.request.user.is_staff


class UserListAllocations(LoginRequiredMixin, UserPassesTestMixin, TemplateView):
    template_name = 'user/user_list_allocations.html'

    def test_func(self):
        return self.request.user.is_superuser or self.request.user.userprofile.is_pi

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)

        user_dict = {}

        for project in Project.objects.filter(pi=self.request.user):
            for allocation in project.allocation_set.filter(status__name='Active'):
                for allocation_user in allocation.allocationuser_set.filter(status__name='Active').order_by('user__username'):
                    if allocation_user.user not in user_dict:
                        user_dict[allocation_user.user] = []

                    user_dict[allocation_user.user].append(allocation)

        context['user_dict'] = user_dict

        return context
