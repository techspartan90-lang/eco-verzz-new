import time
import json
import logging

logger = logging.getLogger("django.request_metadata")

class StructuredLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start_time = time.time()
        
        response = self.get_response(request)
        
        duration = time.time() - start_time
        
        user_id = request.user.id if request.user and request.user.is_authenticated else "Anonymous"
        ip_address = self.get_client_ip(request)
        
        log_data = {
            "user_id": user_id,
            "method": request.method,
            "path": request.path,
            "ip_address": ip_address,
            "status_code": response.status_code,
            "duration_ms": round(duration * 1000, 2)
        }
        
        message = json.dumps(log_data)
        
        if response.status_code >= 500:
            logger.critical(message)
        elif response.status_code >= 400:
            logger.warning(message)
        else:
            logger.info(message)
            
        return response

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
