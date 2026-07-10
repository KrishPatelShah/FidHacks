from functools import cached_property

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Financial Garden API"
    app_env: str = "development"
    database_url: str = "postgresql+psycopg://financial_garden:financial_garden@db:5432/financial_garden"
    backend_cors_origins: str = "http://localhost:19006,http://localhost:8081,http://localhost:3000"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    @cached_property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.backend_cors_origins.split(",") if origin.strip()]


settings = Settings()
