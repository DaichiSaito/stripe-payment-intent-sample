# config/initializers/stripe.rb
Stripe.api_key = ENV['STRIPE_SECRET_KEY']
Stripe.api_version = '2024-06-20'
