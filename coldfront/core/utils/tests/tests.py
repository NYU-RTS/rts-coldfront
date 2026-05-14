from django.template import Context, Template
from django.test import RequestFactory, SimpleTestCase
from django.urls import resolve


class NavbarActiveItemTests(SimpleTestCase):
    def test_missing_request_context_returns_empty_string(self):
        template = Template("{% load common_tags %}{% navbar_active_item 'home' request %}")

        rendered = template.render(Context({}))

        self.assertEqual(rendered, "")

    def test_matching_view_returns_active(self):
        template = Template("{% load common_tags %}{% navbar_active_item 'home' request %}")
        request = RequestFactory().get("/")
        request.resolver_match = resolve("/")

        rendered = template.render(Context({"request": request}))

        self.assertEqual(rendered, "active")
