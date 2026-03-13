from django.apps import AppConfig


class ApiV1Config(AppConfig):
    """API v1 application config. Starts DB worker threads on ready."""

    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api_v1'

    def ready(self) -> None:
        from ml.services.db_queue import start_db_workers
        start_db_workers(n=2)