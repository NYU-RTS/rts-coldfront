# Generated by Django 4.2.11 on 2025-03-21 03:47

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("project", "0002_historicalproject_slurm_account_names_and_more"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="historicalproject",
            name="slurm_account_names",
        ),
        migrations.RemoveField(
            model_name="project",
            name="slurm_account_names",
        ),
    ]
