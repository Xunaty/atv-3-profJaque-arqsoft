//
class SmsNotification {
  send(recipient, message) {
    console.log(`[SMS] Enviando para ${recipient}: ${message}`);
  }
}

class EmailNotification {
  send(recipient, message) {
    console.log(`[E-mail] Enviando para ${recipient}: ${message}`);
  }
}

//
class NotificationFactory {
  //
  createNotification() {
    throw new Error("O método createNotification() deve ser implementado.");
  }

  notify(recipient, message) {
    const notification = this.createNotification();
    notification.send(recipient, message);
  }
}

//
class SmsNotificationFactory extends NotificationFactory {
  createNotification() {
    return new SmsNotification();
  }
}

class EmailNotificationFactory extends NotificationFactory {
  createNotification() {
    return new EmailNotification();
  }
}
class ConfigurationManager {
  static #instance = null;

  constructor() {
    if (ConfigurationManager.#instance) {
      return ConfigurationManager.#instance;
    }

    this.settings = new Map([
      ["API_KEY", "SECRET_KEY_123"],
      ["ENVIRONMENT", "production"]
    ]);

    ConfigurationManager.#instance = this;
  }

  static getInstance() {
    if (!ConfigurationManager.#instance) {
      ConfigurationManager.#instance = new ConfigurationManager();
    }
    return ConfigurationManager.#instance;
  }

  get(key) {
    return this.settings.get(key);
  }
}
class NotificationMessage {
  constructor(recipient, body, priority, scheduleDate) {
    this.recipient = recipient;
    this.body = body;
    this.priority = priority;
    this.scheduleDate = scheduleDate;
  }
}

class NotificationBuilder {
  #recipient = "";
  #body = "";
  #priority = "Normal";
  #scheduleDate = null;

  setRecipient(recipient) {
    this.#recipient = recipient;
    return this; // Permite encadeamento (Fluent Interface)
  }

  setBody(body) {
    this.#body = body;
    return this;
  }

  setPriority(priority) {
    this.#priority = priority;
    return this;
  }

  setScheduleDate(date) {
    this.#scheduleDate = date;
    return this;
  }

  build() {
    if (!this.#recipient || !this.#body) {
      throw new Error("Destinatário e corpo da mensagem são obrigatórios.");
    }
    return new NotificationMessage(
      this.#recipient,
      this.#body,
      this.#priority,
      this.#scheduleDate
    );
  }
}

const emailFactory = new EmailNotificationFactory();
emailFactory.notify("aluno@ifpa.edu.br", "Sua nota foi publicada!");

const config1 = new ConfigurationManager();
const config2 = ConfigurationManager.getInstance();
console.log("Mesma instância Singleton?", config1 === config2); // true

const message = new NotificationBuilder()
  .setRecipient("usuario@dominio.com")
  .setBody("Seu pedido foi enviado com sucesso!")
  .setPriority("High")
  .build();

console.log("Mensagem criada com Builder:", message);
