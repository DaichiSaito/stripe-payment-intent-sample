import { Controller } from "@hotwired/stimulus"
import { loadStripe } from "@stripe/stripe-js"

// Connects to data-controller="payment"
export default class extends Controller {
  static targets = ["cardElement", "errorMessage", "submitButton"]
  static values = { stripePublicKey: String, clientSecret: String }

  async connect() {
    // Stripeの公開可能キーを使用してStripeオブジェクトを非同期に初期化
    this.stripe = await loadStripe(this.stripePublicKeyValue)
    this.elements = this.stripe.elements()

    // カード要素を作成
    this.card = this.elements.create('card')
    this.card.mount(this.cardElementTarget)

    // カード要素のエラーハンドリング
    this.card.addEventListener('change', (event) => {
      if (event.error) {
        this.errorMessageTarget.textContent = event.error.message
      } else {
        this.errorMessageTarget.textContent = ''
      }
    })
  }

  // submit(event) {
  //   event.preventDefault()
  //   this.submitButtonTarget.disabled = true
  //
  //   // サーバーからPaymentIntentのclient_secretを取得
  //   fetch('/payments', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       // 'X-CSRF-Token': csrfToken()
  //     },
  //     body: JSON.stringify({})
  //   })
  //       .then(response => response.json())
  //       .then(data => {
  //           console.log("Data:", data)
  //         if (data.error) {
  //           this.errorMessageTarget.textContent = data.error
  //           this.submitButtonTarget.disabled = false
  //         } else {
  //           this.handlePayment(data.client_secret, data.id)
  //         }
  //       })
  //       .catch(error => {
  //         console.error('Error:', error)
  //         this.errorMessageTarget.textContent = 'サーバーとの通信中にエラーが発生しました。'
  //         this.submitButtonTarget.disabled = false
  //       })
  // }

    submit(event) {
        event.preventDefault()
        this.submitButtonTarget.disabled = true

        this.handlePayment(this.clientSecretValue, "fuga")
    }
  handlePayment(clientSecret, paymentIntentId) {
    // 決済の確認
    this.stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: this.card },
      // return_url: 'http://localhost:3000/payments/success?payment_intent_id=' + paymentIntentId
    })
        .then(result => {
          console.log("Result1:", result)
          if (result.error) {
            // エラーメッセージを表示
            this.errorMessageTarget.textContent = result.error.message
            this.submitButtonTarget.disabled = false

            // 追加: 3DS認証が必要な場合の処理
            if (result.error.payment_intent && result.error.payment_intent.status === 'requires_action') {
              this.handleCardAction(result.error.payment_intent.client_secret)
            }
          } else {
            if (result.paymentIntent.status === 'succeeded') {
              // 支払い成功時の処理
              alert('支払いが完了しました！')
            } else if (result.paymentIntent.status === 'requires_action') {
              // 3DS認証が必要な場合
              this.handleCardAction(clientSecret)
            }
          }
        })
        .catch(error => {
          console.error('Error:', error)
          this.errorMessageTarget.textContent = '決済処理中にエラーが発生しました。'
          this.submitButtonTarget.disabled = false
        })
  }

  handleCardAction(clientSecret) {
    this.stripe.handleCardAction(clientSecret)
        .then(result => {
            console.log("Result2:", result)
          if (result.error) {
            // 認証が失敗した場合の処理
            this.errorMessageTarget.textContent = result.error.message
            this.submitButtonTarget.disabled = false
          } else {
            if (result.paymentIntent.status === 'succeeded') {
              // 認証後に支払いが成功した場合
              alert('支払いが完了しました！')
            } else {
              // その他のステータスの場合
              this.errorMessageTarget.textContent = '支払いに失敗しました。'
              this.submitButtonTarget.disabled = false
            }
          }
        })
        .catch(error => {
          console.error('Error:', error)
          this.errorMessageTarget.textContent = '認証処理中にエラーが発生しました。'
          this.submitButtonTarget.disabled = false
        })
  }


}
