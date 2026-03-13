from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator


class Canvas(models.Model):
	"""Stores a single canvas prediction entry."""

	target = models.PositiveSmallIntegerField(
		validators=[
			MinValueValidator(0),
			MaxValueValidator(9)
		], null=True)
	predict = models.PositiveSmallIntegerField(
		validators=[
			MinValueValidator(0),
			MaxValueValidator(9)
		])
	pixels = models.JSONField()
	network = models.CharField(max_length=255, default="")

