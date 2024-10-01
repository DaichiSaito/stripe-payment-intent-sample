class PaymentsController < ApplicationController
  skip_forgery_protection
  def new
    payment_intent = Stripe::PaymentIntent.create(
      amount: 2000, # 金額（最小通貨単位、例: 円の場合は2000円=2000）
      currency: 'jpy',
      payment_method_types: ['card'],
      payment_method_options: {
        card: {
          request_three_d_secure: 'any' # 3DSを強制的に要求
        }
      },
    )
    # もし既存カードで払いたいのであれば
    # Stripe::PaymentIntent.create(amount: 2000, currency: 'jpy', customer: 'cus_Qv8QyAzN0Q8vSp', payment_method: 'pm_1Q3IAGBzEuhVSuLe
    # l0XQa2wt')
    # みたいな感じでcustomerとpayment_methodを指定する。で、JS側ではpayment_method: { card: this.card }はいらない
    @client_secret = payment_intent.client_secret
  end

  # def create
  #   begin
  #     # PaymentIntentを作成
  #     payment_intent = Stripe::PaymentIntent.create(
  #       amount: 2000, # 金額（最小通貨単位、例: 円の場合は2000円=2000）
  #       currency: 'jpy',
  #       payment_method_types: ['card'],
  #       payment_method_options: {
  #         card: {
  #           request_three_d_secure: 'any' # 3DSを強制的に要求
  #         }
  #       },
  #     )
  #
  #     render json: { client_secret: payment_intent.client_secret, id: payment_intent.id }
  #   rescue Stripe::StripeError => e
  #     render json: { error: e.message }, status: 400
  #   end
  # end

  def success

  end
end
