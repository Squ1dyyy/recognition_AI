import base64
from io import BytesIO
from typing import List, Tuple

import numpy as np
from PIL import Image


def base64_to_pixel_vector(
    data_url: str,
    target_size: Tuple[int, int] = (28, 28),
    show: bool = False,
) -> Tuple[List[float], int]:
    """Decode base64 data-URL into a normalized pixel vector and image width."""
    base64_data: str = data_url.split(',', 1)[1]
    image_data: bytes = base64.b64decode(base64_data)

    image: Image.Image = Image.open(BytesIO(image_data))

    if image.mode != 'L':
        image = image.convert('L')

    image = image.resize(target_size, Image.Resampling.LANCZOS)

    if show:
        image.show()

    pixel_array: np.ndarray = np.array(image)
    pixel_vector: List[float] = (pixel_array.flatten() / 255.0).tolist()
    return pixel_vector, target_size[0]


def pixels_to_image_base64(pixels: List[float], scale: int = 10) -> str:
    """Convert pixel array to a base64-encoded PNG string."""
    arr: np.ndarray = np.array(pixels, dtype=np.float32)

    arr = arr - arr.min()
    if arr.max() > 0:
        arr = arr / arr.max()
    arr = (arr * 255).astype(np.uint8)

    if arr.ndim == 1:
        size: int = int(np.sqrt(arr.size))
        if size * size != arr.size:
            raise ValueError("Pixel array is not square")
        arr = arr.reshape((size, size))
    elif arr.ndim == 3:
        arr = arr[0] if arr.shape[0] <= 4 else arr[..., 0]

    img: Image.Image = Image.fromarray(arr, mode='L')

    w, h = img.size
    img = img.resize((w * scale, h * scale), Image.NEAREST)

    buffer: BytesIO = BytesIO()
    img.save(buffer, format='PNG')
    return base64.b64encode(buffer.getvalue()).decode()