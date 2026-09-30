//
class LegacyBankApi {
  executeTransactionXml(xmlData) {
    console.log(`[Sistema Legado] Processando XML: ${xmlData}`);
    return "<status>200_SUCCESS</status>";
  }
}

//
class PaypalAdapter {
  #legacyApi;

  constructor(legacyApi) {
    this.#legacyApi = legacyApi;
  }

  pay(amount, accountId) {
    //
    const xmlPayload =
      `<transaction><account>${accountId}</account><amount>${amount}</amount></transaction>`;
    const response = this.#legacyApi.executeTransactionXml(xmlPayload);
    return response.includes("200_SUCCESS");
  }
}

//
class BasePayment {
  process(amount) {
    console.log(`Processando pagamento base: R$ ${amount.toFixed(2)}`);
    return amount;
  }
}

//
class PaymentDecorator {
  constructor(decoratedPayment) {
    this.decoratedPayment = decoratedPayment;
  }

  process(amount) {
    return this.decoratedPayment.process(amount);
  }
}

//
class TaxDecorator extends PaymentDecorator {
  process(amount) {
    const tax = amount * 0.05; // 5% de taxa
    console.log(`[TaxDecorator] Adicionando taxa de conveniência: R$ ${tax.toFixed(2)}`);
    return super.process(amount + tax);
  }
}

class AuditDecorator extends PaymentDecorator {
  process(amount) {
    console.log(`[AuditDecorator] Registrando log de auditoria para o valor R$ ${amount.toFixed(2)}`);
    return super.process(amount);
  }
}
class StockService {
  hasStock(productId) { return true; }
}

class AntiFraudService {
  isFraudulent(orderId) { return false; }
}

class CheckoutFacade {
  #stockService = new StockService();
  #antiFraudService = new AntiFraudService();

  processOrder(orderId, productId, amount) {
    if (!this.#stockService.hasStock(productId)) {
      console.log("Erro: Produto sem estoque.");
      return false;
    }

    if (this.#antiFraudService.isFraudulent(orderId)) {
      console.log("Erro: Transação suspeita.");
      return false;
    }

    //
    const payment = new AuditDecorator(new TaxDecorator(new BasePayment()));
    payment.process(amount);

    console.log(`[Facade] Pedido #${orderId} finalizado com sucesso!`);
    return true;
  }
}
const legacyApi = new LegacyBankApi();
const adapter = new PaypalAdapter(legacyApi);
adapter.pay(150.00, "ACC-9988");

const checkout = new CheckoutFacade();
checkout.processOrder("ORD-1001", "PROD-55", 200.00);
