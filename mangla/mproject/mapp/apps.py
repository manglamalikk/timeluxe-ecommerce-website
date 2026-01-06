from django.apps import AppConfig


class MappConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'mapp'
    verbose_name = 'User Activity Logging'  # Optional: adds a human-readable name