import logging
from smtplib import SMTPException

from django.conf import settings
from django.core.mail import EmailMessage, send_mail
from django.template.loader import render_to_string
from django.urls import reverse
from django.contrib.auth.models import User

from coldfront.core.utils.common import import_from_settings

logger = logging.getLogger(__name__)
EMAIL_ENABLED = import_from_settings("EMAIL_ENABLED", False)
EMAIL_SUBJECT_PREFIX = import_from_settings("EMAIL_SUBJECT_PREFIX")
EMAIL_DEVELOPMENT_EMAIL_LIST = import_from_settings("EMAIL_DEVELOPMENT_EMAIL_LIST")
EMAIL_SENDER = import_from_settings("EMAIL_SENDER")
EMAIL_TICKET_SYSTEM_ADDRESS = import_from_settings("EMAIL_TICKET_SYSTEM_ADDRESS")
EMAIL_OPT_OUT_INSTRUCTION_URL = import_from_settings("EMAIL_OPT_OUT_INSTRUCTION_URL")
EMAIL_SIGNATURE = import_from_settings("EMAIL_SIGNATURE")
EMAIL_CENTER_NAME = import_from_settings("CENTER_NAME")
CENTER_BASE_URL = import_from_settings("CENTER_BASE_URL")


def send_email(subject, body, sender, receiver_list, cc=[]):
    """Helper function for sending emails"""

    if not EMAIL_ENABLED:
        return

    if len(receiver_list) == 0:
        logger.error("Failed to send email missing receiver_list")
        return

    if len(sender) == 0:
        logger.error("Failed to send email missing sender address")
        return

    if len(EMAIL_SUBJECT_PREFIX) > 0:
        subject = EMAIL_SUBJECT_PREFIX + " " + subject

    if settings.DEBUG:
        receiver_list = EMAIL_DEVELOPMENT_EMAIL_LIST

    if cc and settings.DEBUG:
        cc = EMAIL_DEVELOPMENT_EMAIL_LIST

    try:
        if cc:
            email = EmailMessage(subject, body, sender, receiver_list, cc=cc)
            email.send(fail_silently=False)
        else:
            send_mail(subject, body, sender, receiver_list, fail_silently=False)
    except SMTPException:
        logger.error(
            "Failed to send email to %s from %s with subject %s",
            sender,
            ",".join(receiver_list),
            subject,
        )


def send_email_template(
    subject, template_name, template_context, sender, receiver_list
):
    """Helper function for sending emails from a template"""
    if not EMAIL_ENABLED:
        return

    body = render_to_string(template_name, template_context)

    return send_email(subject, body, sender, receiver_list)


def email_template_context():
    """Basic email template context used as base for all templates"""
    return {
        "center_name": EMAIL_CENTER_NAME,
        "signature": EMAIL_SIGNATURE,
        "opt_out_instruction_url": EMAIL_OPT_OUT_INSTRUCTION_URL,
    }


def build_link(url_path, domain_url=""):
    if not domain_url:
        domain_url = CENTER_BASE_URL
    return f"{domain_url}{url_path}"


def send_admin_email_template(
    subject, template_name, template_context, receiver_list=None
):
    """Helper function for sending admin emails using a template"""
    if receiver_list == None:
        receiver_list = [
            EMAIL_TICKET_SYSTEM_ADDRESS,
        ]
    send_email_template(
        subject, template_name, template_context, EMAIL_SENDER, receiver_list
    )


def send_allocation_admin_email(
    allocation_obj, subject, template_name, url_path="", domain_url=""
):
    """Send allocation admin emails to approvers whose schools match the allocation's project school."""
    if not url_path:
        url_path = reverse("allocation-request-list")

    url = build_link(url_path, domain_url=domain_url)
    pi = allocation_obj.project.pi
    pi_name = f"{pi.first_name} {pi.last_name} ({pi.username})"
    resource_name = allocation_obj.get_parent_resource
    project_school = allocation_obj.project.school

    ctx = email_template_context()
    ctx["pi"] = pi_name
    ctx["resource"] = resource_name
    ctx["url"] = url

    # Get all approvers whose schools include this project's school
    approvers = User.objects.filter(
        userprofile__approver_profile__schools=project_school, is_active=True
    ).distinct()

    # Extract valid email addresses
    recipient_list = [approver.email for approver in approvers if approver.email]

    # Get project managers for the allocation's project
    project_managers = allocation_obj.project.projectuser_set.filter(
        role__name="Manager", status__name__in=["Active", "New"], user__is_active=True
    ).select_related("user")

    # Add manager emails
    for project_user in project_managers:
        if project_user.user.email:
            recipient_list.append(project_user.user.email)

    if recipient_list:
        send_admin_email_template(
            f"{subject}: {pi_name} - {resource_name}",
            template_name,
            ctx,
            receiver_list=recipient_list,  # Send only to matched approvers
        )
        logger.debug(f"Sent admin allocation email to approvers: {recipient_list}")
    else:
        logger.warning(
            f'No approvers found for school "{project_school}" to send allocation email.'
        )


def send_allocation_customer_email(
    allocation_obj, subject, template_name, url_path="", domain_url=""
):
    """Send allocation customer emails"""
    if not url_path:
        url_path = reverse("allocation-detail", kwargs={"pk": allocation_obj.pk})

    url = build_link(url_path, domain_url=domain_url)
    ctx = email_template_context()
    ctx["resource"] = allocation_obj.get_parent_resource
    ctx["url"] = url

    allocation_users = allocation_obj.allocationuser_set.exclude(
        status__name__in=["Removed", "Error"]
    )
    email_receiver_list = []
    for allocation_user in allocation_users:
        if allocation_user.allocation.project.projectuser_set.get(
            user=allocation_user.user
        ).enable_notifications:
            email_receiver_list.append(allocation_user.user.email)

    send_email_template(subject, template_name, ctx, EMAIL_SENDER, email_receiver_list)
