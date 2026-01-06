# admin.py
from django.contrib import admin
from .models import RegistrationLog

@admin.register(RegistrationLog)
class RegistrationLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'action', 'timestamp', 'ip_address', 'success')
    list_filter = ('action', 'success', 'timestamp')
    search_fields = ('user__username', 'email', 'first_name', 'last_name', 'ip_address')
    readonly_fields = ('timestamp',)
    fieldsets = (
        ('User Information', {
            'fields': ('user', 'email', 'first_name', 'last_name')
        }),
        ('Activity Details', {
            'fields': ('action', 'timestamp', 'ip_address', 'user_agent', 'success')
        }),
        ('Additional Information', {
            'fields': ('extra_info',),
            'classes': ('collapse',)
        }),
    )