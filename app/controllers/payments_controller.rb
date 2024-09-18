class PaymentsController < ApplicationController
  skip_forgery_protection
  def new

  end

  def create
    begin
      # PaymentIntentを作成
      payment_intent = Stripe::PaymentIntent.create(
        amount: 2000, # 金額（最小通貨単位、例: 円の場合は2000円=2000）
        currency: 'jpy',
        payment_method_types: ['card'],
        )

      render json: { client_secret: payment_intent.client_secret }
    rescue Stripe::StripeError => e
      render json: { error: e.message }, status: 400
    end
  end
end
