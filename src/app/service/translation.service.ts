import { Injectable, signal } from '@angular/core';

type Lang = 'pt' | 'en';

type TranslationKeys =
  | 'appTitle'
  | 'createdBy'
  | 'languageLabel'
  | 'idbalanceLabel'
  | 'nameLabel'
  | 'namePayeeLabel'
  | 'namePayerLabel'
  | 'amountLabel'
  | 'balanceLabel'
  | 'freeLabel'
  | 'noFreeLabel'
  | 'newAmountButton'
  | 'substAmountButton'
  | 'addAmountButton'
  | 'decreaseAmountButton'
  | 'editSelectItemsButton'
  | 'removeSelectItemsButton'
  | 'clearFieldsButton'
  | 'balanceTab'
  | 'refundTab'
  | 'balanceHeader'
  | 'refundHeader'
  | 'clearTableButton'
  | 'solveRefundButton'
  | 'emptyNameAlert'
  | 'select'
  | 'deselect'
  | 'all'
  | 'row'
  | 'noLabel'
  | 'forPerson'
  | 'refundColumn'
  | 'currentBalance'
  | 'positiveBalance'
  | 'noPayee'
  | 'payee'
  | 'amountPayee'
  | 'balancePayee'
  | 'positiveBalancePayee'
  | 'currentBalancePayee'
  | 'noPayer'
  | 'payer'
  | 'amountPayer'
  | 'balancePayer'
  | 'freePayer'
  | 'tableTotal'
  | 'currencyPrefix'
  | 'exportJsonButton'
  | 'importJsonButton';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  public language = signal<Lang>('pt');

  private translations: Record<TranslationKeys, { pt: string; en: string }> = {
    appTitle: { pt: 'Rachadinha', en: 'Rachadinha' },
    createdBy: { pt: 'para Embiro criado por Surungo', en: 'for Embiro created by Surungo' },
    languageLabel: { pt: 'Idioma', en: 'Language' },
    idbalanceLabel: { pt: 'idbalance', en: 'idbalance' },
    nameLabel: { pt: 'Nome', en: 'Name' },
    namePayeeLabel: { pt: 'Recebedor', en: 'Payee' },
    namePayerLabel: { pt: 'Pagador', en: 'Payer' },
    amountLabel: { pt: 'Valor', en: 'Amount' },
    balanceLabel: { pt: 'Saldo', en: 'Balance' },
    freeLabel: { pt: 'Grátis', en: 'Free' },
    noFreeLabel: { pt: 'Não Grátis', en: 'Not Free' },
    newAmountButton: { pt: 'Novo valor', en: 'New amount' },
    substAmountButton: { pt: 'Substituir valor', en: 'Replace amount' },
    addAmountButton: { pt: 'Adicionar valor', en: 'Add amount' },
    decreaseAmountButton: { pt: 'Diminuir valor', en: 'Decrease amount' },
    editSelectItemsButton: { pt: 'Editar item selecionado', en: 'Edit selected item' },
    removeSelectItemsButton: { pt: 'Remover itens selecionados', en: 'Remove selected items' },
    clearFieldsButton: { pt: 'Limpar campos', en: 'Clear fields' },
    balanceTab: { pt: 'Saldo', en: 'Balance' },
    refundTab: { pt: 'Reembolso', en: 'Refund' },
    balanceHeader: { pt: 'Saldo', en: 'Balance' },
    refundHeader: { pt: 'Reembolso', en: 'Refund' },
    clearTableButton: { pt: 'Limpar tabela', en: 'Clear table' },
    solveRefundButton: { pt: 'Resolver reembolso', en: 'Solve refund' },
    emptyNameAlert: { pt: 'Preencha um nome', en: 'Please fill a name' },
    select: { pt: 'selecionar', en: 'select' },
    deselect: { pt: 'desmarcar', en: 'deselect' },
    all: { pt: 'todos', en: 'all' },
    row: { pt: 'linha', en: 'row' },
    noLabel: { pt: 'Nº', en: 'No.' },
    forPerson: { pt: 'por pessoa', en: 'for person' },
    refundColumn: { pt: 'Reembolso', en: 'Refund' },
    currentBalance: { pt: 'Saldo atual', en: 'Current Balance' },
    positiveBalance: { pt: 'Saldo positivo', en: 'Positive Balance' },
    noPayee: { pt: 'Nº. Recebedor', en: 'No. Payee' },
    payee: { pt: 'Recebedor', en: 'Payee' },
    amountPayee: { pt: 'Valor Recebedor', en: 'Amount Payee' },
    balancePayee: { pt: 'Saldo Recebedor', en: 'Balance Payee' },
    positiveBalancePayee: { pt: 'Saldo Positivo Recebedor', en: 'Positive Balance Payee' },
    currentBalancePayee: { pt: 'Saldo Atual Recebedor', en: 'Current Balance Payee' },
    noPayer: { pt: 'Nº. Pagador', en: 'No. Payer' },
    payer: { pt: 'Pagador', en: 'Payer' },
    amountPayer: { pt: 'Valor Pagador', en: 'Amount Payer' },
    balancePayer: { pt: 'Saldo Pagador', en: 'Balance Payer' },
    freePayer: { pt: 'Pagador Gratuito', en: 'Free Payer' },
    tableTotal: { pt: 'Total', en: 'Total' },
    currencyPrefix: { pt: 'R$ ', en: '$ ' },
    exportJsonButton: { pt: 'Exportar JSON', en: 'Export JSON' },
    importJsonButton: { pt: 'Importar JSON', en: 'Import JSON' }
  };

  translate(key: TranslationKeys): string {
    return this.translations[key]?.[this.language()] ?? key;
  }

  setLanguage(language: Lang) {
    this.language.set(language);
  }
}
