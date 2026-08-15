from __future__ import annotations

from datetime import datetime, timezone
from enum import Enum

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

VALID_CATEGORIES = [
    "job_boards",
    "ats_software",
    "assessment_tools",
    "training_platforms",
    "payroll_and_hr_software",
    "video_interview",
    "background_check",
    "office_and_facilities",
    "it_and_software_licenses",
]

VALID_STATUSES = ["active", "suspended"]

_CATEGORY_SET = set(VALID_CATEGORIES)


class Country(str, Enum):
    SPAIN = "Spain"
    USA = "USA"


class Status(str, Enum):
    ACTIVE = "active"
    SUSPENDED = "suspended"


_STATUS_ALIASES = {
    "active": Status.ACTIVE,
    "activo": Status.ACTIVE,
    "suspended": Status.SUSPENDED,
    "suspendido": Status.SUSPENDED,
}

_CURRENCY_BY_COUNTRY = {
    Country.SPAIN: "EUR",
    Country.USA: "USD",
}


class ProviderBase(BaseModel):
    name: str = Field(min_length=1)
    country: Country
    categories: list[str] = Field(min_length=1)
    monthly_rate: float = Field(gt=0)
    currency: str
    status: Status

    model_config = ConfigDict(str_strip_whitespace=True)

    @field_validator("categories")
    @classmethod
    def validate_categories(cls, categories: list[str]) -> list[str]:
        invalid = [cat for cat in categories if cat not in _CATEGORY_SET]
        if invalid:
            raise ValueError(
                "Invalid categories: "
                f"{invalid}. Valid values: {VALID_CATEGORIES}"
            )
        return categories

    @field_validator("status", mode="before")
    @classmethod
    def normalize_status(cls, value: str | Status) -> Status:
        if isinstance(value, Status):
            return value

        normalized = str(value).strip().lower()
        status = _STATUS_ALIASES.get(normalized)
        if status is None:
            raise ValueError(
                "Invalid status. Use active/suspended or activo/suspendido."
            )
        return status

    @field_validator("currency", mode="before")
    @classmethod
    def normalize_currency(cls, value: str) -> str:
        return str(value).strip().upper()

    @model_validator(mode="after")
    def validate_currency_for_country(self) -> "ProviderBase":
        expected_currency = _CURRENCY_BY_COUNTRY[self.country]
        if self.currency != expected_currency:
            raise ValueError(
                f"Currency for {self.country.value} must be {expected_currency}."
            )
        return self


class ProviderCreate(ProviderBase):
    pass


class ProviderResponse(ProviderBase):
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    model_config = ConfigDict(from_attributes=True)
