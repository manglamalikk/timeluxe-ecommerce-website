# views.py
from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate
from .forms import RegisterForm, LoginForm
from .models import RegistrationLog
from django.contrib.auth.models import User

def register_view(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            
            # Debug print to verify we reach this point
            print("Creating registration log for user:", user.username)
            
            try:
                RegistrationLog.objects.create(
                    user=user,
                    action='register',
                    ip_address=request.META.get('REMOTE_ADDR'),
                    user_agent=request.META.get('HTTP_USER_AGENT', ''),
                    email=form.cleaned_data['email'],
                    first_name=form.cleaned_data['first_name'],
                    last_name=form.cleaned_data['last_name'],
                    extra_info={
                        'username': form.cleaned_data['username'],
                        'registration_method': 'email',
                    }
                )
                print("Registration log created successfully")
            except Exception as e:
                print("Error creating registration log:", str(e))
            
            login(request, user)
            return redirect('home')
        else:
            print("Form errors:", form.errors)
    else:
        form = RegisterForm()
    return render(request, 'register.html', {'form': form})

def login_view(request):
    if request.method == 'POST':
        form = LoginForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            
            RegistrationLog.objects.create(
                user=user,
                action='login',
                ip_address=request.META.get('REMOTE_ADDR'),
                user_agent=request.META.get('HTTP_USER_AGENT', ''),
                email=user.email,
                first_name=user.first_name,
                last_name=user.last_name,
                extra_info={
                    'login_method': 'email',
                }
            )
            
            return redirect('home')
        else:
            # Log failed login attempts
            username = form.cleaned_data.get('username')
            try:
                user = User.objects.get(username=username)
            except User.DoesNotExist:
                user = None
                
            RegistrationLog.objects.create(
                user=user,
                action='login',
                ip_address=request.META.get('REMOTE_ADDR'),
                user_agent=request.META.get('HTTP_USER_AGENT', ''),
                email=user.email if user else '',
                first_name=user.first_name if user else '',
                last_name=user.last_name if user else '',
                success=False,
                extra_info={
                    'error': 'Invalid credentials',
                    'username_attempt': username,
                }
            )
    else:
        form = LoginForm()
    return render(request, 'login.html', {'form': form})

def home_view(request):
    return render(request, 'index.html')

def about_view(request):
    return render(request, 'about.html')

def contact_view(request):
    return render(request, 'contact.html')

def products_view(request):
    return render(request, 'products.html')

def cart_view(request):
    return render(request, 'cart.html')

def checkout_view(request):
    return render(request, 'checkout.html')

def faq_view(request):
    return render(request, 'FAQ.html')
