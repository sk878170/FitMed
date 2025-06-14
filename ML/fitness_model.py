import torch
import torch.nn as nn

# Define the fitness recommendation model
class FitnessModel(nn.Module):
    def __init__(self, input_size):
        super(FitnessModel, self).__init__()
        self.shared = nn.Sequential(
            nn.Linear(input_size, 64),
            nn.ReLU(),
            nn.Linear(64, 32),
            nn.ReLU()
        )
        self.reg_head = nn.Linear(32, 2)  # For session duration & fat percentage
        self.cls_head = nn.Linear(32, 4)  # For workout type (2 classes) & BMI (2 classes)

    def forward(self, x):
        shared_features = self.shared(x)
        reg_output = self.reg_head(shared_features)
        cls_output = self.cls_head(shared_features)
        return reg_output, cls_output


