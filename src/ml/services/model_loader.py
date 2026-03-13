from pathlib import Path
from typing import Dict, List, Optional, Tuple, Union

import torch
from torch import nn

from .networks import REGISTRY


class ModelManager:
	"""Loads and manages neural network models for inference."""

	def __init__(self, models_dir: Optional[str] = None, device: str = 'cpu') -> None:
		if models_dir is None:
			current_dir: Path = Path(__file__).parent
			self.models_dir: Path = current_dir / "db_pth"
		else:
			self.models_dir = Path(models_dir)

		self.device: str = device
		self.models: Dict[str, nn.Module] = {}
		self._load_all_models()

	def _load_all_models(self) -> None:
		"""Load all registered model weights from disk."""
		for name, model_class in REGISTRY.items():
			model: nn.Module = model_class()
			model_path: Path = self.models_dir / f"{name}.pth"

			if model_path.exists():
				try:
					state_dict = torch.load(model_path, map_location=self.device)
					model.load_state_dict(state_dict)
					print(f"+ {name} ")
				except Exception as e:
					print(f"{name}: {type(e).__name__} → {e}")
			else:
				print(f"{name}.pth not found")

			model.to(self.device)
			model.eval()
			self.models[name] = model

	def get_model(self, model_name: str) -> nn.Module:
		"""Return a loaded model by name."""
		if model_name not in self.models:
			raise ValueError(f"Model {model_name} not found. Available: {list(self.models.keys())}")
		return self.models[model_name]

	def get_available_models(self) -> List[str]:
		"""Return list of available model names."""
		return list(self.models.keys())

	def predict(self, model: nn.Module, data: Union[List[float], torch.Tensor]) -> Tuple[Dict[int, float], int, dict]:
		"""Run inference and return probabilities, predicted digit, and layer activations."""
		if isinstance(data, list):
			data = torch.tensor(data, dtype=torch.float32)

		if data.dim() == 1:
			data = data.unsqueeze(0)

		with torch.no_grad():
			output: torch.Tensor = model(data)
			probs_tensor: torch.Tensor = torch.softmax(output, dim=1)
			pred_class: int = torch.argmax(probs_tensor, dim=1).item()

			probs_list = probs_tensor.squeeze().tolist()
			if not isinstance(probs_list, list):
				probs_list = [probs_list]
			probs_dict: Dict[int, float] = {i: prob for i, prob in enumerate(probs_list)}

			return probs_dict, pred_class, model.activations


model_manager: ModelManager = ModelManager()

