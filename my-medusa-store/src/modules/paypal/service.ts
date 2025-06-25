import { AbstractPaymentProvider } from "@medusajs/framework/utils"
import type {
  InitiatePaymentInput,
  InitiatePaymentOutput,
  AuthorizePaymentInput,
  AuthorizePaymentOutput,
  CapturePaymentInput,
  CapturePaymentOutput,
  CancelPaymentInput,
  CancelPaymentOutput,
  UpdatePaymentInput,
  UpdatePaymentOutput,
  RefundPaymentInput,
  RefundPaymentOutput,
  PaymentSessionStatus,
} from "@medusajs/framework/types"

export type PayPalProviderOptions = {
  sandbox?: boolean
  client_id: string
  client_secret: string
  auth_webhook_id?: string
}

class PayPalProviderService extends AbstractPaymentProvider<PayPalProviderOptions> {
  static identifier = "paypal"

  async initiatePayment(
    input: InitiatePaymentInput
  ): Promise<InitiatePaymentOutput> {
    // In a real provider we'd call PayPal Orders API here.
    // For now we just return a dummy id and store the cart total.
    const id = `pp_dummy_${Date.now()}`
    return {
      id,
      data: {
        id,
        amount: input.amount,
        currency_code: input.currency_code,
      },
    }
  }

  async authorizePayment(
    input: AuthorizePaymentInput
  ): Promise<AuthorizePaymentOutput> {
    // Assume payment authorised immediately in sandbox.
    return {
      data: input.data,
      status: "authorized" as PaymentSessionStatus,
    }
  }

  async capturePayment(
    _input: CapturePaymentInput
  ): Promise<CapturePaymentOutput> {
    // Auto-capture for demo.
    return {
      data: _input.data,
    }
  }

  async cancelPayment(
    _input: CancelPaymentInput
  ): Promise<CancelPaymentOutput> {
    return { data: _input.data }
  }

  async updatePayment(
    _input: UpdatePaymentInput
  ): Promise<UpdatePaymentOutput> {
    return { data: _input.data }
  }

  async refundPayment(
    _input: RefundPaymentInput
  ): Promise<RefundPaymentOutput> {
    return { data: _input.data }
  }

  async deletePayment(input: CancelPaymentInput): Promise<CancelPaymentOutput> {
    return { data: input.data }
  }

  async getPaymentStatus() {
    return { status: "authorized" as PaymentSessionStatus }
  }

  async retrievePayment() {
    return {}
  }

  async getWebhookActionAndData(_payload: any) {
    return { action: "not_supported" as any, data: _payload }
  }
}

export default PayPalProviderService 