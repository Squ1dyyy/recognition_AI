from typing import Any, Dict, List, Optional

import torch
from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import CanvasSerializer
from .utils import base64_to_pixel_vector
from ml.services.model_loader import model_manager
from ml.utils import preprocess_image_to_tensor
from ml.services.db_queue import DB_QUEUE


class CanvasPredictView(APIView):
	"""Endpoint for digit recognition from canvas image."""

	def post(self, request: Request) -> Response:
		"""Run prediction on submitted canvas image for selected models."""
		data: Dict[str, Any] = request.data
		serializer: CanvasSerializer = CanvasSerializer(data=data)

		if not serializer.is_valid():
			return Response(serializer.errors, status=400)

		validated_data: Dict[str, Any] = serializer.validated_data

		image: Any = validated_data.get("image")
		target: Optional[int] = validated_data.get("target")
		_models: List[str] = validated_data.get("models", ["CNN"])
		result: List[Dict[str, Any]] = []
		pixels, height = base64_to_pixel_vector(image)
		tensor: torch.Tensor = preprocess_image_to_tensor(pixels, height)
		for i, network in enumerate(_models):
			probs, y_pred, layers = model_manager.predict(model_manager.get_model(network), tensor)
			res: Dict[str, Any] = {
				"model": network,
				"digit": y_pred,
				"probabilities": probs,
				"weights": layers
			}

			result.append(res)
			DB_QUEUE.put_nowait({
				"target": target,
				"predict": y_pred,
				"pixels": pixels,
				"network": network
			})

		return Response(result, status=status.HTTP_200_OK)
