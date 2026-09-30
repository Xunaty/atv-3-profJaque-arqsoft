# Atividade Prática da Unidade III: Padrões de Projeto

- **Aluno:** Israel Martins de Moura Barros
- **Matrícula:** 2023082824
- **Disciplina:** Arquitetura de Software - Prof. Jacqueline Teixeira

---

## O que a atividade pede

São quatro blocos de código JavaScript, e pra cada um é preciso dizer a função do bloco, o tipo de sistema a que ele pertence e qual padrão de projeto da Unidade III aparece nele.

Os arquivos `atividade1.js` a `atividade4.js` são os blocos da professora, sem nenhuma alteração. Cada um foi executado com o Node pra conferir o que ele faz de verdade, e a saída que aparece no fim de cada seção é a que o terminal mostrou.

## Como executar

Basta ter o Node instalado, sem nenhuma dependência. Dentro da pasta do projeto, `node atividade1.js` roda o primeiro bloco, e o mesmo vale pros outros três trocando o número do arquivo.

---

## Resumo dos padrões

| Bloco | Tipo de sistema | Trecho | Padrão | Categoria |
| --- | --- | --- | --- | --- |
| 1 | Módulo de notificações | Escolha do canal de envio | Factory Method | Criacional |
| 1 | Módulo de notificações | Configurações globais | Singleton | Criacional |
| 1 | Módulo de notificações | Montagem da mensagem | Builder | Criacional |
| 2 | Checkout de ecommerce | Integração com o banco legado | Adapter | Estrutural |
| 2 | Checkout de ecommerce | Taxa e auditoria do pagamento | Decorator | Estrutural |
| 2 | Checkout de ecommerce | Fechamento do pedido | Facade | Estrutural |
| 3 | App de corridas | Cálculo da tarifa | Strategy | Comportamental |
| 3 | App de corridas | Situação do motorista | State | Comportamental |
| 3 | App de corridas | Rastreamento da localização | Observer | Comportamental |
| 4 | Sistema acadêmico | Sala de aula | Active Record | Arquitetura corporativa |
| 4 | Sistema acadêmico | Aluno e regra de negócio | Data Mapper | Arquitetura corporativa |
| 4 | Sistema acadêmico | Busca de alunos | Repository | Arquitetura corporativa |
| 4 | Sistema acadêmico | Resposta da API | DTO | Arquitetura corporativa |

---

## Atividade 1

**Tipo de sistema.** Módulo de notificações de um sistema web, do tipo que existe
em qualquer portal acadêmico ou loja virtual. As mensagens de exemplo do próprio
código ("Sua nota foi publicada!" e "Seu pedido foi enviado com sucesso!")
mostram isso. É a parte que avisa o usuário por e-mail ou SMS, guarda as
configurações gerais (chave de API e ambiente) e monta a mensagem antes do envio.

**Função do bloco.** Define dois canais de envio, SMS e e-mail, e um jeito de
escolher entre eles sem o resto do sistema conhecer as classes concretas. Junto
disso tem um gerenciador de configurações que só pode existir uma vez e um
montador de mensagens com destinatário, corpo, prioridade e data de agendamento.
No fim, o código manda um e-mail avisando da nota, confere que as duas formas de
pegar o gerenciador devolvem o mesmo objeto e cria uma mensagem de prioridade
alta.

**Trecho 1: escolha do canal de envio (Factory Method, criacional).** A
`NotificationFactory` é a classe criadora. Ela tem o `createNotification()`, que
na base só lança um erro dizendo que precisa ser implementado, e o `notify()`,
que chama o `createNotification()` e usa o que vier pra enviar, sem saber se é
SMS ou e-mail. Quem decide é a subclasse; a `SmsNotificationFactory` devolve um
`SmsNotification` e a `EmailNotificationFactory` devolve um `EmailNotification`.
Por isso o padrão é o **Factory Method**, já que a criação do objeto fica num
método que as subclasses sobrescrevem e quem usa só chama o `notify()`. Se
aparecer um canal novo, como WhatsApp, basta criar a classe da notificação e a
fábrica dela, sem mexer em nenhuma das que já existem. Não chega a ser Abstract
Factory porque cada fábrica cria um produto só, e esse outro padrão cria famílias
de produtos que combinam entre si.

**Trecho 2: configurações globais (Singleton, criacional).** O
`ConfigurationManager` guarda as configurações num `Map` e garante que exista uma
instância só, por meio do campo estático privado `#instance`. O construtor
devolve a instância que já existe se houver uma, e o `getInstance()` só cria a
primeira quando o campo ainda está vazio. Isso é o **Singleton**. Dá pra comparar
com o painel de configurações de um aplicativo, que existe uma vez só e todas as
telas consultam o mesmo, o que faz sentido pra uma chave de API que não pode
ficar duplicada pelo sistema. A prova está no `console.log` que vem depois, que
compara o `config1`, criado com `new`, com o `config2`, vindo do `getInstance()`,
e imprime `true`. Um detalhe de JavaScript é que o construtor pode devolver um
objeto, então até o `new ConfigurationManager()` devolve a instância existente; em
Java, por exemplo, o construtor seria privado.

**Trecho 3: montagem da mensagem (Builder, criacional).** O
`NotificationBuilder` monta um `NotificationMessage` por etapas. Cada `set` guarda
o valor e devolve `this`, então as chamadas podem ser encadeadas (interface
fluente), e o `build()` só cria a mensagem no final, depois de conferir que
destinatário e corpo foram preenchidos. A prioridade já começa como `"Normal"` e
a data de agendamento como `null`, por isso na chamada do fim bastou informar
destinatário, corpo e prioridade. O padrão é o **Builder**. Sem ele, o
`NotificationMessage` teria que ser criado com um construtor de quatro parâmetros
em ordem fixa, e quem não quisesse agendar teria que passar `null` na mão, que é o
chamado construtor telescópico.

Saída ao rodar `node atividade1.js`:

```text
[E-mail] Enviando para aluno@ifpa.edu.br: Sua nota foi publicada!
Mesma instância Singleton? true
Mensagem criada com Builder: NotificationMessage {
  recipient: 'usuario@dominio.com',
  body: 'Seu pedido foi enviado com sucesso!',
  priority: 'High',
  scheduleDate: null
}
```

---

## Atividade 2

**Tipo de sistema.** Ecommerce, no módulo de pagamento e fechamento de pedido
(checkout). O código fala de pedido, produto, estoque, antifraude e conta do
cliente, e ainda precisa conversar com um banco antigo que só entende XML.

**Função do bloco.** Liga a loja a um sistema bancário legado, calcula o valor a
pagar com taxa de conveniência e auditoria e concentra o fechamento do pedido num
método só, que confere estoque e fraude antes de cobrar. Ao rodar, o pagamento de
R$ 150,00 vai pro banco legado convertido em XML, e o pedido de R$ 200,00 passa
pela auditoria, ganha R$ 10,00 de taxa e é processado por R$ 210,00.

**Trecho 1: integração com o banco legado (Adapter, estrutural).** A
`LegacyBankApi` só sabe receber XML, pelo `executeTransactionXml()`, e responde
com outro XML. A loja quer chamar algo mais simples, o `pay(amount, accountId)`,
que devolva verdadeiro ou falso. O `PaypalAdapter` faz a ponte, pois guarda a API
legada, monta o XML com conta e valor dentro do `pay()`, chama o método antigo e
transforma a resposta num booleano com o `includes("200_SUCCESS")`. Esse é o
**Adapter**. O nome engana um pouco, porque diz Paypal e o que ele adapta é a API
do banco, mas o ponto é que a classe antiga não foi alterada, só ganhou uma
interface compatível com a que o cliente espera, como um adaptador de tomada.

**Trecho 2: taxa e auditoria do pagamento (Decorator, estrutural).** O
`BasePayment` só processa o valor. O `PaymentDecorator` tem o mesmo método
`process()`, guarda outro pagamento por dentro e repassa a chamada pra ele, e o
`TaxDecorator` e o `AuditDecorator` herdam dele e acrescentam a própria parte
antes de repassar, um somando 5% de taxa e o outro registrando o log. No
`CheckoutFacade` as três classes são empilhadas em
`new AuditDecorator(new TaxDecorator(new BasePayment()))`. O padrão é o
**Decorator**, que vai colocando responsabilidades em camadas, como quem
acrescenta ingredientes num lanche, em vez de criar uma subclasse pra cada
combinação (pagamento com taxa e auditoria, só com taxa, só com auditoria). A
ordem das camadas importa; como a auditoria é a de fora, ela registra R$ 200,00
antes da taxa entrar, e o pagamento base recebe R$ 210,00.

**Trecho 3: fechamento do pedido (Facade, estrutural).** O `CheckoutFacade`
expõe um método só, o `processOrder()`, e por dentro usa o `StockService`, o
`AntiFraudService` e a pilha de decorators. Quem chama o checkout não precisa
saber que existe estoque, antifraude nem taxa, só passa pedido, produto e valor e
recebe `true` ou `false`. É o **Facade**, que dá uma interface simples na frente
de um subsistema com várias partes. A diferença pro Adapter está na intenção; o
Adapter converte uma interface em outra que o cliente espera, e o Facade só
simplifica o acesso a um conjunto de classes.

Saída ao rodar `node atividade2.js`:

```text
[Sistema Legado] Processando XML: <transaction><account>ACC-9988</account><amount>150</amount></transaction>
[AuditDecorator] Registrando log de auditoria para o valor R$ 200.00
[TaxDecorator] Adicionando taxa de conveniência: R$ 10.00
Processando pagamento base: R$ 210.00
[Facade] Pedido #ORD-1001 finalizado com sucesso!
```

---

## Atividade 3

**Tipo de sistema.** Aplicativo de mobilidade urbana, daqueles de corrida por
aplicativo, tipo Uber ou 99. O código tem tarifa por quilômetro, motorista que
aceita corrida, app do passageiro e painel de monitoramento da central.

**Função do bloco.** Calcula o preço da corrida conforme a categoria, controla se
o motorista pode aceitar uma nova corrida ou já está em rota e distribui a
localização do motorista pra quem precisa acompanhar. Ao rodar, a corrida
econômica de 10 km dá R$ 25, a premium dá R$ 45, o motorista aceita a primeira
solicitação e recusa a segunda, e a mesma coordenada chega nas duas telas.

**Trecho 1: cálculo da tarifa (Strategy, comportamental).** O `EconomyFare` e o
`PremiumFare` têm o mesmo método `calculateFare()` com fórmulas diferentes, R$
2,50 por km na econômica e R$ 4,00 por km mais R$ 5,00 fixos na premium. O
`RideCalculator` guarda a estratégia escolhida, o `calculate()` delega o cálculo
pra ela e o `setStrategy()` troca por outra enquanto o programa roda, que é o que
o código faz quando passa da econômica pra premium na mesma instância. O padrão é
o **Strategy**; cada algoritmo fica numa classe própria e elas são
intercambiáveis, então o calculador não precisa de um `if` pra cada tipo de
corrida.

**Trecho 2: situação do motorista (State, comportamental).** O `AvailableState` e
o `InTransitState` têm o mesmo método `handleRequest()`, e o `DriverContext`
guarda o estado atual e repassa o `requestRide()` pra ele. No estado disponível, o
motorista aceita a corrida e o próprio estado troca o contexto pra em rota com o
`setState()`; no estado em rota, o pedido é recusado. Assim a mesma chamada
`driver.requestRide()` dá respostas diferentes conforme o estado, sem nenhum `if`
perguntando em que situação o motorista está. Isso caracteriza o **State**. Na
estrutura ele lembra o Strategy, já que nos dois um contexto delega pra um objeto
que pode ser trocado, mas a troca acontece por motivos diferentes; no State quem
escolhe o próximo é o próprio estado, conforme o que aconteceu, e no Strategy quem
escolhe é quem usa, de fora.

**Trecho 3: rastreamento da localização (Observer, comportamental).** O
`LocationPublisher` mantém uma lista privada de observadores, com o `subscribe()`
pra entrar, o `unsubscribe()` pra sair e o `notify()` pra avisar todo mundo. O
`PassengerAppNotifier` e o `CentralMonitoringNotifier` são os assinantes, e cada
um tem um `update(location)` que reage do seu jeito. Uma chamada só,
`publisher.notify(...)`, percorre a lista e dispara o `update` dos dois, por isso
a coordenada aparece no app do passageiro e no painel da central ao mesmo tempo. O
padrão é o **Observer**, uma dependência de um pra muitos; o publicador não
conhece as classes dos assinantes, só sabe que todos têm o `update`, então dá pra
incluir ou tirar quem acompanha sem mexer nele.

Saída ao rodar `node atividade3.js`:

```text
Valor Corrida Econômica (10km): R$ 25
Valor Corrida Premium (10km): R$ 45
Corrida aceita! Alterando estado do motorista para 'Em Rota'...
Motorista indisponível: Já existe uma corrida em andamento.
[App Passageiro] Motorista atualizou a localização para: -1.4557, -48.4902
[Painel Central] Rastreamento GPS atualizado: -1.4557, -48.4902
```

---

## Atividade 4

**Tipo de sistema.** Back-end de um sistema acadêmico, na parte de gestão de salas
e alunos. O código tem matrícula, sala de laboratório, notas, média e aprovação, e
termina montando um objeto pra resposta HTTP em JSON, então é o pedaço que cuida
da persistência, da regra de negócio e da saída pra uma API.

**Função do bloco.** Mostra duas formas de lidar com o banco de dados e uma de
devolver o resultado. A sala grava a si mesma, enquanto o aluno tem a regra de
negócio separada do banco e é buscado por um repositório que usa um mapeador. No
fim o código busca a aluna Maria Silva, calcula a média (cerca de 9,17), define o
status como Aprovado e monta o objeto que iria na resposta da API. O `save()` do
repositório não é chamado em momento nenhum, então a linha do Data Mapper não
aparece na saída.

**Trecho 1: sala de aula (Active Record, arquitetura corporativa).** O
`ClassroomActiveRecord` guarda os dados da sala, `id` e `roomName`, e ao mesmo
tempo sabe se gravar e se apagar no banco, pelos métodos `save()` e `delete()` que
montam o `INSERT` e o `DELETE`. É um objeto pra uma linha da tabela, com a lógica
de persistência junto dentro dele. O padrão é o **Active Record**, que funciona
bem pra cadastros simples (CRUD), como o de salas, em que não tem regra de negócio
pesada.

**Trecho 2: aluno e regra de negócio (Data Mapper, arquitetura corporativa).** O
`StudentDomainModel` tem os dados do aluno em atributos privados e a regra de
negócio, o `calculateAverage()`, mas não sabe nada de banco de dados; não tem
`save()`. Quem leva o aluno pro banco é o `StudentDataMapper`, cujo
`saveToDatabase()` recebe a entidade e mapeia os atributos dela. Esse é o **Data
Mapper**, uma camada que transfere os dados entre o objeto em memória e o banco,
deixando os dois independentes um do outro. Comparando com o trecho anterior, é o
oposto; na sala o objeto se salva sozinho, e aqui o modelo de domínio fica limpo e
outra classe cuida da persistência. Isso compensa quando a regra de negócio
cresce, como a média e o status do aluno.

**Trecho 3: busca de alunos (Repository, arquitetura corporativa).** O
`StudentRepository` é o ponto por onde o resto do sistema pede alunos. O
`findByRegistration()` busca o aluno pela matrícula e devolve um
`StudentDomainModel`, e o `save()` entrega o aluno pro `StudentDataMapper`
gravar. Quem usa o repositório trabalha como se estivesse numa coleção de alunos
em memória, sem escrever SQL nem saber como o acesso ao banco é feito. É o
**Repository**, que fica entre a camada de domínio e a de persistência. No código
a busca é simulada, já que devolve sempre a Maria Silva com as três notas fixas,
mas o papel de cada classe é o mesmo de um sistema real.

**Trecho 4: resposta da API (DTO, arquitetura corporativa).** O `StudentDTO` só
tem atributos (matrícula, nome, média e status) e nenhum método, e é montado no
fim com os dados do aluno e os resultados calculados. O padrão é o **DTO (Data
Transfer Object)**, usado pra levar dados de uma camada pra outra, aqui do
back-end pro front-end em JSON. Ele entrega só o que a tela precisa, sem expor as
notas individuais nem o modelo de domínio inteiro, e leva tudo de uma vez em vez
de vários pedidos.

Saída ao rodar `node atividade4.js`:

```text
[Active Record] INSERT INTO classrooms (id, name) VALUES ('LAB-01', 'Laboratório de Informática')
[Repository] Buscando registros do aluno 2026-IFPA-1020 no BD...
Objeto DTO pronto para resposta HTTP JSON: {
  "registration": "2026-IFPA-1020",
  "fullName": "Maria Silva",
  "average": 9.166666666666666,
  "status": "Aprovado"
}
```
