import os
import uuid
from PIL import Image, ImageOps
from fastapi import UploadFile, HTTPException, status
from typing import Dict, Any, Tuple

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads", "waste_images")
THUMBNAIL_DIR = os.path.join(UPLOAD_DIR, "thumbnails")

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(THUMBNAIL_DIR, exist_ok=True)

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
ALLOWED_MIME_TYPES = {"image/jpeg", "image/jpg", "image/png", "image/webp"}
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB limit


class ImageProcessor:
    """
    Pillow Image Processor for EcoVerzz AI Waste Reporting.
    Validates size <= 10MB, mime type, corruption check, resizes, compresses, and generates thumbnails.
    """

    @classmethod
    def validate_file(cls, file: UploadFile, file_bytes: bytes) -> None:
        if len(file_bytes) > MAX_FILE_SIZE_BYTES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Image file size exceeds maximum 10 MB limit."
            )

        filename = file.filename or ""
        ext = os.path.splitext(filename)[1].lower()
        if ext not in ALLOWED_EXTENSIONS or file.content_type not in ALLOWED_MIME_TYPES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported image format '{ext}'. Allowed formats: JPG, JPEG, PNG, WEBP."
            )

    @classmethod
    def save_and_process_image(cls, file: UploadFile, file_bytes: bytes) -> Dict[str, Any]:
        cls.validate_file(file, file_bytes)

        file_uuid = str(uuid.uuid4())
        filename = f"{file_uuid}.jpg"
        full_path = os.path.join(UPLOAD_DIR, filename)
        thumb_path = os.path.join(THUMBNAIL_DIR, f"thumb_{filename}")

        try:
            # Check for corruption using Pillow
            import io
            image = Image.open(io.BytesIO(file_bytes))
            image.verify()  # Verify integrity

            # Re-open for image manipulation after verify()
            image = Image.open(io.BytesIO(file_bytes))
            image = ImageOps.exif_transpose(image)  # Preserve EXIF orientation

            # Convert RGBA to RGB for JPEG saving
            if image.mode in ("RGBA", "P"):
                image = image.convert("RGB")

            # 1. Resize & Compress Full Image (Max 1920x1080)
            full_img = image.copy()
            full_img.thumbnail((1920, 1080), Image.Resampling.LANCZOS)
            full_img.save(full_path, "JPEG", quality=85, optimize=True)

            # 2. Generate Thumbnail (Max 300x300)
            thumb_img = image.copy()
            thumb_img.thumbnail((300, 300), Image.Resampling.LANCZOS)
            thumb_img.save(thumb_path, "JPEG", quality=80, optimize=True)

            relative_photo_url = f"/uploads/waste_images/{filename}"
            relative_thumb_url = f"/uploads/waste_images/thumbnails/thumb_{filename}"

            return {
                "filename": filename,
                "file_path": full_path,
                "thumbnail_path": thumb_path,
                "photo_url": relative_photo_url,
                "thumbnail_url": relative_thumb_url,
                "file_size": len(file_bytes),
                "width": image.width,
                "height": image.height,
                "mime_type": "image/jpeg",
            }
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid or corrupted image file: {str(e)}"
            )
