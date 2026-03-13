from typing import Optional, Tuple

import torch
from torch import Tensor
from torch.utils.data import Dataset, DataLoader, TensorDataset, ConcatDataset
from torchvision import transforms, datasets


class MNISTDataset(Dataset):
	"""MNIST dataset wrapper with blank-class augmentation."""

	def __init__(
		self,
		root: str = "Data",
		train: bool = True,
		transform: Optional[transforms.Compose] = None,
		download: bool = True,
	) -> None:
		self.dataset = datasets.MNIST(root=root, train=train, transform=transform, download=download)
		self.transform = transform if transform else transforms.ToTensor()
		self.train: bool = train

	def __len__(self) -> int:
		return len(self.dataset)

	def __getitem__(self, index: int) -> Tuple[Tensor, Tensor]:
		img, target = self.dataset[index]
		img = self.transform(img) if self.transform else img
		target = torch.tensor(target, dtype=torch.long)
		return img, target

	def create_dataloader(self, batch_size: int = 64, shuffle: bool = True) -> DataLoader:
		"""Create a DataLoader with blank-image samples appended."""
		pixels: int = 28
		blank_label: int = 10
		count_img: int = 6000 if self.train else 0

		img_tensors: Tensor = torch.zeros((count_img, 1, pixels, pixels))
		target_tensors: Tensor = torch.full((count_img,), blank_label, dtype=torch.long)
		blank_dataset: TensorDataset = TensorDataset(img_tensors, target_tensors)

		combined_ds: ConcatDataset = ConcatDataset([self, blank_dataset])
		return DataLoader(dataset=combined_ds, batch_size=batch_size, shuffle=shuffle)


train_loader_mnist: DataLoader = MNISTDataset().create_dataloader(batch_size=128)
test_loader_mnist: DataLoader = MNISTDataset(train=False).create_dataloader(batch_size=128, shuffle=False)
