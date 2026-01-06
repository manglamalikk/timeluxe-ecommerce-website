# models.py
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class RegistrationLog(models.Model):
    ACTION_CHOICES = [
        ('register', 'Register'),
        ('login', 'Login'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    action = models.CharField(max_length=10, choices=ACTION_CHOICES)
    timestamp = models.DateTimeField(default=timezone.now)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    email = models.EmailField(blank=True)
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    success = models.BooleanField(default=True)
    extra_info = models.JSONField(default=dict)

    def __str__(self):
        return f"{self.user.username} - {self.get_action_display()} at {self.timestamp}"

    class Meta:
        ordering = ['-timestamp']
        verbose_name = 'User Activity Log'
        verbose_name_plural = 'User Activity Logs'