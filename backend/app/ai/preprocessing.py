import os
import cv2
import numpy as np
from PIL import Image, ImageOps
from typing import Tuple, Dict, Any


class ImagePreprocessor:
    """
    OpenCV & Pillow Image Preprocessing Module for EcoVerzz AI.
    Handles resizing, normalization, noise removal, EXIF orientation, and color space conversion.
    """

    @classmethod
    def load_and_preprocess(cls, image_path: str, target_size: Tuple[int, int] = (640, 640)) -> Tuple[np.ndarray, Dict[str, Any]]:
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Image not found at path: {image_path}")

        # 1. Read image via OpenCV
        img_bgr = cv2.imread(image_path)
        if img_bgr is None:
            # Fallback to Pillow if OpenCV fails
            pil_img = Image.open(image_path)
            pil_img = ImageOps.exif_transpose(pil_img)
            if pil_img.mode != "RGB":
                pil_img = pil_img.convert("RGB")
            img_bgr = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)

        orig_height, orig_width = img_bgr.shape[:2]

        # 2. Denoise & Color Correction
        denoised = cv2.fastNlMeansDenoisingColored(img_bgr, None, 5, 5, 7, 21)

        # 3. Resize to YOLOv8 target input dimensions (e.g. 640x640)
        resized = cv2.resize(denoised, target_size, interpolation=cv2.INTER_AREA)

        # 4. Normalize pixel values [0, 1]
        normalized = resized.astype(np.float32) / 255.0

        metadata = {
            "orig_width": orig_width,
            "orig_height": orig_height,
            "target_width": target_size[0],
            "target_height": target_size[1],
        }

        return normalized, metadata
