"""
Two-Factor Authentication (TOTP) Utilities.

Provides RFC 6238 compliant time-based one-time password generation
and verification for user accounts that require 2FA.
"""
import pyotp
import base64
import io
from typing import Tuple, Optional


def generate_totp_secret() -> str:
    """Generate a new random base32-encoded TOTP secret."""
    return pyotp.random_base32()


def generate_qr_code_uri(secret: str, username: str, issuer: str = "EcoVerse") -> str:
    """
    Generate an OTPAuth URI for displaying a QR code.
    
    Args:
        secret: The base32-encoded TOTP secret.
        username: The user's username or email.
        issuer: The name of the issuing application.
    
    Returns:
        An otpauth:// URI string suitable for QR code rendering.
    """
    totp = pyotp.TOTP(secret)
    return totp.provisioning_uri(name=username, issuer_name=issuer)


def generate_qr_code_svg(secret: str, username: str, issuer: str = "EcoVerse") -> Optional[str]:
    """
    Generate an SVG QR code image as a base64-encoded data URI.
    
    Requires the qrcode library; falls back gracefully if unavailable.
    
    Args:
        secret: The base32-encoded TOTP secret.
        username: The user's username or email.
        issuer: The name of the issuing application.
    
    Returns:
        A base64-encoded SVG data URI string, or None if qrcode is unavailable.
    """
    try:
        import qrcode
        uri = generate_qr_code_uri(secret, username, issuer)
        
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(uri)
        qr.make(fit=True)
        
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Save to in-memory buffer
        buffer = io.BytesIO()
        img.save(buffer, format="SVG")
        buffer.seek(0)
        
        svg_bytes = buffer.read()
        b64_str = base64.b64encode(svg_bytes).decode("utf-8")
        return f"data:image/svg+xml;base64,{b64_str}"
    except ImportError:
        # Return the provisioning URI so frontend can render its own QR code
        return generate_qr_code_uri(secret, username, issuer)


def verify_totp_token(secret: str, token: str, tolerance: int = 1) -> bool:
    """
    Verify a TOTP token against the provided secret.
    
    Args:
        secret: The base32-encoded TOTP secret.
        token: The 6-digit token to verify.
        tolerance: Number of time steps to look before/after current step.
    
    Returns:
        True if the token is valid, False otherwise.
    """
    if not token or len(token.strip()) != 6:
        return False
    
    totp = pyotp.TOTP(secret)
    return totp.verify(token.strip(), valid_window=tolerance)


def get_current_time_remaining(secret: str) -> int:
    """
    Get the number of seconds remaining in the current TOTP time step.
    
    Args:
        secret: The base32-encoded TOTP secret.
    
    Returns:
        Seconds remaining (typically between 1 and 30).
    """
    totp = pyotp.TOTP(secret)
    return totp.interval - (int(pyotp.utils.time.time()) % totp.interval)

