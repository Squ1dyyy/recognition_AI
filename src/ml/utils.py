import os
from datetime import datetime
from typing import List

import numpy as np
import torch
from PIL import Image


def preprocess_image_to_tensor(
	data: List[float],
	height: int,
	is_perceptron: bool = False,
	save_image: bool = False,
	save_dir: str = "ml/services/saved_images",
) -> torch.Tensor:
	"""Crop, center, and convert pixel vector to a model-ready tensor."""
	arr: np.ndarray = np.array(data, dtype=np.uint8)
	arr = arr.reshape(height, height)

	coords: np.ndarray = np.column_stack(np.where(arr > 0))
	if coords.size > 0:
		y_min, x_min = coords.min(axis=0)
		y_max, x_max = coords.max(axis=0)
		arr = arr[y_min:y_max + 1, x_min:x_max + 1]
	else:
		arr = np.zeros((28, 28), dtype=np.uint8)

	img: Image.Image = Image.fromarray(arr)
	img.thumbnail((20, 20), Image.Resampling.LANCZOS)

	canvas: Image.Image = Image.new('L', (28, 28), color=0)
	paste_x: int = (28 - img.width) // 2
	paste_y: int = (28 - img.height) // 2
	canvas.paste(img, (paste_x, paste_y))

	if save_image:
		if not os.path.exists(save_dir):
			os.makedirs(save_dir)
		timestamp: str = datetime.now().strftime('%Y%m%d_%H%M%S_%f')
		filename: str = os.path.join(save_dir, f"digit_{timestamp}.png")
		canvas.save(filename)

	arr = np.array(canvas, dtype=np.float32)
	tensor: torch.Tensor = torch.from_numpy(arr).unsqueeze(0).unsqueeze(0)
	if is_perceptron:
		tensor = torch.from_numpy(arr).flatten().unsqueeze(0)

	return tensor
