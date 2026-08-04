import io
import base64
import qrcode
from typing import Dict, Any


class QRCodeGenerator:
    """
    QR Code Generation & Verification Helper using qrcode and Base64 PNG Encoding.
    """

    @classmethod
    def generate_qr_code_base64(cls, payload_data: str) -> str:
        """Generates a Base64-encoded PNG data URI for a QR code string."""
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_M,
            box_size=10,
            border=4,
        )
        qr.add_data(payload_data)
        qr.make(fit=True)

        img = qr.make_image(fill_color="black", back_color="white")

        buffer = io.BytesIO()
        img.save(buffer, format="PNG")
        img_str = base64.b64encode(buffer.getvalue()).decode("utf-8")
        return f"data:image/png;base64,{img_str}"

    @classmethod
    def verify_qr_payload(cls, payload_data: str) -> bool:
        """Validates QR code payload token format."""
        return payload_data is not None and len(payload_data) > 5
