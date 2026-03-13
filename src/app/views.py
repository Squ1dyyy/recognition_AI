from django.http import HttpRequest, HttpResponse, JsonResponse
from django.shortcuts import render
from django.template import TemplateDoesNotExist


def index(request: HttpRequest) -> HttpResponse:
	"""Render the landing page."""
	return render(request, "index.html")


def nn_2d(request: HttpRequest) -> HttpResponse:
	"""Render the 2D neural network visualization page."""
	return render(request, "2d.html")


def nn_3d(request: HttpRequest) -> HttpResponse:
	"""Render the 3D neural network visualization page."""
	return render(request, "3d.html")


def app(request: HttpRequest) -> HttpResponse:
	"""Render the main application page."""
	return render(request, "app.html")


def text(request: HttpRequest) -> HttpResponse:
	"""Render the text content page."""
	return render(request, "text.html")


def aboutproject(request: HttpRequest) -> HttpResponse:
	"""Render the about-project page."""
	return render(request, "aboutproject.html")


def load_section(request: HttpRequest, section_id: str) -> HttpResponse:
	"""Load a section template by ID or return 404."""
	try:
		return render(request, f"sections/{section_id}.html")
	except TemplateDoesNotExist:
		return render(request, "404.html", status=404)


def animation(request: HttpRequest, animation_name: str) -> HttpResponse:
	"""Load an animation template by name or return 404."""
	try:
		return render(request, f"{animation_name}.html")
	except TemplateDoesNotExist:
		return render(request, "404.html", status=404)


def test(request: HttpRequest) -> JsonResponse:
	"""Health-check endpoint."""
	return JsonResponse(dict(status_code=200))
