import datetime as dt

from django import forms
from django.core.exceptions import ValidationError
from django.forms import BaseFormSet


class PublicationAddForm(forms.Form):
    title = forms.CharField(max_length=1024, required=True)
    author = forms.CharField(max_length=1024, required=True)
    year = forms.IntegerField(min_value=1500, max_value=2090, required=True)
    journal = forms.CharField(max_length=1024, required=True)
    source = forms.CharField(widget=forms.HiddenInput())  # initialized by view


class PublicationSearchForm(forms.Form):
    search_id = forms.CharField(label="Search ID", widget=forms.Textarea, required=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["search_id"].help_text = "<br/>Enter ID such as DOI or Bibliographic Code to search."


class PublicationResultForm(forms.Form):
    title = forms.CharField(max_length=1024, disabled=True)
    author = forms.CharField(disabled=True)
    year = forms.IntegerField(disabled=True)
    journal = forms.CharField(max_length=1024, disabled=True)
    unique_id = forms.CharField(max_length=255, disabled=True)
    source_pk = forms.IntegerField(widget=forms.HiddenInput(), disabled=True)
    selected = forms.BooleanField(initial=False, required=False)


class PublicationResultFormset(BaseFormSet):
    def clean(self):
        """Checks that no two articles have the same title."""
        if any(self.errors):
            # Don't bother validating the formset unless each form is valid on its own
            return
        curr_year = dt.datetime.today().year
        for form in self.forms:
            year = form.cleaned_data.get("year")
            if year < curr_year - 1:
                raise ValidationError(
                    f"Publication year entered is: {year}. Please add recent publications (this year and previous year) only!"
                )

            if year > curr_year:
                raise ValidationError(
                    f"Publication year entered is: {year} which is in the future. Please fix it.",
                )


class PublicationDeleteForm(forms.Form):
    title = forms.CharField(max_length=255, disabled=True)
    year = forms.CharField(max_length=30, disabled=True)
    selected = forms.BooleanField(initial=False, required=False)


class PublicationExportForm(forms.Form):
    title = forms.CharField(max_length=255, disabled=True)
    year = forms.CharField(max_length=30, disabled=True)
    unique_id = forms.CharField(max_length=255, disabled=True)
    selected = forms.BooleanField(initial=False, required=False)
